import Colors from '@/constants/Colors';
import { Audio } from 'expo-av';
import { Mic } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface SpeechInterfaceProps {
  onTranscriptionResult: (text: string) => void;
  audioUri: string | null;
}

const API_URL = 'https://r3iny0c7rnsoad-8888.proxy.runpod.net';

export default function SpeechInterface({ onTranscriptionResult }: SpeechInterfaceProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [duration, setDuration] = useState(0);
  const [metering, setMetering] = useState<number | null>(null);
  const [audioLevels, setAudioLevels] = useState<number[]>([]); // For the audio graph

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isRecording && recording) {
      interval = setInterval(async () => {
        try {
          const status = await recording.getStatusAsync();
          if (status.isRecording) {
            setDuration(status.durationMillis || 0);
            setMetering(status.metering || null);

            // Update audio levels for the graph
            setAudioLevels((prev) => [...prev.slice(-30), status.metering || -60]); // Keep last 30 levels
          }
        } catch (error) {
          console.error('Error getting recording status:', error);
        }
      }, 100);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRecording, recording]);

  const startRecording = async () => {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Error', 'Permission to access microphone was denied');
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      setRecording(recording);
      setIsRecording(true);
      setDuration(0);
      setAudioLevels([]); // Reset audio levels
    } catch (err) {
      console.error('Failed to start recording:', err);
      Alert.alert('Error', 'Failed to start recording. Please try again.');
    }
  };

  const stopRecording = async () => {
    if (!recording) return;

    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      if (!uri) throw new Error('No recording URI available');

      setRecording(null);
      setIsRecording(false);

      // Send the audio file to the transcription API
      const formData = new FormData();
      formData.append('audio', {
        uri,
        type: 'audio/m4a',
        name: 'recording.m4a',
      } as any);

      const response = await fetch(`${API_URL}/transcribe`, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Transcription failed: ${errorText}`);
      }

      const data = await response.json();
      if (data.text.trim().length === 0) {
        Alert.alert('Info', 'No speech detected in the recording');
        return;
      }

      onTranscriptionResult(data.text);
    } catch (error) {
      console.error('Failed to process recording:', error);
      Alert.alert('Error', 'Failed to process recording. Please try again.');
    }
  };

  const handlePressIn = () => {
    startRecording();
  };

  const handlePressOut = () => {
    stopRecording();
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
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          activeOpacity={1}
          delayPressIn={0}
          delayPressOut={0}
        >
          {isRecording ? (
            <Text style={styles.buttonText}>Recording...</Text>
          ) : (
            <Mic color={Colors.white} size={40} />
          )}
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>
        {isRecording ? `Recording... ${formatDuration(duration)}` : 'Tap and hold to speak'}
      </Text>

      {isRecording && (
        <View style={styles.audioGraph}>
          {audioLevels.map((level, index) => (
            <View
              key={index}
              style={[
                styles.audioBar,
                { height: `${Math.min(100, Math.max(0, (level + 60) * 1.67))}%` },
              ]}
            />
          ))}
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
    marginBottom: 16,
  },
  button: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.primary[500],
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordingButton: {
    backgroundColor: Colors.error[500],
  },
  buttonText: {
    color: Colors.white,
    fontFamily: 'Inter-Bold',
    fontSize: 14,
    textAlign: 'center',
  },
  label: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.gray[600],
    marginTop: 8,
    textAlign: 'center',
  },
  audioGraph: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    height: 100,
    width: '100%',
    marginTop: 16,
    backgroundColor: Colors.gray[200],
    borderRadius: 8,
    overflow: 'hidden',
  },
  audioBar: {
    width: 4,
    marginHorizontal: 1,
    backgroundColor: Colors.primary[500],
  },
});