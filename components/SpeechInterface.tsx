import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import Colors from '@/constants/Colors';
import { Mic, MicOff } from 'lucide-react-native';
import * as FileSystem from 'expo-file-system';
import { Audio } from 'expo-av';

interface SpeechInterfaceProps {
  onTranscriptionResult: (text: string) => void;
}

const API_URL = 'http://192.168.1.32:8000';

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
      const response = await fetch(`${API_URL}/transcribe`, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('API Response status:', response.status);
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error:', errorText);
        throw new Error(`Transcription failed: ${errorText}`);
      }

      const data = await response.json();
      console.log('API Response data:', data);
      onTranscriptionResult(data.text);
    } catch (error: any) {
      console.error('Failed to process recording:', error);
      Alert.alert('Error', `Failed to process recording: ${error.message}`);
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
  button: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.primary[500],
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  recordingButton: {
    backgroundColor: Colors.error[500],
  },
  label: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.gray[600],
    marginBottom: 8,
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