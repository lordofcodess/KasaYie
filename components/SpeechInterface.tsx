import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import  Colors  from '@/constants/Colors';
import { Mic, MicOff } from 'lucide-react-native';

interface SpeechInterfaceProps {
  onTranscriptionResult: (text: string) => void;
}

export default function SpeechInterface({ onTranscriptionResult }: SpeechInterfaceProps) {
  const [isRecording, setIsRecording] = useState(false);

  const handlePress = () => {
    setIsRecording(!isRecording);
    // In a real app, this would handle speech recognition
    if (!isRecording) {
      // Simulate transcription result
      setTimeout(() => {
        onTranscriptionResult('Sample transcription');
      }, 1000);
    }
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
        {isRecording ? 'Recording...' : 'Tap to speak'}
      </Text>
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
  },
});