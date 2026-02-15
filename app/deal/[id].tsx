import { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Share,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useDealStore, Deal } from '../../src/store/dealStore';
import { colors, spacing, radius, fontSize, fontWeight, shadows } from '../../src/ui/theme';

export default function DealDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { deals, toggleFavorite, claimDeal, removeDeal } = useDealStore();
  const [deal, setDeal] = useState<Deal | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const foundDeal = deals.find(d => d.id === id);
    setDeal(foundDeal || null);
    setIsLoading(false);
  }, [id, deals]);

  const handleShare = async () => {
    if (!deal) return;
    
    try {
      await Share.share({
        message: `Check out this deal: ${deal.title} at ${deal.businessName}! ${deal.discount} off - ${deal.salePrice || ''}`,
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to share deal');
    }
  };

  const handleClaim = () => {
    if (!deal) return;
    claimDeal(deal.id);
    Alert.alert('Success!', 'Deal claimed! Show this to the merchant.');
  };

  const handleDelete = () => {
    if (!deal) return;
    
    Alert.alert(
      'Delete Deal',
      'Are you sure you want to delete this deal?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            removeDeal(deal.id);
            router.back();
          }
        },
      ]
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (!deal) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorIcon}>😕</Text>
          <Text style={styles.errorTitle}>Deal not found</Text>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Stack.Screen 
        options={{ 
          headerShown: true,
          headerTitle: '',
          headerTransparent: true,
          headerLeft: () => (
            <TouchableOpacity 
              style={styles.headerButton}
              onPress={() => router.back()}
            >
              <Text style={styles.headerButtonText}>←</Text>
            </TouchableOpacity>
          ),
          headerRight: () => (
            <View style={styles.headerButtons}>
              <TouchableOpacity 
                style={styles.headerButton}
                onPress={handleShare}
              >
                <Text style={styles.headerButtonText}>📤</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.headerButton}
                onPress={() => toggleFavorite(deal.id)}
              >
                <Text style={styles.headerButtonText}>{deal.isFavorite ? '❤️' : '🤍'}</Text>
              </TouchableOpacity>
            </View>
          ),
        }} 
      />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.discountBadgeLarge}>
            <Text style={styles.discountBadgeText}>{deal.discount}</Text>
          </View>
          
          <Text style={styles.dealTitle}>{deal.title}</Text>
          <Text style={styles.businessName}>{deal.businessName}</Text>
          
          {deal.salePrice && deal.originalPrice && (
            <View style={styles.priceContainer}>
              <Text style={styles.originalPriceLarge}>{deal.originalPrice}</Text>
              <Text style={styles.salePriceLarge}>{deal.salePrice}</Text>
              <Text style={styles.savingsText}>
                You save {Math.round((1 - parseFloat(deal.salePrice.replace('$','')) / parseFloat(deal.originalPrice.replace('$',''))) * 100)}%!
              </Text>
            </View>
          )}
        </View>

        {/* Details Card */}
        <View style={styles.detailsCard}>
          <Text style={styles.sectionTitle}>Details</Text>
          <Text style={styles.description}>{deal.description}</Text>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoIcon}>📍</Text>
            <Text style={styles.infoText}>{deal.location.address}</Text>
          </View>
          
          {deal.expiresAt && (
            <View style={styles.infoRow}>
              <Text style={styles.infoIcon}>⏰</Text>
              <Text style={styles.infoText}>
                Expires {new Date(deal.expiresAt).toLocaleDateString()}
              </Text>
            </View>
          )}
          
          <View style={styles.infoRow}>
            <Text style={styles.infoIcon}>📅</Text>
            <Text style={styles.infoText}>
              Added {new Date(deal.createdAt).toLocaleDateString()}
            </Text>
          </View>
        </View>

        {/* How to Use */}
        <View style={styles.howToCard}>
          <Text style={styles.sectionTitle}>How to Use</Text>
          <View style={styles.stepRow}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>1</Text>
            </View>
            <Text style={styles.stepText}>Tap "Claim Deal" below</Text>
          </View>
          <View style={styles.stepRow}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>2</Text>
            </View>
            <Text style={styles.stepText}>Show this to the merchant</Text>
          </View>
          <View style={styles.stepRow}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>3</Text>
            </View>
            <Text style={styles.stepText}>Enjoy your discount!</Text>
          </View>
        </View>

        {/* Delete Button */}
        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <Text style={styles.deleteButtonText}>Delete Deal</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Bottom Action */}
      <View style={styles.bottomAction}>
        {deal.isClaimed ? (
          <View style={styles.claimedContainer}>
            <Text style={styles.claimedIcon}>✓</Text>
            <Text style={styles.claimedText}>Deal Claimed!</Text>
          </View>
        ) : (
          <TouchableOpacity style={styles.claimButton} onPress={handleClaim}>
            <Text style={styles.claimButtonText}>Claim Deal</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xxl,
  },
  errorIcon: {
    fontSize: 64,
    marginBottom: spacing.lg,
  },
  errorTitle: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.semibold,
    color: colors.textPrimary,
    marginBottom: spacing.lg,
  },
  backButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
  },
  backButtonText: {
    color: colors.white,
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: radius.full,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.md,
  },
  headerButtonText: {
    fontSize: 18,
  },
  headerButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  heroSection: {
    backgroundColor: colors.primary,
    padding: spacing.xxl,
    paddingTop: spacing.xxxl,
    alignItems: 'center',
  },
  discountBadgeLarge: {
    backgroundColor: colors.white,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    marginBottom: spacing.lg,
  },
  discountBadgeText: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.primary,
  },
  dealTitle: {
    fontSize: fontSize.xxxl,
    fontWeight: fontWeight.bold,
    color: colors.white,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  businessName: {
    fontSize: fontSize.lg,
    color: colors.white,
    opacity: 0.9,
    marginBottom: spacing.lg,
  },
  priceContainer: {
    alignItems: 'center',
  },
  originalPriceLarge: {
    fontSize: fontSize.lg,
    color: colors.white,
    opacity: 0.7,
    textDecorationLine: 'line-through',
  },
  salePriceLarge: {
    fontSize: 42,
    fontWeight: fontWeight.bold,
    color: colors.white,
  },
  savingsText: {
    fontSize: fontSize.md,
    color: colors.white,
    fontWeight: fontWeight.medium,
    marginTop: spacing.xs,
  },
  detailsCard: {
    backgroundColor: colors.white,
    margin: spacing.lg,
    marginTop: -spacing.lg,
    borderRadius: radius.lg,
    padding: spacing.lg,
    ...shadows.md,
  },
  sectionTitle: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  description: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    lineHeight: 22,
    marginBottom: spacing.lg,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  infoIcon: {
    fontSize: 16,
    marginRight: spacing.sm,
  },
  infoText: {
    fontSize: fontSize.md,
    color: colors.textPrimary,
  },
  howToCard: {
    backgroundColor: colors.white,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    borderRadius: radius.lg,
    padding: spacing.lg,
    ...shadows.sm,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: radius.full,
    backgroundColor: colors.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  stepNumberText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
    color: colors.primary,
  },
  stepText: {
    fontSize: fontSize.md,
    color: colors.textPrimary,
    flex: 1,
  },
  deleteButton: {
    alignItems: 'center',
    padding: spacing.lg,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  deleteButtonText: {
    fontSize: fontSize.md,
    color: colors.error,
  },
  bottomAction: {
    backgroundColor: colors.white,
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  claimButton: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: spacing.lg,
    alignItems: 'center',
  },
  claimButtonText: {
    color: colors.white,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
  },
  claimedContainer: {
    backgroundColor: colors.success,
    borderRadius: radius.md,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  claimedIcon: {
    fontSize: fontSize.xl,
    color: colors.white,
    marginRight: spacing.sm,
  },
  claimedText: {
    color: colors.white,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
  },
});
