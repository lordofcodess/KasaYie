import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming,
  withDelay,
  runOnJS
} from 'react-native-reanimated';
import Colors from '@/constants/Colors';

export default function SplashScreen() {
  const logoOpacity = useSharedValue(0);
  const logoScale = useSharedValue(0.8);
  const titleOpacity = useSharedValue(0);
  const subtitleOpacity = useSharedValue(0);

  useEffect(() => {
    // Animate logo
    logoOpacity.value = withTiming(1, { duration: 800 });
    logoScale.value = withTiming(1, { duration: 800 });
    
    // Animate title with delay
    titleOpacity.value = withDelay(400, withTiming(1, { duration: 800 }));
    
    // Animate subtitle with delay
    subtitleOpacity.value = withDelay(800, withTiming(1, { duration: 800 }));
    
    // Navigate to the next screen after 3 seconds
    const timer = setTimeout(() => {
      router.replace('/onboarding/speek-freely');
    }, 3000);
    
    return () => clearTimeout(timer);
  }, []);

  const logoAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: logoOpacity.value,
      transform: [{ scale: logoScale.value }],
    };
  });

  const titleAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: titleOpacity.value,
    };
  });

  const subtitleAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: subtitleOpacity.value,
    };
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Animated.View style={[styles.logoContainer, logoAnimatedStyle]}>
          <View style={styles.speechBubble}>
            <View style={styles.speechBubbleSmall}>
              <View style={styles.waveLine} />
            </View>
            <View style={styles.waveLine} />
          </View>
        </Animated.View>
        
        <Animated.Text style={[styles.title, titleAnimatedStyle]}>KasaYie</Animated.Text>
        <Animated.Text style={[styles.subtitle, subtitleAnimatedStyle]}>Every voice matters</Animated.Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary[500],
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  logoContainer: {
    marginBottom: 40,
  },
  speechBubble: {
    width: 120,
    height: 80,
    borderWidth: 3,
    borderColor: Colors.accent[500],
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  speechBubbleSmall: {
    width: 60,
    height: 40,
    borderWidth: 2,
    borderColor: Colors.accent[500],
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: -50,
    left: -30,
  },
  waveLine: {
    width: '70%',
    height: 3,
    backgroundColor: Colors.accent[500],
    borderRadius: 2,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 36,
    color: Colors.white,
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 18,
    color: Colors.white,
    opacity: 0.9,
  },
});