import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Switch,
  TextInput
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '@/constants/Colors';
import { 
  User, 
  Settings, 
  Bell, 
  Globe, 
  VolumeX, 
  Volume2, 
  Info, 
  LogOut, 
  ChevronRight 
} from 'lucide-react-native';

interface ProfileSetting {
  id: string;
  title: string;
  description?: string;
  type: 'toggle' | 'select' | 'input' | 'action';
  value?: any;
  icon: React.ReactNode;
  action?: () => void;
}

export default function ProfileScreen() {
  const [name, setName] = useState('User');
  const [language, setLanguage] = useState('English');
  const [isEditingName, setIsEditingName] = useState(false);
  const [settings, setSettings] = useState<ProfileSetting[]>([
    {
      id: 'notifications',
      title: 'Notifications',
      description: 'Receive alerts about new features',
      type: 'toggle',
      value: true,
      icon: <Bell color={Colors.primary[500]} size={24} />,
    },
    {
      id: 'language',
      title: 'Language',
      description: 'Currently set to English',
      type: 'select',
      value: 'English',
      icon: <Globe color={Colors.primary[500]} size={24} />,
    },
    {
      id: 'voiceVolume',
      title: 'Voice Volume',
      description: 'Medium',
      type: 'select',
      value: 'medium',
      icon: <Volume2 color={Colors.primary[500]} size={24} />,
    },
    {
      id: 'textSize',
      title: 'Text Size',
      description: 'Regular',
      type: 'select',
      value: 'regular',
      icon: <Text style={{ fontSize: 24, color: Colors.primary[500], fontWeight: 'bold' }}>A</Text>,
    },
    {
      id: 'about',
      title: 'About KasaYie',
      description: 'Version 1.0.0',
      type: 'action',
      icon: <Info color={Colors.primary[500]} size={24} />,
    },
    {
      id: 'logout',
      title: 'Log Out',
      type: 'action',
      icon: <LogOut color={Colors.error[500]} size={24} />,
    },
  ]);
  
  const updateSetting = (id: string, value: any) => {
    const updatedSettings = settings.map(setting => {
      if (setting.id === id) {
        return { ...setting, value };
      }
      return setting;
    });
    setSettings(updatedSettings);
  };
  
  const renderSettingItem = (setting: ProfileSetting) => {
    switch (setting.type) {
      case 'toggle':
        return (
          <Switch
            value={setting.value}
            onValueChange={(value) => updateSetting(setting.id, value)}
            trackColor={{ false: Colors.gray[300], true: Colors.primary[300] }}
            thumbColor={setting.value ? Colors.primary[500] : Colors.gray[100]}
          />
        );
      case 'select':
      case 'action':
        return <ChevronRight color={Colors.gray[400]} size={20} />;
      default:
        return null;
    }
  };
  
  const saveName = () => {
    setIsEditingName(false);
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profileHeader}>
          <View style={styles.profileImageContainer}>
            <User color={Colors.white} size={40} />
          </View>
          
          <View style={styles.profileInfo}>
            {isEditingName ? (
              <View style={styles.nameEditContainer}>
                <TextInput
                  style={styles.nameInput}
                  value={name}
                  onChangeText={setName}
                  autoFocus
                />
                <TouchableOpacity style={styles.saveButton} onPress={saveName}>
                  <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity onPress={() => setIsEditingName(true)}>
                <Text style={styles.profileName}>{name}</Text>
                <Text style={styles.editText}>Edit</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
        
        <View style={styles.medicalInfoCard}>
          <View style={styles.medicalInfoHeader}>
            <Text style={styles.medicalInfoTitle}>Medical Information</Text>
            <TouchableOpacity>
              <Text style={styles.editMedicalText}>Edit</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.medicalInfoItem}>
            <Text style={styles.medicalInfoLabel}>Speech Impairment</Text>
            <Text style={styles.medicalInfoValue}>Yes</Text>
          </View>
          
          <View style={styles.medicalInfoItem}>
            <Text style={styles.medicalInfoLabel}>Medical Conditions</Text>
            <Text style={styles.medicalInfoValue}>None added</Text>
          </View>
          
          <View style={styles.medicalInfoItem}>
            <Text style={styles.medicalInfoLabel}>Allergies</Text>
            <Text style={styles.medicalInfoValue}>None added</Text>
          </View>
          
          <View style={styles.medicalInfoItem}>
            <Text style={styles.medicalInfoLabel}>Emergency Contact</Text>
            <Text style={styles.medicalInfoValue}>None added</Text>
          </View>
        </View>
        
        <Text style={styles.settingsTitle}>Settings</Text>
        
        <View style={styles.settingsContainer}>
          {settings.map(setting => (
            <TouchableOpacity 
              key={setting.id}
              style={styles.settingItem}
              onPress={() => {
                if (setting.type === 'toggle') {
                  updateSetting(setting.id, !setting.value);
                } else if (setting.action) {
                  setting.action();
                }
              }}
            >
              <View style={styles.settingIcon}>
                {setting.icon}
              </View>
              
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>{setting.title}</Text>
                {setting.description && (
                  <Text style={styles.settingDescription}>{setting.description}</Text>
                )}
              </View>
              
              {renderSettingItem(setting)}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  profileImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary[500],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: Colors.gray[800],
    marginBottom: 4,
  },
  editText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.primary[500],
  },
  nameEditContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nameInput: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 18,
    color: Colors.gray[800],
    borderBottomWidth: 1,
    borderBottomColor: Colors.primary[500],
    paddingVertical: 4,
    marginRight: 8,
  },
  saveButton: {
    backgroundColor: Colors.primary[500],
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  saveButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: Colors.white,
  },
  medicalInfoCard: {
    backgroundColor: Colors.gray[50],
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  medicalInfoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  medicalInfoTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: Colors.gray[800],
  },
  editMedicalText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.primary[500],
  },
  medicalInfoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[200],
  },
  medicalInfoLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: Colors.gray[600],
  },
  medicalInfoValue: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: Colors.gray[800],
  },
  settingsTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: Colors.gray[800],
    marginBottom: 16,
  },
  settingsContainer: {
    backgroundColor: Colors.gray[50],
    borderRadius: 12,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[200],
  },
  settingIcon: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: Colors.gray[800],
  },
  settingDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.gray[500],
    marginTop: 2,
  },
});