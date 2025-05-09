import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '@/constants/Colors';
import { User, Phone, Lock } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function SignupScreen() {
  const [name, setName] = useState('');
  const [number, setNumber] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSignup = () => {
    // For now, any input allows login
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.logoContainer}>
        <Text style={styles.logo}>Kasa<Text style={{ color: Colors.primary[500] }}>Yie</Text></Text>
        <Text style={styles.subtitle}>Please Sign Up To Your Account</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputRow}>
          <User color={Colors.white} size={20} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Enter Your Name"
            placeholderTextColor="#ccc"
            value={name}
            onChangeText={setName}
          />
        </View>
        <View style={styles.inputRow}>
          <Phone color={Colors.white} size={20} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Enter Your Number"
            placeholderTextColor="#ccc"
            value={number}
            onChangeText={setNumber}
            keyboardType="phone-pad"
          />
        </View>
        <View style={styles.inputRow}>
          <Lock color={Colors.white} size={20} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Enter Your Password"
            placeholderTextColor="#ccc"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>
        <TouchableOpacity style={styles.signupButton} onPress={handleSignup}>
          <Text style={styles.signupButtonText}>Create Account</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.loginRow}>
        <Text style={styles.loginText}>Already Have Account?</Text>
        <TouchableOpacity onPress={handleSignup}>
          <Text style={styles.loginLink}> Login</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logo: {
    fontFamily: 'Inter-Bold',
    fontSize: 36,
    color: Colors.primary[700],
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: Colors.gray[700],
    marginBottom: 24,
  },
  form: {
    width: '100%',
    marginBottom: 32,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#222',
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    color: '#fff',
    fontFamily: 'Inter-Regular',
    fontSize: 16,
  },
  signupButton: {
    backgroundColor: '#1DB954',
    borderRadius: 24,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  signupButtonText: {
    color: '#fff',
    fontFamily: 'Inter-Bold',
    fontSize: 18,
  },
  loginRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    justifyContent: 'center',
  },
  loginText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.gray[700],
  },
  loginLink: {
    fontFamily: 'Inter-Bold',
    fontSize: 14,
    color: '#1DB954',
  },
}); 