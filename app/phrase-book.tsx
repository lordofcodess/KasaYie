import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '@/constants/Colors';
import { BookOpen, ChevronLeft, Volume2 } from 'lucide-react-native';
import { router } from 'expo-router';

type Category = {
  id: string;
  name: string;
  icon: string;
  color: string;
};

type Phrase = {
  english: string;
  akan: string;
};

export default function PhraseBookScreen() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const categories: Category[] = [
    { id: 'greetings', name: 'Greetings', icon: '👋', color: '#4ECDC4' },
    { id: 'basic', name: 'Basic Needs', icon: '🍽️', color: '#FF6B6B' },
    { id: 'medical', name: 'Medical', icon: '🏥', color: '#45B7D1' },
    { id: 'emergency', name: 'Emergency', icon: '🚨', color: '#FF9F43' },
  ];

  const phrases: Record<string, Phrase[]> = {
    greetings: [
      { english: 'Hello', akan: 'Aane' },
      { english: 'How are you?', akan: 'Wo ho te sɛn?' },
      { english: 'Good morning', akan: 'Maakye' },
    ],
    basic: [
      { english: 'I need water', akan: 'Me hia nsuo' },
      { english: 'I am hungry', akan: 'Me kɔm de me' },
      { english: 'I need to use the bathroom', akan: 'Me hia me kɔ toilet' },
    ],
    medical: [
      { english: 'I am in pain', akan: 'Me ho yaw' },
      { english: 'I need medicine', akan: 'Me hia duro' },
      { english: 'I feel sick', akan: 'Me ho te sɛn yarefo' },
    ],
    emergency: [
      { english: 'Help me', akan: 'Boafo me' },
      { english: 'Call an ambulance', akan: 'Frɛ ambulance' },
      { english: 'I need a doctor', akan: 'Me hia oduruyɛfo' },
    ],
  };

  const speakPhrase = async (phrase: Phrase) => {
    try {
      if (isSpeaking) {
        await Speech.stop();
        setIsSpeaking(false);
        return;
      }

      setIsSpeaking(true);
      await Speech.speak(phrase.akan, {
        language: 'en-US', // TODO: Change to appropriate language code for Akan
        onDone: () => setIsSpeaking(false),
        onError: () => {
          setIsSpeaking(false);
          Alert.alert('Error', 'Failed to play audio. Please try again.');
        },
      });
    } catch (error) {
      setIsSpeaking(false);
      Alert.alert('Error', 'Failed to play audio. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft color={Colors.primary[700]} size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Phrase Book</Text>
        <BookOpen color={Colors.primary[700]} size={24} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.categoriesContainer}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryCard,
                { backgroundColor: category.color + '20' },
                selectedCategory === category.id && styles.selectedCategory,
              ]}
              onPress={() => setSelectedCategory(category.id)}
            >
              <Text style={styles.categoryIcon}>{category.icon}</Text>
              <Text style={styles.categoryName}>{category.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {selectedCategory && (
          <View style={styles.phrasesContainer}>
            <Text style={styles.sectionTitle}>Common Phrases</Text>
            {phrases[selectedCategory].map((phrase, index) => (
              <TouchableOpacity
                key={index}
                style={styles.phraseCard}
                onPress={() => speakPhrase(phrase)}
              >
                <View style={styles.phraseContent}>
                  <Text style={styles.phraseEnglish}>{phrase.english}</Text>
                  <Text style={styles.phraseAkan}>{phrase.akan}</Text>
                </View>
                <TouchableOpacity 
                  style={[styles.playButton, isSpeaking && styles.playingButton]}
                  onPress={() => speakPhrase(phrase)}
                >
                  <Volume2 color={Colors.white} size={24} />
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[200],
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: Colors.primary[700],
  },
  content: {
    flex: 1,
    padding: 16,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  categoryCard: {
    width: '48%',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    alignItems: 'center',
  },
  selectedCategory: {
    borderWidth: 2,
    borderColor: Colors.primary[500],
  },
  categoryIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  categoryName: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: Colors.primary[700],
  },
  phrasesContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: Colors.primary[700],
    marginBottom: 16,
  },
  phraseCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.gray[100],
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  phraseContent: {
    flex: 1,
  },
  phraseEnglish: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: Colors.gray[900],
  },
  phraseAkan: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.gray[600],
    marginTop: 4,
  },
  playButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary[500],
    justifyContent: 'center',
    alignItems: 'center',
  },
  playingButton: {
    backgroundColor: Colors.error[500],
  },
}); 