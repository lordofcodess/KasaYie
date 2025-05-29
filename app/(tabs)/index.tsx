import { Audio } from 'expo-av';
import * as Clipboard from 'expo-clipboard';
import * as FileSystem from 'expo-file-system';
import * as Share from 'expo-sharing';
import { StatusBar } from 'expo-status-bar';
import { Copy, QrCode, Send } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Linking,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import uuid from 'react-native-uuid';
import { io, Socket } from 'socket.io-client';

import SpeechInterface from '@/components/SpeechInterface';
import Colors from '@/constants/Colors';

// Conditionally import QRCodeSVG for native
let QRCodeSVG: React.ComponentType<{ value: string; size: number }> | undefined;
if (Platform.OS !== 'web') {
  QRCodeSVG = require('react-native-qrcode-svg').default;
}

const SOCKET_URL = 'http://10.18.108.111:3000';
const API_URL = 'http://10.18.108.111:3000';

export default function HomeScreen() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [roomId, setRoomId] = useState<string>(uuid.v4().toString());
  const [text, setText] = useState<string>('');
  const [transcription, setTranscription] = useState<string>('');
  const [showQRModal, setShowQRModal] = useState(false);
  const [transcribedText, setTranscribedText] = useState<string | null>(null);
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [audioUri, setAudioUri] = useState<string | null>(null);

  useEffect(() => {
    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);

    newSocket.on('connect', () => {
      newSocket.emit('join-room', roomId);
    });

    return () => {
      newSocket.disconnect();
    };
  }, [roomId]);

  // const handleChange = (val: string) => {
  //   setText(val);
  //   socket?.emit('send-text', { roomId, text: val });
  // };

  
