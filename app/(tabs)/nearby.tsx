import { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useDealStore, Deal } from '../../src/store/dealStore';
import { useSettingsStore } from '../../src/store/settingsStore';
import { colors, spacing, radius, fontSize, fontWeight, shadows } from '../../src/ui/theme';

export default function NearbyScreen() {
  const router = useRouter();
  const { deals, loadDeals, toggleFavorite } = useDealStore();
  const { locationEnabled } = useSettingsStore();
  const [isLoading, setIsLoading] = useState(true);
  const [userLocation] = useState({ latitude: 40.7128, longitude: -74.0060 }); // NYC default

  useEffect(() => {
    const load = async () => {
      await loadDeals();
      setIsLoading(false);
    };
    load();
  }, []);

  // Sort deals by distance (simulated - in real app would use actual GPS)
  const nearbyDeals = [...deals].map(deal => ({
    ...deal,
    distance: Math.random() * 10, // Simulated distance 0-10 miles
  })).sort((a, b) => (a.distance || 0) - (b.distance || 0));

  const handleDealPress = (deal: Deal) => {
    router.push(`/deal/${deal.id}`);
  };

  const renderDealCard = ({ item }: { item: Deal & { distance?: number } }) => (
    <TouchableOpacity 
      style={styles.dealCard} 
      onPress={() => handleDealPress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.dealCardHeader}>
        <View style={styles.discountBadge}>
          <Text style={styles.discountText}>{item.discount}</Text>
        </View>
        <View style={styles.distanceBadge}>
          <Text style={styles.distanceText}>{item.distance?.toFixed(1)} mi</Text>
        </View>
      </View>
      
      <Text style={styles.dealTitle}>{item.title}</Text>
      <Text style={styles.businessName}>{item.businessName}</Text>
      
      <View style={styles.dealCardFooter}>
        <View style={styles.locationRow}>
          <Text style={styles.locationIcon}>📍</Text>
          <Text style={styles.locationText} numberOfLines={1}>{item.location.address}</Text>
        </View>
      </View>
      
      {item.salePrice && item.originalPrice && (
        <View style={styles.priceRow}>
          <Text style={styles.originalPrice}>{item.originalPrice}</Text>
          <Text style={styles.salePrice}>{item.salePrice}</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Finding deals near you...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Nearby</Text>
        <Text style={styles.headerSubtitle}>
          Deals within 10 miles
        </Text>
      </View>

      {!locationEnabled && (
        <View style={styles.locationWarning}>
          <Text style={styles.locationWarningIcon}>📍</Text>
          <Text style={styles.locationWarningText}>
            Enable location in Settings to see deals near you
          </Text>
        </View>
      )}

      <FlatList
        data={nearbyDeals}
        renderItem={renderDealCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🗺️</Text>
            <Text style={styles.emptyTitle}>No nearby deals</Text>
            <Text style={styles.emptySubtitle}>
              Check back later for deals in your area
            </Text>
          </View>
        }
      />
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
  headerSubtitle: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: spacing.md,
    fontSize: fontSize.md,
    color: colors.textSecondary,
  },
  locationWarning: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.warning + '15',
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    padding: spacing.md,
    borderRadius: radius.md,
  },
  locationWarningIcon: {
    fontSize: 16,
    marginRight: spacing.sm,
  },
  locationWarningText: {
    flex: 1,
    fontSize: fontSize.sm,
    color: colors.warning,
  },
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  dealCard: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  dealCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  discountBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.sm,
  },
  discountText: {
    color: colors.white,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
  },
  distanceBadge: {
    backgroundColor: colors.info + '20',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.sm,
  },
  distanceText: {
    color: colors.info,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.medium,
  },
  dealTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  businessName: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  dealCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  locationIcon: {
    fontSize: 12,
    marginRight: spacing.xs,
  },
  locationText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    flex: 1,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  originalPrice: {
    fontSize: fontSize.md,
    color: colors.textTertiary,
    textDecorationLine: 'line-through',
    marginRight: spacing.sm,
  },
  salePrice: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.primary,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 100,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: spacing.lg,
  },
  emptyTitle: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.semibold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  emptySubtitle: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
