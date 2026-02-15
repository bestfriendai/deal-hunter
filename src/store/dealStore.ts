import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Deal {
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

export type DealCategory = 
  | 'food'
  | 'shopping'
  | 'entertainment'
  | 'health'
  | 'services'
  | 'travel'
  | 'education'
  | 'other';

export const CATEGORY_LABELS: Record<DealCategory, string> = {
  food: 'Food & Drinks',
  shopping: 'Shopping',
  entertainment: 'Entertainment',
  health: 'Health & Beauty',
  services: 'Services',
  travel: 'Travel',
  education: 'Education',
  other: 'Other',
};

export const CATEGORY_ICONS: Record<DealCategory, string> = {
  food: 'restaurant',
  shopping: 'shopping-bag',
  entertainment: 'movie',
  health: 'medical',
  services: 'handyman',
  travel: 'flight',
  education: 'school',
  other: 'local-offer',
};

interface DealState {
  deals: Deal[];
  favorites: Deal[];
  categories: DealCategory[];
  selectedCategory: DealCategory | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  loadDeals: () => Promise<void>;
  addDeal: (deal: Omit<Deal, 'id' | 'createdAt' | 'isFavorite' | 'isClaimed'>) => Promise<void>;
  toggleFavorite: (dealId: string) => Promise<void>;
  claimDeal: (dealId: string) => Promise<void>;
  removeDeal: (dealId: string) => Promise<void>;
  setSelectedCategory: (category: DealCategory | null) => void;
  clearError: () => void;
}

const STORAGE_KEY = '@dealhunter_deals';
const FAVORITES_KEY = '@dealhunter_favorites';

export const useDealStore = create<DealState>((set, get) => ({
  deals: [],
  favorites: [],
  categories: ['food', 'shopping', 'entertainment', 'health', 'services', 'travel', 'education', 'other'],
  selectedCategory: null,
  isLoading: false,
  error: null,

  // TODO: Replace with real API call to fetch deals from backend
  // loadDeals: async () => {
  //   const response = await fetch('https://api.dealhunter.app/deals');
  //   const deals = await response.json();
  //   set({ deals, isLoading: false });
  // },
  loadDeals: async () => {
    set({ isLoading: true, error: null });
    try {
      const [dealsData, favoritesData] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEY),
        AsyncStorage.getItem(FAVORITES_KEY),
      ]);
      
      const deals = dealsData ? JSON.parse(dealsData) : [];
      const favorites = favoritesData ? JSON.parse(favoritesData) : [];
      
      // If no deals, seed with sample data
      if (deals.length === 0) {
        const sampleDeals = generateSampleDeals();
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(sampleDeals));
        set({ deals: sampleDeals, favorites: [], isLoading: false });
      } else {
        set({ deals, favorites, isLoading: false });
      }
    } catch (error) {
      set({ error: 'Failed to load deals', isLoading: false });
    }
  },

  addDeal: async (dealData) => {
    const newDeal: Deal = {
      ...dealData,
      id: Date.now().toString(),
      isFavorite: false,
      isClaimed: false,
      createdAt: new Date().toISOString(),
    };
    
    const { deals } = get();
    const updatedDeals = [newDeal, ...deals];
    
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedDeals));
    set({ deals: updatedDeals });
  },

  toggleFavorite: async (dealId) => {
    const { deals, favorites } = get();
    
    const updatedDeals = deals.map(deal => 
      deal.id === dealId ? { ...deal, isFavorite: !deal.isFavorite } : deal
    );
    
    const deal = deals.find(d => d.id === dealId);
    if (!deal) return;
    
    let updatedFavorites;
    if (deal.isFavorite) {
      updatedFavorites = favorites.filter(d => d.id !== dealId);
    } else {
      updatedFavorites = [...favorites, { ...deal, isFavorite: true }];
    }
    
    await Promise.all([
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedDeals)),
      AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedFavorites)),
    ]);
    
    set({ deals: updatedDeals, favorites: updatedFavorites });
  },

  claimDeal: async (dealId) => {
    const { deals } = get();
    
    const updatedDeals = deals.map(deal =>
      deal.id === dealId ? { ...deal, isClaimed: true } : deal
    );
    
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedDeals));
    set({ deals: updatedDeals });
  },

  removeDeal: async (dealId) => {
    const { deals, favorites } = get();
    
    const updatedDeals = deals.filter(deal => deal.id !== dealId);
    const updatedFavorites = favorites.filter(deal => deal.id !== dealId);
    
    await Promise.all([
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedDeals)),
      AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedFavorites)),
    ]);
    
    set({ deals: updatedDeals, favorites: updatedFavorites });
  },

  setSelectedCategory: (category) => {
    set({ selectedCategory: category });
  },

  clearError: () => {
    set({ error: null });
  },
}));

function generateSampleDeals(): Deal[] {
  return [
    {
      id: '1',
      title: '50% Off All Sushi Rolls',
      description: 'Valid for dine-in only. Not valid with other offers. Maximum 2 per table.',
      businessName: 'Tokyo Bay Sushi',
      category: 'food',
      discount: '50% OFF',
      originalPrice: '$30',
      salePrice: '$15',
      location: { address: '123 Main St, Downtown' },
      expiresAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      isFavorite: false,
      isClaimed: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: '2',
      title: 'Buy 1 Get 1 Free Haircut',
      description: 'New clients only. Valid at all locations. Book online to redeem.',
      businessName: 'Fade Masters',
      category: 'services',
      discount: 'BOGO',
      originalPrice: '$40',
      salePrice: '$20',
      location: { address: '456 Oak Avenue' },
      expiresAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      isFavorite: true,
      isClaimed: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: '3',
      title: 'Free Appetizer with Entree',
      description: 'Valid for lunch and dinner. Choose from select appetizers.',
      businessName: 'The Rustic Table',
      category: 'food',
      discount: 'FREE',
      originalPrice: '$12',
      salePrice: '$0',
      location: { address: '789 Elm Street' },
      expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      isFavorite: false,
      isClaimed: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: '4',
      title: '25% Off Fitness Membership',
      description: 'First month only. Includes access to all equipment and classes.',
      businessName: 'Peak Performance Gym',
      category: 'health',
      discount: '25% OFF',
      originalPrice: '$80',
      salePrice: '$60',
      location: { address: '321 Health Blvd' },
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      isFavorite: false,
      isClaimed: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: '5',
      title: 'Movie Tickets - $5 Off',
      description: 'Valid for any showing. Maximum 4 tickets per transaction.',
      businessName: 'CineMax Theater',
      category: 'entertainment',
      discount: '$5 OFF',
      originalPrice: '$16',
      salePrice: '$11',
      location: { address: '555 Cinema Way' },
      expiresAt: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
      isFavorite: true,
      isClaimed: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: '6',
      title: '30% Off Winter Collection',
      description: 'In-store and online. While supplies last.',
      businessName: 'Style Hub',
      category: 'shopping',
      discount: '30% OFF',
      originalPrice: '$100',
      salePrice: '$70',
      location: { address: '100 Fashion Lane' },
      expiresAt: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
      isFavorite: false,
      isClaimed: false,
      createdAt: new Date().toISOString(),
    },
  ];
}
