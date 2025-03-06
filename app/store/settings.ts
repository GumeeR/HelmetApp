import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface SettingsState {
  notifications: boolean;
  darkMode: boolean;
  autoConnect: boolean;
  language: string;
  batteryOptimization: boolean;
  setNotifications: (enabled: boolean) => void;
  setDarkMode: (enabled: boolean) => void;
  setAutoConnect: (enabled: boolean) => void;
  setLanguage: (lang: string) => void;
  setBatteryOptimization: (enabled: boolean) => void;
}

export const useSettings = create<SettingsState>()(
  persist(
    (set) => ({
      notifications: true,
      darkMode: true,
      autoConnect: true,
      language: 'en',
      batteryOptimization: true,
      setNotifications: (enabled) => set({ notifications: enabled }),
      setDarkMode: (enabled) => set({ darkMode: enabled }),
      setAutoConnect: (enabled) => set({ autoConnect: enabled }),
      setLanguage: (lang) => set({ language: lang }),
      setBatteryOptimization: (enabled) => set({ batteryOptimization: enabled }),
    }),
    {
      name: 'settings-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);