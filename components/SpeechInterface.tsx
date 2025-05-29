import Colors from '@/constants/Colors';
import { Audio } from 'expo-av';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Mic, MicOff, Share } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
interface SpeechInterfaceProps {
  onTranscriptionResult: (text: string) => void;
}

const API_URL = 'http://192.168.100.45:8000'; 
// const API_URL = 'http://127.0.0.1:8000';

export default function SpeechInterface({ onTranscriptionResult }: SpeechInterfaceProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [duration, setDuration] = useState(0);
  const [metering, setMetering] = useState<number | null>(null);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isRecording && recording) {
      console.log('Starting duration update interval');
      interval = setInterval(async () => {
        try {
          const status = await recording.getStatusAsync();
          console.log('Recording status:', status);
          if (status.isRecording) {
            console.log('Updating duration:', status.durationMillis);
            setDuration(status.durationMillis || 0);
            setMetering(status.metering || null);
          }
        } catch (error) {
          console.error('Error getting recording status:', error);
        }
      }, 100);
    }
    return () => {
      if (interval) {
        console.log('Clearing duration update interval');
        clearInterval(interval);
      }
    };
  }, [isRecording, recording]);

  const startRecording = async () => {
    try {
      console.log('Requesting permissions...');
      const { status } = await Audio.requestPermissionsAsync();
      console.log('Permission status:', status);
      
      if (status !== 'granted') {
        Alert.alert('Error', 'Permission to access microphone was denied');
        return;
      }

      console.log('Setting audio mode...');
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      console.log('Starting recording...');
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY,
        (status) => {
          console.log('Recording status update:', status);
          setMetering(status.metering || null);
        },
        100
      );
      console.log('Recording created successfully');
      setRecording(recording);
      setIsRecording(true);
      setDuration(0);
      console.log('Recording started successfully');
    } catch (err) {
      console.error('Failed to start recording:', err);
      Alert.alert('Error', 'Failed to start recording. Please try again.');
    }
  };

  const stopRecording = async () => {
    if (!recording) {
      console.log('No recording in progress');
      return;
    }

    try {
      console.log('Stopping recording...');
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      console.log('Recording URI:', uri);
      
      if (!uri) {
        throw new Error('No recording URI available');
      }

      // Check if the file exists
      const fileInfo = await FileSystem.getInfoAsync(uri);
      console.log('File info:', fileInfo);
      if (!fileInfo.exists) {
        throw new Error('Recording file does not exist');
      }

      // Check file size
      if (fileInfo.size === 0) {
        throw new Error('Recording file is empty');
      }

      setRecording(null);
      setIsRecording(false);

      // Send the audio file to the transcription API
      console.log('Preparing to send to API...');
      const formData = new FormData();
      formData.append('audio', {
        uri,
        type: 'audio/m4a',
        name: 'recording.m4a',
      } as any);

      console.log('Sending to API:', `${API_URL}/transcribe`);
      
      // Add timeout for the API request
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

      try {
        const response = await fetch(`http://127.0.0.1:8000/transcribe`, {
          method: 'POST',
          body: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        console.log('API Response status:', response.status);
        
        if (!response.ok) {
          let errorMessage = `HTTP ${response.status}`;
          try {
            const errorText = await response.text();
            console.error('API Error:', errorText);
            errorMessage = errorText || errorMessage;
          } catch (parseError) {
            console.error('Error parsing API error response:', parseError);
          }
          throw new Error(`Transcription failed: ${errorMessage}`);
        }

        let data;
        try {
          data = await response.json();
        } catch (parseError) {
          console.error('Error parsing API response:', parseError);
          throw new Error('Invalid response format from transcription service');
        }

        console.log('API Response data:', data);
        
        if (!data || typeof data.text !== 'string') {
          throw new Error('Invalid transcription response format');
        }

        if (data.text.trim().length === 0) {
          Alert.alert('Info', 'No speech detected in the recording');
          return;
        }

        onTranscriptionResult(data.text);
      } catch (fetchError: any) {
        clearTimeout(timeoutId);
        
        if (fetchError.name === 'AbortError') {
          throw new Error('Request timeout - please try again');
        }
        
        if (fetchError.message.includes('Network request failed')) {
          throw new Error('Network error - check your connection and server');
        }
        
        throw fetchError;
      }

      // Clean up the temporary file
      try {
        await FileSystem.deleteAsync(uri, { idempotent: true });
        console.log('Temporary recording file cleaned up');
      } catch (cleanupError) {
        console.warn('Failed to clean up temporary file:', cleanupError);
      }

    } catch (error: any) {
      console.error('Failed to process recording:', error);
      
      // Reset state on error
      setRecording(null);
      setIsRecording(false);
      setDuration(0);
      setMetering(null);
      
      // Show user-friendly error messages
      let userMessage = 'Failed to process recording. Please try again.';
      
      if (error.message.includes('timeout')) {
        userMessage = 'Request timed out. Please check your connection and try again.';
      } else if (error.message.includes('Network')) {
        userMessage = 'Network error. Please check your connection and server status.';
      } else if (error.message.includes('empty')) {
        userMessage = 'Recording is empty. Please try recording again.';
      } else if (error.message.includes('No speech detected')) {
        userMessage = 'No speech detected. Please speak clearly and try again.';
      }
      
      Alert.alert('Error', userMessage);
    }
  };

  const handlePress = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const formatDuration = (milliseconds: number) => {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const pickAndShareAudio = async () => {
    try {
      console.log('Opening document picker...');
      const result = await DocumentPicker.getDocumentAsync({
        type: 'audio/*',
        copyToCacheDirectory: true,
      });

      if (result.canceled) {
        console.log('User cancelled audio selection');
        return;
      }

      const audioFile = result.assets[0];
      console.log('Selected audio file:', audioFile);

      if (!audioFile.uri) {
        throw new Error('No file selected');
      }

      // Check file size (limit to 25MB)
      if (audioFile.size && audioFile.size > 25 * 1024 * 1024) {
        Alert.alert('Error', 'File size too large. Please select a file smaller than 25MB.');
        return;
      }

      // Copy the audio file to a permanent directory for sharing
      const documentsDir = FileSystem.documentDirectory;
      const fileName = audioFile.name || `audio_${Date.now()}.m4a`;
      const permanentUri = `${documentsDir}${fileName}`;
      
      console.log('Copying file to permanent location:', permanentUri);
      await FileSystem.copyAsync({
        from: audioFile.uri,
        to: permanentUri,
      });

      // Share the audio file directly to other apps
      console.log('Sharing audio file:', fileName);
      await shareAudioFile(permanentUri, fileName);

    } catch (error: any) {
      console.error('Failed to process audio file:', error);
      
      // Show user-friendly error messages
      let userMessage = 'Failed to process audio file. Please try again.';
      
      if (error.message.includes('No file selected')) {
        userMessage = 'No file selected. Please choose an audio file.';
      } else if (error.message.includes('File size too large')) {
        userMessage = 'File size too large. Please select a smaller audio file.';
      } else if (error.message.includes('Sharing is not available')) {
        userMessage = 'Sharing is not available on this device.';
      }
      
      Alert.alert('Error', userMessage);
    }
  };

  const shareAudioFile = async (audioUri: string, fileName: string) => {
    try {
      if (!(await Sharing.isAvailableAsync())) {
        Alert.alert('Error', 'Sharing is not available on this device');
        return;
      }

      await Sharing.shareAsync(audioUri, {
        mimeType: 'audio/mpeg',
        dialogTitle: `Share ${fileName}`,
        UTI: 'public.audio',
      });
      
      console.log('Audio file shared successfully');
    } catch (error) {
      console.error('Failed to share audio file:', error);
      Alert.alert('Error', 'Failed to share audio file');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.button, isRecording && styles.recordingButton]} 
          onPress={handlePress}
        >
          {isRecording ? (
            <MicOff color={Colors.white} size={24} />
          ) : (
            <Mic color={Colors.white} size={24} />
          )}
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, styles.shareButton]} 
          onPress={pickAndShareAudio}
        >
          <Share color={Colors.white} size={20} />
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>
        {isRecording ? `Recording... ${formatDuration(duration)}` : 'Tap to speak or share audio'}
      </Text>
      
      {isRecording && metering !== null && (
        <View style={styles.meterContainer}>
          <View 
            style={[
              styles.meter, 
              { width: `${Math.min(100, Math.max(0, (metering + 60) * 1.67))}%` }
            ]} 
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  button: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.primary[500],
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  recordingButton: {
    backgroundColor: Colors.error[500],
  },
  label: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.gray[600],
    marginBottom: 8,
    textAlign: 'center',
  },
  meterContainer: {
    width: '100%',
    height: 4,
    backgroundColor: Colors.gray[200],
    borderRadius: 2,
    overflow: 'hidden',
  },
  meter: {
    height: '100%',
    backgroundColor: Colors.primary[500],
  },
  shareButton: {
    backgroundColor: Colors.gray[500],
    width: 56,
    height: 56,
    borderRadius: 28,
  },
});