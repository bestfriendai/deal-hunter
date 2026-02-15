import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface UserPreferences {
  notifications: boolean;
  locationEnabled: boolean;
  darkMode: boolean;
  hasCompletedOnboarding: boolean;
  preferredCategories: string[];
}

interface SettingsState extends UserPreferences {
  isLoading: boolean;
  
  // Actions
  loadPreferences: () => Promise<void>;
  setNotifications: (enabled: boolean) => Promise<void>;
  setLocationEnabled: (enabled: boolean) => Promise<void>;
  setDarkMode: (enabled: boolean) => Promise<void>;
  setOnboardingComplete: () => Promise<void>;
  setPreferredCategories: (categories: string[]) => Promise<void>;
}

const STORAGE_KEY = '@dealhunter_preferences';

const defaultPreferences: UserPreferences = {
  notifications: true,
  locationEnabled: false,
  darkMode: false,
  hasCompletedOnboarding: false,
  preferredCategories: [],
};

export const useSettingsStore = create<SettingsState>((set, get) => ({
  ...defaultPreferences,
  isLoading: true,

  loadPreferences: async () => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (data) {
        const prefs = JSON.parse(data);
        set({ ...prefs, isLoading: false });
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      set({ isLoading: false });
    }
  },

  setNotifications: async (enabled) => {
    const newPrefs = { ...get(), notifications: enabled };
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newPrefs));
    set({ notifications: enabled });
  },

  setLocationEnabled: async (enabled) => {
    const newPrefs = { ...get(), locationEnabled: enabled };
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newPrefs));
    set({ locationEnabled: enabled });
  },

  setDarkMode: async (enabled) => {
    const newPrefs = { ...get(), darkMode: enabled };
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newPrefs));
    set({ darkMode: enabled });
  },

  setOnboardingComplete: async () => {
    const newPrefs = { ...get(), hasCompletedOnboarding: true };
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newPrefs));
    set({ hasCompletedOnboarding: true });
  },

  setPreferredCategories: async (categories) => {
    const newPrefs = { ...get(), preferredCategories: categories };
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newPrefs));
    set({ preferredCategories: categories });
  },
}));
