import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '@/constants/Colors';
import { Mic, MicOff, RefreshCcw, Volume2 } from 'lucide-react-native';

type PracticeItem = {
  id: string;
  text: string;
  type: 'vowel' | 'word';
  pronunciation: string;
};

const practiceItems: PracticeItem[] = [
  // Vowels
  { id: 'v1', text: 'a', type: 'vowel', pronunciation: 'ah' },
  { id: 'v2', text: 'e', type: 'vowel', pronunciation: 'eh' },
  { id: 'v3', text: 'ɛ', type: 'vowel', pronunciation: 'eh' },
  { id: 'v4', text: 'i', type: 'vowel', pronunciation: 'ee' },
  { id: 'v5', text: 'o', type: 'vowel', pronunciation: 'oh' },
  { id: 'v6', text: 'ɔ', type: 'vowel', pronunciation: 'aw' },
  { id: 'v7', text: 'u', type: 'vowel', pronunciation: 'oo' },
  
  // Words
  { id: 'w1', text: 'Kasa', type: 'word', pronunciation: 'kah-sah' },
  { id: 'w2', text: 'Yie', type: 'word', pronunciation: 'yee-eh' },
  { id: 'w3', text: 'Me', type: 'word', pronunciation: 'meh' },
  { id: 'w4', text: 'Wo', type: 'word', pronunciation: 'woh' },
  { id: 'w5', text: 'Yɛn', type: 'word', pronunciation: 'yen' },
];

export default function PhrasesScreen() {
  const [selectedItem, setSelectedItem] = useState<PracticeItem | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleItemSelect = (item: PracticeItem) => {
    setSelectedItem(item);
    setTranscription('');
    setIsCorrect(null);
    // TODO: Play audio when expo-speech is installed
    console.log('Play pronunciation:', item.text);
  };

  const handleStartRecording = async () => {
    if (!selectedItem) return;
    
    setIsRecording(true);
    setIsLoading(true);
    // TODO: Implement ASR recording and transcription
    // For now, simulate ASR with a timeout
    setTimeout(() => {
      setTranscription(selectedItem.text); // Simulated transcription
      setIsLoading(false);
      checkTranscription(selectedItem.text);
    }, 2000);
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    setIsLoading(false);
  };

  const checkTranscription = (text: string) => {
    if (!selectedItem) return;
    
    const isMatch = text.toLowerCase() === selectedItem.text.toLowerCase();
    setIsCorrect(isMatch);
  };

  const handleTryAgain = () => {
    setTranscription('');
    setIsCorrect(null);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Speech Practice</Text>
      </View>

      <ScrollView style={styles.content}>
        {selectedItem ? (
          <View style={styles.practiceCard}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => setSelectedItem(null)}
            >
              <Text style={styles.backButtonText}>← Back to List</Text>
      </TouchableOpacity>

            <Text style={styles.practiceType}>
              {selectedItem.type === 'vowel' ? 'Vowel' : 'Word'} Practice
            </Text>
            
            <View style={styles.wordContainer}>
              <Text style={styles.wordText}>{selectedItem.text}</Text>
              <View style={styles.pronunciationRow}>
                <Volume2 size={16} color={Colors.gray[600]} />
                <Text style={styles.pronunciationText}>
                  {selectedItem.pronunciation}
                </Text>
              </View>
        </View>

            <View style={styles.recordingSection}>
              {isLoading ? (
                <ActivityIndicator size="large" color={Colors.primary[500]} />
              ) : (
                <TouchableOpacity
                  style={[styles.recordButton, isRecording && styles.recordingButton]}
                  onPress={isRecording ? handleStopRecording : handleStartRecording}
                >
                  {isRecording ? (
                    <MicOff color={Colors.white} size={32} />
                  ) : (
                    <Mic color={Colors.white} size={32} />
                  )}
      </TouchableOpacity>
              )}
            </View>

            {transcription && (
              <View style={styles.transcriptionContainer}>
                <Text style={styles.transcriptionLabel}>Your Speech:</Text>
                <Text style={[
                  styles.transcriptionText,
                  isCorrect === true && styles.correctText,
                  isCorrect === false && styles.incorrectText
                ]}>
                  {transcription}
                </Text>
                {isCorrect === false && (
                  <TouchableOpacity 
                    style={styles.tryAgainButton}
                    onPress={handleTryAgain}
                  >
                    <RefreshCcw size={16} color={Colors.primary[500]} />
                    <Text style={styles.tryAgainText}>Try Again</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
        </View>
        ) : (
          <View style={styles.gridContainer}>
            <Text style={styles.sectionTitle}>Vowels</Text>
            <View style={styles.grid}>
              {practiceItems
                .filter(item => item.type === 'vowel')
                .map(item => (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.gridItem}
                    onPress={() => handleItemSelect(item)}
                  >
                    <Text style={styles.gridItemText}>{item.text}</Text>
      </TouchableOpacity>
                ))}
        </View>

            <Text style={styles.sectionTitle}>Words</Text>
            <View style={styles.grid}>
              {practiceItems
                .filter(item => item.type === 'word')
                .map(item => (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.gridItem}
                    onPress={() => handleItemSelect(item)}
                  >
                    <Text style={styles.gridItemText}>{item.text}</Text>
      </TouchableOpacity>
                ))}
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
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
  },
  headerTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: Colors.primary[700],
  },
  content: {
    flex: 1,
    padding: 16,
  },
  gridContainer: {
    gap: 24,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: Colors.gray[700],
    marginBottom: 12,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  gridItem: {
    width: '30%',
    aspectRatio: 1,
    backgroundColor: Colors.primary[100],
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.primary[200],
  },
  gridItemText: {
    fontFamily: 'Inter-Bold',
    fontSize: 32,
    color: Colors.primary[700],
  },
  practiceCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  backButton: {
    marginBottom: 16,
  },
  backButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: Colors.primary[500],
  },
  practiceType: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: Colors.gray[600],
    marginBottom: 16,
  },
  wordContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  wordText: {
    fontFamily: 'Inter-Bold',
    fontSize: 48,
    color: Colors.primary[700],
    marginBottom: 8,
  },
  pronunciationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  pronunciationText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: Colors.gray[600],
  },
  recordingSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  recordButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary[500],
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  recordingButton: {
    backgroundColor: Colors.error[500],
  },
  transcriptionContainer: {
    alignItems: 'center',
  },
  transcriptionLabel: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: Colors.gray[600],
    marginBottom: 8,
  },
  transcriptionText: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: Colors.gray[900],
    marginBottom: 16,
  },
  correctText: {
    color: Colors.success[500],
  },
  incorrectText: {
    color: Colors.error[500],
  },
  tryAgainButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  tryAgainText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: Colors.primary[500],
    marginLeft: 4,
  },
});
