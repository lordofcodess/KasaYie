import Colors from '@/constants/Colors';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import { Play } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function HistoryScreen() {
  const [audioFiles, setAudioFiles] = useState<string[]>([]);

  useEffect(() => {
    const loadAudioFiles = async () => {
      try {
        const directoryUri = `${FileSystem.documentDirectory}SavedAudios/`;
        const dirInfo = await FileSystem.getInfoAsync(directoryUri);

        if (dirInfo.exists) {
          const files = await FileSystem.readDirectoryAsync(directoryUri);
          setAudioFiles(files.map((file) => `${directoryUri}${file}`));
        }
      } catch (error) {
        console.error('Failed to load audio files:', error);
        Alert.alert('Error', 'Failed to load audio history.');
      }
    };

    loadAudioFiles();
  }, []);

  const playAudio = async (uri: string) => {
    try {
      const { sound } = await Audio.Sound.createAsync({ uri });
      await sound.playAsync();
    } catch (error) {
      console.error('Failed to play audio:', error);
      Alert.alert('Error', 'Failed to play audio. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Audio History</Text>
      {audioFiles.length === 0 ? (
        <Text style={styles.emptyText}>No saved audios found.</Text>
      ) : (
        <FlatList
          data={audioFiles}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <View style={styles.audioItem}>
              <Text style={styles.audioName}>{item.split('/').pop()}</Text>
              <TouchableOpacity style={styles.playButton} onPress={() => playAudio(item)}>
                <Play color={Colors.white} size={24} />
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: Colors.white,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: Colors.primary[700],
    marginBottom: 16,
  },
  emptyText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: Colors.gray[600],
    textAlign: 'center',
    marginTop: 32,
  },
  audioItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[200],
  },
  audioName: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: Colors.gray[800],
  },
  playButton: {
    backgroundColor: Colors.primary[500],
    padding: 8,
    borderRadius: 8,
  },
});