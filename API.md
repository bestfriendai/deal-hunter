# DealHunter API

## Store API

### useDealStore

Main state management for deals.

```typescript
import { useDealStore } from './src/store/dealStore';
```

#### State

```typescript
{
  deals: Deal[];
  favorites: Deal[];
  categories: DealCategory[];
  selectedCategory: DealCategory | null;
  isLoading: boolean;
  error: string | null;
}
```

#### Actions

##### loadDeals()

```typescript
const { loadDeals } = useDealStore();
await loadDeals();
```
Loads deals from AsyncStorage. Seeds sample data if empty.

##### addDeal(deal)

```typescript
const { addDeal } = useDealStore();
await addDeal({
  title: '50% Off Lunch',
  businessName: 'Local Cafe',
  category: 'food',
  discount: '50% OFF',
  location: { address: '123 Main St' },
  expiresAt: '2024-12-31',
});
```
Adds a new deal to the store.

##### toggleFavorite(dealId)

```typescript
const { toggleFavorite } = useDealStore();
await toggleFavorite('deal-123');
```
Toggles favorite status for a deal.

##### claimDeal(dealId)

```typescript
const { claimDeal } = useDealStore();
await claimDeal('deal-123');
```
Marks a deal as claimed/used.

##### removeDeal(dealId)

```typescript
const { removeDeal } = useDealStore();
await removeDeal('deal-123');
```
Removes a deal from storage.

##### setSelectedCategory(category)

```typescript
const { setSelectedCategory } = useDealStore();
setSelectedCategory('food'); // Filter by category
setSelectedCategory(null);   // Clear filter
```
Sets the active category filter.

## Types

### Deal

```typescript
interface Deal {
  id: string;
  title: string;
  description: string;
  businessName: string;
  category: DealCategory;
  discount: string;
  originalPrice?: string;
  salePrice?: string;
  location: {
    address: string;
    latitude?: number;
    longitude?: number;
  };
  expiresAt?: string;
  imageUrl?: string;
  isFavorite: boolean;
  isClaimed: boolean;
  createdAt: string;
  distance?: number;
}
```

### DealCategory

```typescript
type DealCategory = 
  | 'food'
  | 'shopping'
  | 'entertainment'
  | 'health'
  | 'services'
  | 'travel'
  | 'education'
  | 'other';
```

## Theme API

### Colors

```typescript
import { colors } from './src/ui/theme';

colors.primary      // #FF6B35 - Brand orange
colors.primaryDark // #E55A2B
colors.primaryLight// #FF8A5C
colors.background  // #F8F9FA
colors.surface      // #FFFFFF
colors.textPrimary  // #1C1C1E
colors.success      // #34C759
colors.warning      // #FF9500
colors.error        // #FF3B30
```

### Spacing

```typescript
import { spacing } from './src/ui/theme';

spacing.xs   // 4
spacing.sm   // 8
spacing.md   // 12
spacing.lg   // 16
spacing.xl   // 20
spacing.xxl  // 24
spacing.xxxl // 32
```

### Typography

```typescript
import { fontSize, fontWeight } from './src/ui/theme';

fontSize.xs     // 11
fontSize.sm     // 13
fontSize.md     // 15
fontSize.lg     // 17
fontSize.xl     // 20
fontSize.xxl    // 22
fontSize.xxxl   // 28
fontSize.title  // 34

fontWeight.regular   // '400'
fontWeight.medium    // '500'
fontWeight.semibold  // '600'
fontWeight.bold      // '700'
```
