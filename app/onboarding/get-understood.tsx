import React from 'react';
import { router } from 'expo-router';
import OnboardingScreen from '@/components/OnboardingScreen';
import { Image, View } from 'react-native';

export default function GetUnderstoodScreen() {
  const handleContinue = () => router.push('/onboarding/speech-impairment');
  const handleSkip = () => router.push('/onboarding/speech-impairment');

  return (
    <OnboardingScreen
      image={
        <View style={{
          alignSelf: 'center',
          marginTop: 24,
          borderRadius: 32,
          overflow: 'visible',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.15,
          shadowRadius: 16,
          elevation: 8,
          backgroundColor: '#E6F0FF',
          width: 220,
          height: 220,
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
        }}>
          {/* Decorative circle behind the image */}
          <View style={{
            position: 'absolute',
            width: 180,
            height: 180,
            borderRadius: 90,
            backgroundColor: '#B3D1FF',
            top: 20,
            left: 20,
            zIndex: 0,
          }} />
          <Image
            source={require('@/assets/images/2.jpg')}
            style={{
              width: 180,
              height: 180,
              borderRadius: 90,
              resizeMode: 'cover',
              zIndex: 1,
            }}
          />
        </View>
      }
      title="Get Understood"
      subtitle="With preset phrases, visual cards, and text-to-speech features, ensure medical professionals understand your needs accurately and quickly."
      primaryButtonLabel="Next"
      secondaryButtonLabel="Skip"
      onPrimaryButtonPress={handleContinue}
      onSecondaryButtonPress={handleSkip}
      progressDots={3}
      currentDot={1}
    />
  );
}