import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { useRouter } from 'expo-router';

type Category = {
  id: string;
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
};

type Phrase = {
  english: string;
  akan: string;
};

export default function MedicalScreen() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedPhrase, setSelectedPhrase] = useState<Phrase | null>(null);
  const router = useRouter();

  const categories: Category[] = [
    { id: 'pain', name: 'Pain', icon: 'bandage-outline', color: '#FF6B6B' },
    { id: 'emergency', name: 'Emergency', icon: 'alert-circle-outline', color: '#FF9F43' },
    { id: 'medication', name: 'Medication', icon: 'medkit-outline', color: '#4ECDC4' },
    { id: 'appointment', name: 'Appointment', icon: 'calendar-outline', color: '#45B7D1' },
  ];

  const phrases: Record<string, Phrase[]> = {
    pain: [
      { english: 'I am in pain', akan: 'Me ho yaw' },
      { english: 'Where does it hurt?', akan: 'Hena na ehaw?' },
      { english: 'I need pain relief', akan: 'Me hia yare a wotwa' },
    ],
    emergency: [
      { english: 'Call an ambulance', akan: 'Frɛ ambulance' },
      { english: 'I need immediate help', akan: 'Me hia mmoa ntem' },
      { english: 'Emergency contact', akan: 'Emergency contact' },
    ],
    medication: [
      { english: 'I need my medication', akan: 'Me hia me duro' },
      { english: 'When should I take it?', akan: 'Bere bɛn na mefa?' },
      { english: 'Side effects', akan: 'Side effects' },
    ],
    appointment: [
      { english: 'I need an appointment', akan: 'Me hia appointment' },
      { english: 'When is my next visit?', akan: 'Bere bɛn na mebɛsan aba?' },
      { english: 'Cancel appointment', akan: 'Cancel appointment' },
    ],
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setSelectedPhrase(null);
  };

  const handlePhraseSelect = (phrase: Phrase) => {
    setSelectedPhrase(phrase);
    Alert.alert('Selected Phrase', `${phrase.english} - ${phrase.akan}`);
  };

  const handleEmergency = () => {
    Alert.alert('Emergency', 'Calling emergency services...');
  };

  const playPhrase = (phrase: Phrase) => {
    // In a real app, this would use text-to-speech
    console.log('Playing phrase:', phrase.akan);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Ionicons name="medkit" size={32} color={Colors.primary[500]} />
        <Text style={styles.headerTitle}>Medical Assistance</Text>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <TouchableOpacity style={styles.emergencyCard} onPress={handleEmergency}>
          <Ionicons name="alert-circle" size={24} color="#FF6B6B" />
          <Text style={styles.emergencyText}>Emergency</Text>
        </TouchableOpacity>

        <View style={styles.categoriesContainer}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <View style={styles.categoriesGrid}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryCard,
                  { backgroundColor: category.color + '20' },
                  selectedCategory === category.id && styles.selectedCategory,
                ]}
                onPress={() => handleCategorySelect(category.id)}
              >
                <Ionicons name={category.icon} size={32} color={category.color} />
                <Text style={styles.categoryName}>{category.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {selectedCategory && (
          <View style={styles.phrasesContainer}>
            <Text style={styles.sectionTitle}>Phrases</Text>
            <View style={styles.phrasesList}>
              {phrases[selectedCategory].map((phrase, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.phraseCard,
                    selectedPhrase === phrase && styles.selectedPhrase,
                  ]}
                  onPress={() => handlePhraseSelect(phrase)}
                >
                  <Text style={styles.phraseText}>{phrase.english}</Text>
                  <Text style={styles.phraseTextAkan}>{phrase.akan}</Text>
                  <TouchableOpacity style={styles.playButton} onPress={() => playPhrase(phrase)}>
                    <Ionicons name="play" size={20} color={Colors.white} />
                  </TouchableOpacity>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    backgroundColor: Colors.primary[100],
    borderBottomWidth: 1,
    borderBottomColor: Colors.primary[200],
  },
  headerTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: Colors.primary[700],
    marginLeft: 8,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  emergencyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF5F5',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  emergencyText: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: '#FF6B6B',
    marginLeft: 8,
  },
  categoriesContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: Colors.primary[700],
    marginBottom: 16,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryCard: {
    width: '48%',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedCategory: {
    borderWidth: 2,
    borderColor: Colors.primary[500],
  },
  categoryName: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: Colors.primary[700],
    marginTop: 8,
  },
  phrasesContainer: {
    marginBottom: 24,
  },
  phrasesList: {
    gap: 12,
  },
  phraseCard: {
    backgroundColor: '#E8F0FE',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedPhrase: {
    borderWidth: 2,
    borderColor: '#3B82F6',
  },
  phraseText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#333',
  },
  phraseTextAkan: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  playButton: {
    position: 'absolute',
    right: 16,
    top: 16,
    backgroundColor: '#3B82F6',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
});