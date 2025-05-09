import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThumbsUp, ThumbsDown, ArrowRight } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import Button from '@/components/Button';

// Mock implementation for web
const mockStorage: Record<string, string> = {};

async function setItemAsync(key: string, value: string): Promise<void> {
  if (Platform.OS === 'web') {
    mockStorage[key] = value;
    return;
  }
  return await SecureStore.setItemAsync(key, value);
}

export default function SpeechImpairmentScreen() {
  const [selectedOption, setSelectedOption] = useState<'yes' | 'no' | null>(null);

  const handleOptionSelect = (option: 'yes' | 'no') => {
    setSelectedOption(option);
  };

  const handleGetStarted = async () => {
    // Save the user's selection and mark onboarding as complete
    if (selectedOption) {
      await setItemAsync('speechImpaired', selectedOption);
    }
    await setItemAsync('hasLaunched', 'true');
    // Navigate to signup page instead of main app
    router.replace('/onboarding/signup');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.questionContainer}>
          <Text style={styles.question}>Wɔwɔ kasa mu yareɛ bi?</Text>
          <Text style={styles.translation}>Do you have any speech impairment?</Text>
        </View>
        
        <View style={styles.optionsContainer}>
          <TouchableOpacity
            style={[
              styles.optionButton,
              selectedOption === 'yes' && styles.selectedOption,
            ]}
            onPress={() => handleOptionSelect('yes')}
          >
            <ThumbsUp
              size={24}
              color={selectedOption === 'yes' ? Colors.white : Colors.primary[500]}
            />
            <Text
              style={[
                styles.optionText,
                selectedOption === 'yes' && styles.selectedOptionText,
              ]}
            >
              Aane
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.optionButton,
              selectedOption === 'no' && styles.selectedOption,
            ]}
            onPress={() => handleOptionSelect('no')}
          >
            <ThumbsDown
              size={24}
              color={selectedOption === 'no' ? Colors.white : Colors.primary[500]}
            />
            <Text
              style={[
                styles.optionText,
                selectedOption === 'no' && styles.selectedOptionText,
              ]}
            >
              Daabi
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.buttonContainer}>
        <Button
          title="Get Started"
          onPress={handleGetStarted}
          rightIcon={<ArrowRight color={Colors.white} size={20} style={{ marginLeft: 8 }} />}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray[100],
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  questionContainer: {
    alignItems: 'center',
    marginBottom: 40,
    backgroundColor: Colors.gray[200],
    padding: 24,
    borderRadius: 16,
    width: '100%',
  },
  question: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: Colors.primary[700],
    marginBottom: 8,
    textAlign: 'center',
  },
  translation: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: Colors.gray[600],
    textAlign: 'center',
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 40,
  },
  optionButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.primary[500],
    marginHorizontal: 8,
  },
  selectedOption: {
    backgroundColor: Colors.primary[500],
    borderColor: Colors.primary[500],
  },
  optionText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: Colors.primary[500],
    marginLeft: 8,
  },
  selectedOptionText: {
    color: Colors.white,
  },
  buttonContainer: {
    width: '100%',
    padding: 24,
  },
});