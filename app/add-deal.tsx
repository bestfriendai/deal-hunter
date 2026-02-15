import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, Stack } from 'expo-router';
import { useDealStore, DealCategory, CATEGORY_LABELS } from '../../src/store/dealStore';
import { colors, spacing, radius, fontSize, fontWeight, shadows } from '../../src/ui/theme';

const CATEGORIES: DealCategory[] = ['food', 'shopping', 'entertainment', 'health', 'services', 'travel', 'education', 'other'];

export default function AddDealScreen() {
  const router = useRouter();
  const { addDeal } = useDealStore();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [category, setCategory] = useState<DealCategory>('food');
  const [discount, setDiscount] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [salePrice, setSalePrice] = useState('');
  const [address, setAddress] = useState('');
  const [daysUntilExpiry, setDaysUntilExpiry] = useState('7');

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a deal title');
      return;
    }
    if (!businessName.trim()) {
      Alert.alert('Error', 'Please enter a business name');
      return;
    }
    if (!address.trim()) {
      Alert.alert('Error', 'Please enter an address');
      return;
    }

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + parseInt(daysUntilExpiry) || 7);

    await addDeal({
      title: title.trim(),
      description: description.trim(),
      businessName: businessName.trim(),
      category,
      discount: discount.trim() || 'SPECIAL DEAL',
      originalPrice: originalPrice.trim() || undefined,
      salePrice: salePrice.trim() || undefined,
      location: { address: address.trim() },
      expiresAt: expiresAt.toISOString(),
    });

    Alert.alert('Success!', 'Deal added successfully');
    router.back();
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Stack.Screen 
        options={{ 
          headerShown: true,
          headerTitle: 'Add Deal',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity onPress={handleSave}>
              <Text style={styles.saveText}>Save</Text>
            </TouchableOpacity>
          ),
        }} 
      />
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Title */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Deal Title *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., 50% Off All Sushi Rolls"
              placeholderTextColor={colors.textTertiary}
              value={title}
              onChangeText={setTitle}
            />
          </View>

          {/* Business Name */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Business Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Tokyo Bay Sushi"
              placeholderTextColor={colors.textTertiary}
              value={businessName}
              onChangeText={setBusinessName}
            />
          </View>

          {/* Category */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Category</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoriesContainer}
            >
              {CATEGORIES.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[styles.categoryChip, category === cat && styles.categoryChipSelected]}
                  onPress={() => setCategory(cat)}
                >
                  <Text style={[styles.categoryChipText, category === cat && styles.categoryChipTextSelected]}>
                    {CATEGORY_LABELS[cat]}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Description */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="What does the deal include? Any restrictions?"
              placeholderTextColor={colors.textTertiary}
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={3}
            />
          </View>

          {/* Discount */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Discount</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., 50% OFF, BOGO, $5 OFF"
              placeholderTextColor={colors.textTertiary}
              value={discount}
              onChangeText={setDiscount}
            />
          </View>

          {/* Prices */}
          <View style={styles.priceRow}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: spacing.sm }]}>
              <Text style={styles.label}>Original Price</Text>
              <TextInput
                style={styles.input}
                placeholder="$30"
                placeholderTextColor={colors.textTertiary}
                value={originalPrice}
                onChangeText={setOriginalPrice}
              />
            </View>
            <View style={[styles.inputGroup, { flex: 1, marginLeft: spacing.sm }]}>
              <Text style={styles.label}>Sale Price</Text>
              <TextInput
                style={styles.input}
                placeholder="$15"
                placeholderTextColor={colors.textTertiary}
                value={salePrice}
                onChangeText={setSalePrice}
              />
            </View>
          </View>

          {/* Address */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Location *</Text>
            <TextInput
              style={styles.input}
              placeholder="Business address"
              placeholderTextColor={colors.textTertiary}
              value={address}
              onChangeText={setAddress}
            />
          </View>

          {/* Expiry */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Expires In (days)</Text>
            <TextInput
              style={styles.input}
              placeholder="7"
              placeholderTextColor={colors.textTertiary}
              value={daysUntilExpiry}
              onChangeText={setDaysUntilExpiry}
              keyboardType="number-pad"
            />
          </View>

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Add Deal</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  cancelText: {
    fontSize: fontSize.lg,
    color: colors.primary,
  },
  saveText: {
    fontSize: fontSize.lg,
    color: colors.primary,
    fontWeight: fontWeight.semibold,
  },
  inputGroup: {
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: colors.white,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    fontSize: fontSize.lg,
    color: colors.textPrimary,
    borderWidth: 1,
    borderColor: colors.border,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  categoriesContainer: {
    paddingVertical: spacing.xs,
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
  priceRow: {
    flexDirection: 'row',
    marginBottom: spacing.lg,
  },
  saveButton: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    marginHorizontal: spacing.lg,
    marginBottom: spacing.xxxl,
    ...shadows.md,
  },
  saveButtonText: {
    color: colors.white,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
  },
});
