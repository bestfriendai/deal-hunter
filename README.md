# DealHunter 🏷️

Discover and share local deals in your area. Never miss a bargain again.

## Features

- **Browse Deals**: Explore local deals filtered by category (Food, Shopping, Entertainment, Health, Services, Travel, Education)
- **Search**: Find deals quickly with full-text search
- **Favorites**: Save deals you love for quick access
- **Claim Deals**: Mark deals as claimed when you use them
- **Add Your Own**: Share deals you find with the community
- **Expiration Tracking**: See when deals expire
- **Location-Based**: View deal locations with addresses

## Tech Stack

- **Framework**: Expo SDK 54 with Expo Router
- **Language**: TypeScript
- **State Management**: Zustand
- **Persistence**: AsyncStorage
- **UI**: React Native with custom theme

## Design

- **Brand Color**: #FF6B35 (Vibrant Orange)
- **Style**: Clean, modern, deal-focused
- **Primary Font**: System default
- **Dark Mode**: Supported via theme system

## Project Structure

```
deal-hunter/
├── app/                    # Expo Router screens
│   ├── (tabs)/            # Tab navigation
│   │   ├── index.tsx     # Home (deal list)
│   │   ├── nearby.tsx    # Nearby deals
│   │   ├── favorites.tsx # Saved deals
│   │   └── settings.tsx  # App settings
│   ├── deal/[id].tsx     # Deal detail
│   ├── add-deal.tsx      # Add new deal
│   ├── onboarding.tsx    # First-time user flow
│   └── paywall.tsx       # Premium upgrade
├── src/
│   ├── store/            # Zustand stores
│   │   ├── dealStore.ts  # Deals state
│   │   └── settingsStore.ts # Settings state
│   ├── services/         # External services
│   │   └── purchases.ts # RevenueCat stub
│   └── ui/              # UI utilities
│       └── theme.ts      # Design tokens
└──aso/                   # App Store Optimization
```

## Getting Started

See [SETUP.md](./SETUP.md) for detailed installation and launch instructions.

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npx expo start
```

## API Configuration

### Environment Variables

Create a `.env` file in the project root:

```bash
# Deal/Coupon API (for deal aggregation)
DEAL_API_KEY=your_deal_api_key
DEAL_API_URL=https://api.dealhunter.com/v1

# Location Services
MAPS_API_KEY=your_maps_api_key
```

### RevenueCat Configuration

1. Create an account at [RevenueCat.com](https://revenuecat.com)
2. Create products in App Store Connect / Google Play Console:
   - Monthly: $2.99/month - `dealhunter_monthly`
   - Annual: $14.99/year - `dealhunter_annual`
3. Configure products in RevenueCat dashboard
4. Add your API key:

```typescript
// src/services/purchases.ts
export const REVENUECAT_API_KEY = 'your_revenuecat_public_key';
```

## Screenshots

The app features:
- Vibrant orange branding
- Card-based deal display with discount badges
- Category filtering chips
- Search functionality
- Pull-to-refresh deal list
- Favorites with heart toggle

## License

MIT

## API Configuration

### Required API Keys
Create a `.env` file in the project root:
```bash
EXPO_PUBLIC_REVENUECAT_API_KEY=your_revenuecat_api_key
EXPO_PUBLIC_DEAL_API_KEY=your_deal_api_key
EXPO_PUBLIC_MAPS_API_KEY=your_maps_api_key
```

### Getting API Keys
1. RevenueCat: https://www.revenuecat.com
2. Deal API: Provider of your choice
3. Maps API: Google Maps or Apple Maps

### Type Checking
npx tsc --noEmit

### Building for Production
eas build --platform ios
eas build --platform android
