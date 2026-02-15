import { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  TextInput,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useDealStore, Deal, DealCategory, CATEGORY_LABELS, CATEGORY_ICONS } from '../../src/store/dealStore';
import { colors, spacing, radius, fontSize, fontWeight, shadows } from '../../src/ui/theme';

export default function HomeScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  
  const { 
    deals, 
    categories, 
    selectedCategory, 
    setSelectedCategory,
    loadDeals, 
    toggleFavorite,
    isLoading 
  } = useDealStore();

  useEffect(() => {
    loadDeals();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadDeals();
    setRefreshing(false);
  }, [loadDeals]);

  const filteredDeals = deals.filter(deal => {
    const matchesSearch = deal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      deal.businessName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || deal.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleDealPress = (deal: Deal) => {
    router.push(`/deal/${deal.id}`);
  };

  const handleAddDeal = () => {
    router.push('/add-deal');
  };

  const renderCategoryChip = (category: DealCategory) => {
    const isSelected = selectedCategory === category;
    return (
      <TouchableOpacity
        key={category}
        style={[styles.categoryChip, isSelected && styles.categoryChipSelected]}
        onPress={() => setSelectedCategory(isSelected ? null : category)}
      >
        <Text style={[styles.categoryChipText, isSelected && styles.categoryChipTextSelected]}>
          {CATEGORY_LABELS[category]}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderDealCard = ({ item }: { item: Deal }) => (
    <TouchableOpacity 
      style={styles.dealCard} 
      onPress={() => handleDealPress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.dealCardHeader}>
        <View style={styles.discountBadge}>
          <Text style={styles.discountText}>{item.discount}</Text>
        </View>
        <TouchableOpacity 
          onPress={() => toggleFavorite(item.id)}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={styles.favoriteIcon}>{item.isFavorite ? '❤️' : '🤍'}</Text>
        </TouchableOpacity>
      </View>
      
      <Text style={styles.dealTitle}>{item.title}</Text>
      <Text style={styles.businessName}>{item.businessName}</Text>
      
      <View style={styles.dealCardFooter}>
        <View style={styles.locationRow}>
          <Text style={styles.locationIcon}>📍</Text>
          <Text style={styles.locationText} numberOfLines={1}>{item.location.address}</Text>
        </View>
        {item.expiresAt && (
          <Text style={styles.expiresText}>
            Expires {new Date(item.expiresAt).toLocaleDateString()}
          </Text>
        )}
      </View>
      
      {item.salePrice && item.originalPrice && (
        <View style={styles.priceRow}>
          <Text style={styles.originalPrice}>{item.originalPrice}</Text>
          <Text style={styles.salePrice}>{item.salePrice}</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>DealHunter</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleAddDeal}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search deals..."
          placeholderTextColor={colors.textTertiary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <View style={styles.categoriesContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesScroll}
        >
          {categories.map(renderCategoryChip)}
        </ScrollView>
      </View>

      <FlatList
        data={filteredDeals}
        renderItem={renderDealCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🏷️</Text>
            <Text style={styles.emptyTitle}>No deals found</Text>
            <Text style={styles.emptySubtitle}>
              {selectedCategory ? 'Try a different category' : 'Add your first deal!'}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  headerTitle: {
    fontSize: fontSize.title,
    fontWeight: fontWeight.bold,
.textPrimary,
     color: colors },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: radius.full,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.md,
  },
  addButtonText: {
    fontSize: 24,
    color: colors.white,
    fontWeight: fontWeight.bold,
    marginTop: -2,
  },
  searchContainer: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  searchInput: {
    backgroundColor: colors.white,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    fontSize: fontSize.md,
    color: colors.textPrimary,
    borderWidth: 1,
    borderColor: colors.border,
  },
  categoriesContainer: {
    marginBottom: spacing.md,
  },
  categoriesScroll: {
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
  },
  categoryChip: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: spacing.sm,
  },
  categoryChipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  categoryChipText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    fontWeight: fontWeight.medium,
  },
  categoryChipTextSelected: {
    color: colors.white,
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
  favoriteIcon: {
    fontSize: 20,
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
  expiresText: {
    fontSize: fontSize.xs,
    color: colors.warning,
    fontWeight: fontWeight.medium,
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
    paddingVertical: spacing.xxxl,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: spacing.md,
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
  },
});
