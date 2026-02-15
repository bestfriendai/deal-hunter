# DealHunter Architecture

## Overview

DealHunter is a React Native mobile app built with Expo that helps users discover, share, and track local deals.

## Architecture Pattern

**Clean Architecture** with three main layers:

```
┌─────────────────────────────────────┐
│         Presentation Layer          │
│  (Screens, Components, Navigation)  │
├─────────────────────────────────────┤
│           Domain Layer               │
│    (Business Logic, State Stores)   │
├─────────────────────────────────────┤
│            Data Layer                │
│  (Storage, APIs, External Services)  │
└─────────────────────────────────────┘
```

## Tech Stack

| Component | Technology |
|-----------|------------|
| Framework | Expo SDK 54 |
| Language | TypeScript |
| Navigation | Expo Router (file-based) |
| State Management | Zustand |
| Local Storage | AsyncStorage |
| Subscriptions | RevenueCat (stubbed) |

## Navigation Structure

```
Root Layout
├── Onboarding (first-time users)
├── Main Tabs (after onboarding)
│   ├── Home (index) - Deal list
│   ├── Nearby - Location-based deals
│   ├── Favorites - Saved deals
│   └── Settings - App preferences
├── Deal Detail (/deal/[id])
├── Add Deal (/add-deal)
└── Paywall (/paywall)
```

## State Management

### DealStore (`src/store/dealStore.ts`)

Manages all deal-related state:

```typescript
interface DealState {
  deals: Deal[];
  favorites: Deal[];
  categories: DealCategory[];
  selectedCategory: DealCategory | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  loadDeals: () => Promise<void>;
  addDeal: (deal: Deal) => Promise<void>;
  toggleFavorite: (dealId: string) => Promise<void>;
  claimDeal: (dealId: string) => Promise<void>;
  removeDeal: (dealId: string) => Promise<void>;
  setSelectedCategory: (category: DealCategory | null) => void;
}
```

### SettingsStore (`src/store/settingsStore.ts`)

Manages user preferences:

- Theme (light/dark mode)
- Notification preferences
- Onboarding completion status

## Data Models

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

## Storage Strategy

- **AsyncStorage**: Primary persistence layer
  - `@dealhunter_deals`: All deals
  - `@dealhunter_favorites`: Favorited deals
  - `@dealhunter_settings`: User preferences

## Theming

Design tokens in `src/ui/theme.ts`:

- **Colors**: Brand orange (#FF6B35) + semantic colors
- **Spacing**: 8pt grid system
- **Radius**: Consistent border radius
- **Typography**: System fonts with size scale
- **Shadows**: Elevation-based shadow system

## Future Enhancements

### Phase 2 (Premium)
- RevenueCat subscription integration
- Push notifications for nearby deals
- Deal sharing via social media
- User accounts and cloud sync

### Phase 3 (Community)
- Deal submission with verification
- Business owner accounts
- Deal analytics for merchants
- Location-based deal alerts

## Error Handling

- Network errors: Retry with exponential backoff
- Storage errors: Graceful degradation
- Invalid data: Validation with user feedback
