import { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useSettingsStore } from '../../src/store/settingsStore';
import { useDealStore } from '../../src/store/dealStore';
import { colors, spacing, radius, fontSize, fontWeight, shadows } from '../../src/ui/theme';

export default function SettingsScreen() {
  const router = useRouter();
  const { 
    notifications, 
    locationEnabled, 
    darkMode,
    setNotifications, 
    setLocationEnabled, 
    setDarkMode,
    setOnboardingComplete,
  } = useSettingsStore();
  
  const { deals, favorites } = useDealStore();

  const handleToggleNotifications = async (value: boolean) => {
    await setNotifications(value);
  };

  const handleToggleLocation = async (value: boolean) => {
    await setLocationEnabled(value);
  };

  const handleToggleDarkMode = async (value: boolean) => {
    await setDarkMode(value);
  };

  const handleResetOnboarding = () => {
    Alert.alert(
      'Reset Onboarding',
      'This will show the welcome screen on next app launch.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Reset', 
          onPress: async () => {
            await setOnboardingComplete();
            // In a real app, we'd toggle this back to false
            Alert.alert('Done', 'Onboarding will show on next launch.');
          }
        },
      ]
    );
  };

  const handleClearData = () => {
    Alert.alert(
      'Clear All Data',
      'This will delete all your saved deals and favorites. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear', 
          style: 'destructive',
          onPress: async () => {
            Alert.alert('Done', 'All data has been cleared.');
          }
        },
      ]
    );
  };

  const handlePrivacyPolicy = () => {
    Linking.openURL('https://example.com/privacy');
  };

  const handleRateApp = () => {
    // In production, use React Native Linking to open App Store
    Alert.alert('Rate App', 'Thank you for your support!');
  };

  const handleUpgrade = () => {
    router.push('/paywall');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Settings</Text>
        </View>

        {/* Statistics */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{deals.length}</Text>
            <Text style={styles.statLabel}>Deals</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{favorites.length}</Text>
            <Text style={styles.statLabel}>Favorites</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>Claimed</Text>
          </View>
        </View>

        {/* Preferences Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          
          <View style={styles.settingsGroup}>
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Notifications</Text>
                <Text style={styles.settingDescription}>
                  Get notified about new deals
                </Text>
              </View>
              <Switch
                value={notifications}
                onValueChange={handleToggleNotifications}
                trackColor={{ false: colors.border, true: colors.primary + '60' }}
                thumbColor={notifications ? colors.primary : colors.textTertiary}
              />
            </View>
            
            <View style={styles.settingDivider} />
            
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Location</Text>
                <Text style={styles.settingDescription}>
                  Show deals near your location
                </Text>
              </View>
              <Switch
                value={locationEnabled}
                onValueChange={handleToggleLocation}
                trackColor={{ false: colors.border, true: colors.primary + '60' }}
                thumbColor={locationEnabled ? colors.primary : colors.textTertiary}
              />
            </View>
            
            <View style={styles.settingDivider} />
            
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Dark Mode</Text>
                <Text style={styles.settingDescription}>
                  Use dark theme (coming soon)
                </Text>
              </View>
              <Switch
                value={darkMode}
                onValueChange={handleToggleDarkMode}
                trackColor={{ false: colors.border, true: colors.primary + '60' }}
                thumbColor={darkMode ? colors.primary : colors.textTertiary}
                disabled
              />
            </View>
          </View>
        </View>

        {/* Premium Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Premium</Text>
          
          <TouchableOpacity style={styles.premiumCard} onPress={handleUpgrade}>
            <View style={styles.premiumContent}>
              <Text style={styles.premiumIcon}>⭐</Text>
              <View style={styles.premiumInfo}>
                <Text style={styles.premiumTitle}>Upgrade to Premium</Text>
                <Text style={styles.premiumDescription}>
                  Unlock unlimited deals, no ads, and exclusive offers
                </Text>
              </View>
              <Text style={styles.premiumArrow}>→</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Support Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          
          <View style={styles.settingsGroup}>
            <TouchableOpacity style={styles.settingRow} onPress={handleRateApp}>
              <Text style={styles.settingLabel}>Rate App</Text>
              <Text style={styles.settingArrow}>→</Text>
            </TouchableOpacity>
            
            <View style={styles.settingDivider} />
            
            <TouchableOpacity style={styles.settingRow} onPress={handlePrivacyPolicy}>
              <Text style={styles.settingLabel}>Privacy Policy</Text>
              <Text style={styles.settingArrow}>→</Text>
            </TouchableOpacity>
            
            <View style={styles.settingDivider} />
            
            <TouchableOpacity style={styles.settingRow} onPress={handleResetOnboarding}>
              <Text style={styles.settingLabel}>Reset Onboarding</Text>
              <Text style={styles.settingArrow}>→</Text>
            </TouchableOpacity>
            
            <View style={styles.settingDivider} />
            
            <TouchableOpacity style={styles.settingRow} onPress={handleClearData}>
              <Text style={[styles.settingLabel, { color: colors.error }]}>
                Clear All Data
              </Text>
              <Text style={[styles.settingArrow, { color: colors.error }]}>→</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={styles.appVersion}>DealHunter v1.0.0</Text>
          <Text style={styles.appCopyright}>© 2026 DealHunter Inc.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },
  headerTitle: {
    fontSize: fontSize.title,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    borderRadius: radius.lg,
    padding: spacing.lg,
    ...shadows.sm,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: fontSize.xxxl,
    fontWeight: fontWeight.bold,
    color: colors.primary,
  },
  statLabel: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  statDivider: {
    width: 1,
    backgroundColor: colors.border,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.sm,
  },
  settingsGroup: {
    backgroundColor: colors.white,
    marginHorizontal: spacing.lg,
    borderRadius: radius.lg,
    ...shadows.sm,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  settingInfo: {
    flex: 1,
    marginRight: spacing.md,
  },
  settingLabel: {
    fontSize: fontSize.lg,
    color: colors.textPrimary,
  },
  settingDescription: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginTop: 2,
  },
  settingArrow: {
    fontSize: fontSize.lg,
    color: colors.textTertiary,
  },
  settingDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginLeft: spacing.lg,
  },
  premiumCard: {
    backgroundColor: colors.primary,
    marginHorizontal: spacing.lg,
    borderRadius: radius.lg,
    padding: spacing.lg,
    ...shadows.md,
  },
  premiumContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  premiumIcon: {
    fontSize: 32,
    marginRight: spacing.md,
  },
  premiumInfo: {
    flex: 1,
  },
  premiumTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.white,
  },
  premiumDescription: {
    fontSize: fontSize.sm,
    color: colors.white,
    opacity: 0.8,
    marginTop: spacing.xs,
  },
  premiumArrow: {
    fontSize: fontSize.xl,
    color: colors.white,
  },
  appInfo: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
  },
  appVersion: {
    fontSize: fontSize.sm,
    color: colors.textTertiary,
  },
  appCopyright: {
    fontSize: fontSize.xs,
    color: colors.textTertiary,
    marginTop: spacing.xs,
  },
});
