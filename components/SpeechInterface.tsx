import Colors from '@/constants/Colors';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import { Mic, MicOff } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
interface SpeechInterfaceProps {
  onTranscriptionResult: (text: string) => void;
  audioUri: string | null;
}

const API_URL = 'https://2133-213-173-98-73.ngrok-free.app';

export default function SpeechInterface({ onTranscriptionResult, audioUri }: SpeechInterfaceProps) {
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
        const response = await fetch(`${API_URL}/transcribe`, {
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


  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.button, isRecording && styles.recordingButton]} 
          onPress={handlePress}
        >
          {isRecording ? (
            <MicOff color={Colors.white} size={30} />
          ) : (
            <Mic color={Colors.white} size={30} />
          )}
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>
        {isRecording ? `Recording... ${formatDuration(duration)}` : 'Tap to speak'}
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
    width: 100,
    height: 100,
    borderRadius: 40,
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
});