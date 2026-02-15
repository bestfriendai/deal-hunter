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
