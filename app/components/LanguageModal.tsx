import { View, Text, StyleSheet, Pressable, Modal } from 'react-native';
import { BlurView } from 'expo-blur';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { Check } from 'lucide-react-native';

const LANGUAGES = [
  { code: 'en', name: 'English (US)' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' },
  { code: 'it', name: 'Italiano' },
  { code: 'pt', name: 'Português' },
];

interface LanguageModalProps {
  visible: boolean;
  onClose: () => void;
  selectedLanguage: string;
  onSelectLanguage: (code: string) => void;
}

export function LanguageModal({
  visible,
  onClose,
  selectedLanguage,
  onSelectLanguage,
}: LanguageModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <BlurView intensity={20} style={styles.overlay}>
        <Animated.View 
          entering={FadeInDown.springify()}
          style={styles.modalContent}
        >
          <Text style={styles.title}>Select Language</Text>
          {LANGUAGES.map((language, index) => (
            <Animated.View
              key={language.code}
              entering={FadeIn.delay(index * 100)}
            >
              <Pressable
                style={styles.languageItem}
                onPress={() => {
                  onSelectLanguage(language.code);
                  onClose();
                }}
              >
                <Text style={styles.languageName}>{language.name}</Text>
                {selectedLanguage === language.code && (
                  <Check size={20} color="#7C3AED" />
                )}
              </Pressable>
            </Animated.View>
          ))}
          <Pressable style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelText}>Cancel</Text>
          </Pressable>
        </Animated.View>
      </BlurView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#151B30',
    borderRadius: 16,
    padding: 20,
    width: '90%',
    maxWidth: 400,
  },
  title: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  languageName: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#fff',
  },
  cancelButton: {
    marginTop: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#7C3AED',
  },
});