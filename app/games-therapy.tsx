import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '@/constants/Colors';
import { Layers, ChevronLeft, Play, Star } from 'lucide-react-native';
import { router } from 'expo-router';

type Exercise = {
  id: string;
  title: string;
  description: string;
  type: 'visual' | 'practice';
  difficulty: 'easy' | 'medium' | 'hard';
  icon: string;
};

export default function GamesTherapyScreen() {
  const [selectedType, setSelectedType] = useState<'visual' | 'practice'>('visual');

  const exercises: Exercise[] = [
    {
      id: '1',
      title: 'Basic Emotions',
      description: 'Learn to express basic emotions through pictures',
      type: 'visual',
      difficulty: 'easy',
      icon: '😊',
    },
    {
      id: '2',
      title: 'Daily Activities',
      description: 'Practice communicating daily activities',
      type: 'visual',
      difficulty: 'medium',
      icon: '🏃',
    },
    {
      id: '3',
      title: 'Word Recognition',
      description: 'Improve word recognition skills',
      type: 'practice',
      difficulty: 'easy',
      icon: '📝',
    },
    {
      id: '4',
      title: 'Sentence Building',
      description: 'Practice building simple sentences',
      type: 'practice',
      difficulty: 'hard',
      icon: '📚',
    },
  ];

  const filteredExercises = exercises.filter(ex => ex.type === selectedType);

  const handleExercisePress = (exercise: Exercise) => {
    Alert.alert(
      'Coming Soon',
      `The ${exercise.title} exercise will be available soon!`,
      [{ text: 'OK' }]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft color={Colors.primary[700]} size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Games & Therapy</Text>
        <Layers color={Colors.primary[700]} size={24} />
      </View>

      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, selectedType === 'visual' && styles.selectedTab]}
          onPress={() => setSelectedType('visual')}
        >
          <Text style={[styles.tabText, selectedType === 'visual' && styles.selectedTabText]}>
            Visual Communication
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedType === 'practice' && styles.selectedTab]}
          onPress={() => setSelectedType('practice')}
        >
          <Text style={[styles.tabText, selectedType === 'practice' && styles.selectedTabText]}>
            Learning & Practice
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {filteredExercises.map((exercise) => (
          <TouchableOpacity
            key={exercise.id}
            style={styles.exerciseCard}
            onPress={() => handleExercisePress(exercise)}
          >
            <View style={styles.exerciseIconContainer}>
              <Text style={styles.exerciseIcon}>{exercise.icon}</Text>
            </View>
            <View style={styles.exerciseContent}>
              <View style={styles.exerciseHeader}>
                <Text style={styles.exerciseTitle}>{exercise.title}</Text>
                <View style={styles.difficultyContainer}>
                  {[...Array(3)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      color={i < getDifficultyLevel(exercise.difficulty) ? Colors.primary[500] : Colors.gray[300]}
                      style={styles.difficultyStar}
                    />
                  ))}
                </View>
              </View>
              <Text style={styles.exerciseDescription}>{exercise.description}</Text>
              <TouchableOpacity style={styles.startButton}>
                <Play color={Colors.white} size={20} />
                <Text style={styles.startButtonText}>Start</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

function getDifficultyLevel(difficulty: 'easy' | 'medium' | 'hard'): number {
  switch (difficulty) {
    case 'easy': return 1;
    case 'medium': return 2;
    case 'hard': return 3;
  }
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
  tabs: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[200],
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
  },
  selectedTab: {
    borderBottomWidth: 2,
    borderBottomColor: Colors.primary[500],
  },
  tabText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: Colors.gray[600],
  },
  selectedTabText: {
    color: Colors.primary[700],
  },
  content: {
    flex: 1,
    padding: 16,
  },
  exerciseCard: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  exerciseIconContainer: {
    width: 80,
    height: 80,
    backgroundColor: Colors.primary[100],
    justifyContent: 'center',
    alignItems: 'center',
  },
  exerciseIcon: {
    fontSize: 40,
  },
  exerciseContent: {
    flex: 1,
    padding: 16,
  },
  exerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  exerciseTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: Colors.gray[900],
  },
  difficultyContainer: {
    flexDirection: 'row',
  },
  difficultyStar: {
    marginLeft: 2,
  },
  exerciseDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.gray[600],
    marginBottom: 16,
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary[500],
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  startButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: Colors.white,
    marginLeft: 8,
  },
}); 