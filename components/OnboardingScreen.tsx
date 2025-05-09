import React, { ReactNode } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  useWindowDimensions,
  ImageSourcePropType
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from './Button';
import { ArrowRight } from 'lucide-react-native';
import Colors from '@/constants/Colors';

interface OnboardingScreenProps {
  image: ImageSourcePropType | ReactNode;
  title: string;
  subtitle: string;
  primaryButtonLabel: string;
  secondaryButtonLabel?: string;
  onPrimaryButtonPress: () => void;
  onSecondaryButtonPress?: () => void;
  progressDots?: number;
  currentDot?: number;
  backgroundColor?: string;
}

export function OnboardingScreen({
  image,
  title,
  subtitle,
  primaryButtonLabel,
  secondaryButtonLabel,
  onPrimaryButtonPress,
  onSecondaryButtonPress,
  progressDots = 3,
  currentDot = 0,
  backgroundColor = Colors.white,
}: OnboardingScreenProps) {
  const { width, height } = useWindowDimensions();
  
  const dynamicStyles = {
    primaryButton: {
      flex: 1,
      marginLeft: secondaryButtonLabel ? 8 : 0,
    },
    secondaryButton: {
      flex: 1,
      marginRight: 8,
    },
  };
  
  const renderImage = () => {
    if (React.isValidElement(image)) {
      return image;
    }
    return (
      <Image 
        source={image as ImageSourcePropType} 
        style={[styles.image, { width: width * 0.9 }]}
        resizeMode="cover"
      />
    );
  };
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <View style={styles.imageContainer}>
        {renderImage()}
      </View>
      
      <View style={styles.contentContainer}>
        {progressDots > 0 && (
          <View style={styles.dotsContainer}>
            {Array.from({ length: progressDots }).map((_, index) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  index === currentDot ? styles.activeDot : styles.inactiveDot,
                ]}
              />
            ))}
          </View>
        )}
        
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
        
        <View style={styles.buttonContainer}>
          {secondaryButtonLabel && (
            <Button
              title={secondaryButtonLabel}
              onPress={onSecondaryButtonPress || (() => {})}
              variant="outline"
              style={dynamicStyles.secondaryButton}
            />
          )}
          
          <Button
            title={primaryButtonLabel}
            onPress={onPrimaryButtonPress}
            rightIcon={<ArrowRight stroke={Colors.white} size={20} style={styles.buttonIcon} />}
            style={dynamicStyles.primaryButton}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 24,
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 40,
    width: '100%',
    height: '50%',
  },
  image: {
    height: '100%',
    borderRadius: 12,
  },
  contentContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 24,
  },
  dotsContainer: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: Colors.primary[500],
  },
  inactiveDot: {
    backgroundColor: Colors.gray[300],
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 28,
    color: Colors.primary[500],
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: Colors.gray[600],
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  buttonContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
  buttonIcon: {
    marginLeft: 8,
  },
});

export default OnboardingScreen;