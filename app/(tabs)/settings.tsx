import { View, Text, StyleSheet, Pressable, Switch } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn, FadeInRight } from 'react-native-reanimated';
import { 
  Bell, 
  Battery, 
  Wifi, 
  Shield, 
  ChevronRight,
  Smartphone,
  Moon,
  Languages,
} from 'lucide-react-native';
import { useState } from 'react';
import { useSettings } from '../store/settings';
import { Toast } from '../components/Toast';
import { LanguageModal } from '../components/LanguageModal';

const SettingItem = ({ icon: Icon, title, subtitle, onPress, showToggle, isEnabled, delay = 0 }) => (
  <Animated.View entering={FadeInRight.delay(delay)}>
    <Pressable 
      style={styles.settingItem}
      onPress={onPress}
    >
      <View style={[styles.iconContainer, { backgroundColor: '#7C3AED20' }]}>
        <Icon size={20} color="#7C3AED" />
      </View>
      <View style={styles.settingContent}>
        <Text style={styles.settingTitle}>{title}</Text>
        {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
      </View>
      {showToggle ? (
        <Switch 
          value={isEnabled}
          onValueChange={onPress}
          trackColor={{ false: '#374151', true: '#7C3AED' }}
          thumbColor="#fff"
        />
      ) : (
        <ChevronRight size={20} color="#94A3B8" />
      )}
    </Pressable>
  </Animated.View>
);

export default function SettingsScreen() {
  const {
    notifications,
    darkMode,
    autoConnect,
    language,
    batteryOptimization,
    setNotifications,
    setDarkMode,
    setAutoConnect,
    setLanguage,
    setBatteryOptimization,
  } = useSettings();

  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [showLanguageModal, setShowLanguageModal] = useState(false);

  const handleSettingChange = (
    setting: string,
    value: boolean,
    successMessage: string
  ) => {
    switch (setting) {
      case 'notifications':
        setNotifications(value);
        break;
      case 'darkMode':
        setDarkMode(value);
        break;
      case 'autoConnect':
        setAutoConnect(value);
        break;
      case 'batteryOptimization':
        setBatteryOptimization(value);
        break;
    }
    setToast({ message: successMessage, type: 'success' });
  };

  const getLanguageName = (code: string) => {
    const languageMap = {
      en: 'English (US)',
      es: 'Español',
      fr: 'Français',
      de: 'Deutsch',
      it: 'Italiano',
      pt: 'Português',
    };
    return languageMap[code as keyof typeof languageMap] || code;
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0A0F1E', '#151B30']}
        style={styles.background}
      />
      
      <Animated.View entering={FadeIn} style={styles.header}>
        <Text style={styles.title}>Settings</Text>
        <Text style={styles.subtitle}>Customize Your Experience</Text>
      </Animated.View>

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>General</Text>
        <SettingItem
          icon={Bell}
          title="Notifications"
          subtitle="Get alerts about your devices"
          showToggle
          isEnabled={notifications}
          onPress={() => handleSettingChange(
            'notifications',
            !notifications,
            `Notifications ${!notifications ? 'enabled' : 'disabled'}`
          )}
          delay={100}
        />
        <SettingItem
          icon={Moon}
          title="Dark Mode"
          subtitle="Switch between light and dark themes"
          showToggle
          isEnabled={darkMode}
          onPress={() => handleSettingChange(
            'darkMode',
            !darkMode,
            `Dark mode ${!darkMode ? 'enabled' : 'disabled'}`
          )}
          delay={200}
        />
        <SettingItem
          icon={Languages}
          title="Language"
          subtitle={getLanguageName(language)}
          onPress={() => setShowLanguageModal(true)}
          delay={300}
        />

        <Text style={[styles.sectionTitle, { marginTop: 32 }]}>Device</Text>
        <SettingItem
          icon={Wifi}
          title="Auto-Connect"
          subtitle="Automatically connect to known devices"
          showToggle
          isEnabled={autoConnect}
          onPress={() => handleSettingChange(
            'autoConnect',
            !autoConnect,
            `Auto-connect ${!autoConnect ? 'enabled' : 'disabled'}`
          )}
          delay={400}
        />
        <SettingItem
          icon={Battery}
          title="Battery Optimization"
          subtitle="Manage battery usage settings"
          showToggle
          isEnabled={batteryOptimization}
          onPress={() => handleSettingChange(
            'batteryOptimization',
            !batteryOptimization,
            `Battery optimization ${!batteryOptimization ? 'enabled' : 'disabled'}`
          )}
          delay={500}
        />
        <SettingItem
          icon={Shield}
          title="Security"
          subtitle="Manage device security settings"
          onPress={() => setToast({ 
            message: 'Security settings coming soon',
            type: 'info'
          })}
          delay={600}
        />
        <SettingItem
          icon={Smartphone}
          title="App Info"
          subtitle="Version 1.0.0"
          onPress={() => setToast({ 
            message: 'You are running the latest version',
            type: 'info'
          })}
          delay={700}
        />
      </View>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onHide={() => setToast(null)}
        />
      )}

      <LanguageModal
        visible={showLanguageModal}
        onClose={() => setShowLanguageModal(false)}
        selectedLanguage={language}
        onSelectLanguage={(lang) => {
          setLanguage(lang);
          setToast({ 
            message: `Language changed to ${getLanguageName(lang)}`,
            type: 'success'
          });
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  title: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#7C3AED',
    marginBottom: 16,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    marginBottom: 8,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#fff',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
  },
});