const handleChange = (val: string) => {
  setTranscription(val); // Update the displayed state
  if (socket) {
    socket.emit('send-text', { roomId, text: val });
  }
};
  const handleCopy = async () => {
    await Clipboard.setStringAsync(transcription);
  };

  const handleShare = async () => {
    try {
      await Share.shareAsync(transcription);
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  // Update the transcription result handler
const handleTranscriptionResult = (text: string) => {
  setTranscribedText(text); // Save the transcribed text for review
};

const handleApprove = async () => {
  if (!transcription) {
    Alert.alert('Error', 'No transcription available to synthesize.');
    return;
  }

  try {
    setIsSynthesizing(true);
    console.log(`Sending transcription to ${API_URL}/synthesize`);

    const response = await fetch(`${API_URL}/synthesize?text=${encodeURIComponent(transcription)}`, {
      method: 'GET',
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Synthesis failed:', errorText);
      throw new Error(`Synthesis failed: ${errorText}`);
    }

    const blob = await response.blob();
    const fileUri = `${FileSystem.documentDirectory}audio.wav`;
    await FileSystem.writeAsStringAsync(fileUri, await blob.text(), {
      encoding: FileSystem.EncodingType.Base64,
    });

    setAudioUri(fileUri);
    Alert.alert('Success', 'Speech synthesized successfully.');
  } catch (error) {
    console.error('Failed to synthesize speech:', error);
    Alert.alert('Error', 'Failed to synthesize speech. Please try again.');
  } finally {
    setIsSynthesizing(false);
  }
};

const playAudio = async (uri: string) => {
  if (!uri) {
    Alert.alert('Error', 'No audio available to play.');
    return;
  }

  try {
    const { sound } = await Audio.Sound.createAsync({ uri });
    await sound.playAsync();
  } catch (error) {
    console.error('Failed to play audio:', error);
    Alert.alert('Error', 'Failed to play audio. Please try again.');
  }
};

const handleSaveAudio = async () => {
  if (!audioUri) {
    Alert.alert('Error', 'No audio available to save.');
    return;
  }

  try {
    const fileUri = `${FileSystem.documentDirectory}saved_audio.wav`;
    await FileSystem.copyAsync({
      from: audioUri,
      to: fileUri,
    });
    Alert.alert('Success', 'Audio saved successfully.');
  } catch (error) {
    console.error('Failed to save audio:', error);
    Alert.alert('Error', 'Failed to save audio. Please try again.');
  }
};

const handleShareAudio = async () => {
  if (!audioUri) {
    Alert.alert('Error', 'No audio available to share.');
    return;
  }

  try {
    await Share.shareAsync(audioUri);
  } catch (error) {
    console.error('Failed to share audio:', error);
    Alert.alert('Error', 'Failed to share audio. Please try again.');
  }
};

  return (
    <>
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <StatusBar style="dark" />
        <View style={styles.header}>
          <Text style={styles.title}>Transcribe</Text>
          <TouchableOpacity style={styles.qrButton} onPress={() => setShowQRModal(true)}>
            <QrCode color={Colors.primary[700]} size={24} />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <View style={styles.transcriptionContainer}>
            <TextInput
              style={styles.transcriptionInput}
              multiline
              placeholder="Your transcription will appear here..."
              value={transcription}
              onChangeText={setTranscription} // Update the transcription state
              placeholderTextColor={Colors.gray[400]}
            />

            {transcription ? (
              <View style={styles.actionButtons}>
                <TouchableOpacity style={styles.actionButton} onPress={handleCopy}>
                  <Copy color={Colors.white} size={24} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton} onPress={handleApprove}>
                  <Text style={styles.actionButtonText}>Approve</Text>
                </TouchableOpacity>
              </View>
            ) : null}
          </View>

          <View style={styles.controls}>
            <SpeechInterface onTranscriptionResult={setTranscription} />

            {transcription ? (
              <TouchableOpacity style={styles.sendButton}>
                <Send color={Colors.white} size={24} />
              </TouchableOpacity>
            ) : null}
          </View>
        </View>
      </SafeAreaView>

      {/* QR Code Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showQRModal}
        onRequestClose={() => setShowQRModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Share this Room</Text>
            {Platform.OS !== 'web' && QRCodeSVG ? (
              <QRCodeSVG
                value={`http://10.18.108.111:5173/?room=${roomId}`}
                size={200}
              />
            ) : (
              <TouchableOpacity
                onPress={() =>
                  Linking.openURL(`http://10.18.108.111:5173/?room=${roomId}`)
                }
              >
                <Text style={styles.qrFallbackText}>
                  Open room: http://10.18.108.111:5173/?room={roomId}
                </Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowQRModal(false)}
            >
              <Text style={styles.modalCloseText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {audioUri && (
  <View style={styles.actionButtons}>
    <TouchableOpacity style={styles.actionButton} onPress={handleSaveAudio}>
      <Text style={styles.actionButtonText}>Save</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.actionButton} onPress={handleShareAudio}>
      <Text style={styles.actionButtonText}>Share</Text>
    </TouchableOpacity>
  </View>
)}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[200],
    backgroundColor: Colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: Colors.primary[700],
  },
  qrButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    padding: 16,
    justifyContent: 'space-between',
  },
  transcriptionContainer: {
    backgroundColor: Colors.gray[100],
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  transcriptionInput: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: Colors.gray[800],
    textAlignVertical: 'top',
    minHeight: 100,
    maxHeight: 160,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  actionButton: {
    backgroundColor: Colors.primary[500],
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    marginTop: 'auto',
    paddingBottom: 16,
  },
  sendButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary[500],
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: Colors.white,
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    elevation: 10,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    width: '80%',
  },
  modalTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    marginBottom: 16,
    color: Colors.primary[700],
  },
  modalCloseButton: {
    marginTop: 24,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: Colors.primary[500],
    borderRadius: 8,
  },
  modalCloseText: {
    color: Colors.white,
    fontFamily: 'Inter-Medium',
    fontSize: 16,
  },
  qrFallbackText: {
    color: Colors.primary[600],
    textDecorationLine: 'underline',
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  approveButton: {
    backgroundColor: Colors.primary[500],
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 16,
  },
  approveButtonText: {
    color: Colors.white,
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    textAlign: 'center',
  },
  actionButtonText: {
    color: Colors.white,
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    textAlign: 'center',
  },
});





