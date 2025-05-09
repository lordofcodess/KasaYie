import React from 'react';
import { router } from 'expo-router';
import OnboardingScreen from '@/components/OnboardingScreen';
import { Image, View } from 'react-native';

export default function SpeakFreelyScreen() {
  const handleContinue = () => router.push('/onboarding/get-understood');
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
            source={require('@/assets/images/1.jpg')}
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
      title="Speak Freely"
      subtitle="Communicate with healthcare professionals easily, even with speech impairments. Our app helps bridge the gap between you and your medical providers."
      primaryButtonLabel="Next"
      secondaryButtonLabel="Skip"
      onPrimaryButtonPress={handleContinue}
      onSecondaryButtonPress={handleSkip}
      progressDots={3}
      currentDot={0}
    />
  );
}