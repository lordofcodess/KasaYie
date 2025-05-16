import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '@/constants/Colors';
import { User, BookOpen, RefreshCcw, Layers } from 'lucide-react-native';
import { router } from 'expo-router';

export default function PhrasesScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.headerRow}>
        <Text style={styles.greeting}><Text style={styles.wave}>👋</Text>Akwaaba, Kofi</Text>
        <TouchableOpacity style={styles.profileButton}>
          <User color={Colors.primary[700]} size={32} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.sessionButton}>
        <Text style={styles.sessionButtonText}>Start new session +</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.bigButton, { backgroundColor: '#F7E017' }]}
        onPress={() => router.push('/games-therapy')}
      > 
        <View style={styles.buttonContent}>
          <Text style={styles.bigButtonText}>Games & Therapy</Text>
          <Layers color="#fff" size={48} style={styles.buttonIcon} />
        </View>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.bigButton, { backgroundColor: '#1DB954' }]}
        onPress={() => router.push('/phrase-book')}
      > 
        <View style={styles.buttonContent}>
          <Text style={styles.bigButtonText}>Phrase Book</Text>
          <BookOpen color="#fff" size={48} style={styles.buttonIcon} />
        </View>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.bigButton, { backgroundColor: '#111' }]}
        onPress={() => router.push('/past-conversations')}
      > 
        <View style={styles.buttonContent}>
          <Text style={styles.bigButtonText}>Past Conversations</Text>
          <RefreshCcw color="#fff" size={48} style={styles.buttonIcon} />
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  greeting: {
    fontFamily: 'Inter-Bold',
    fontSize: 22,
    color: Colors.gray[900],
  },
  wave: {
    fontSize: 22,
    marginRight: 4,
  },
  profileButton: {
    backgroundColor: Colors.gray[100],
    borderRadius: 20,
    padding: 4,
  },
  sessionButton: {
    backgroundColor: Colors.white,
    borderColor: Colors.primary[500],
    borderWidth: 2,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 24,
  },
  sessionButtonText: {
    color: Colors.primary[700],
    fontFamily: 'Inter-Bold',
    fontSize: 18,
  },
  bigButton: {
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 20,
    marginBottom: 18,
    justifyContent: 'center',
    alignItems: 'flex-start',
    overflow: 'hidden',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bigButtonText: {
    color: '#fff',
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    flex: 1,
  },
  buttonIcon: {
    marginLeft: 16,
  },
});
