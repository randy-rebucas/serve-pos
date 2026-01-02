# Mobile App Quick Reference Guide

A quick reference guide for developers building the LocalPro POS mobile app with Expo.

---

## Quick Start

### 1. Initialize Expo Project

```bash
npx create-expo-app@latest localpro-mobile --template
cd localpro-mobile
```

### 2. Install Core Dependencies

```bash
npx expo install expo-router expo-secure-store expo-notifications
npm install axios zustand react-hook-form zod date-fns
```

### 3. Project Structure

```
app/
├── (auth)/
│   ├── login.tsx
│   └── register.tsx
├── (tabs)/
│   ├── index.tsx
│   ├── bookings.tsx
│   ├── products.tsx
│   ├── orders.tsx
│   └── profile.tsx
└── _layout.tsx
```

---

## API Integration

### Base API Client

```typescript
// lib/api/client.ts
import { apiClient } from './client';
import { getToken } from '../storage/token';

// The apiClient is a singleton instance that handles:
// - Automatic token injection
// - Error handling
// - Timeout management
// - JSON parsing

// Usage:
const data = await apiClient.get('/products');
const result = await apiClient.post('/bookings', bookingData);
```

### Key API Endpoints

| Feature | Method | Endpoint | Auth Required |
|---------|--------|----------|---------------|
| Customer Login | POST | `/api/auth/customer-login` | No |
| Customer Register | POST | `/api/customers` | No |
| Get Products | GET | `/api/products?tenantSlug={slug}` | No |
| Get Services | GET | `/api/products?productType=service` | No |
| Get Time Slots | GET | `/api/bookings/time-slots?date={date}` | No |
| Create Booking | POST | `/api/bookings` | Yes |
| Get My Bookings | GET | `/api/bookings?customerEmail={email}` | Yes |
| Create Order | POST | `/api/transactions` | Yes |
| Get My Orders | GET | `/api/transactions?customerEmail={email}` | Yes |

---

## State Management

### Auth Store (Zustand)

```typescript
// stores/authStore.ts
import { create } from 'zustand';
import { getToken, getUserData, removeToken, saveToken, saveUserData } from '../lib/storage/token';
import { Customer } from '../types';

interface AuthState {
  user: Customer | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: Customer) => void;
  setToken: (token: string) => Promise<void>;
  logout: () => Promise<void>;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  setUser: (user) => {
    set({ user, isAuthenticated: true });
    saveUserData(JSON.stringify(user)).catch(console.error);
  },
  setToken: async (token) => {
    await saveToken(token);
    set({ token });
  },
  logout: async () => {
    await removeToken();
    set({ user: null, token: null, isAuthenticated: false });
  },
  initialize: async () => {
    // Load stored auth state on app start
    const [storedToken, storedUserData] = await Promise.all([
      getToken(),
      getUserData(),
    ]);
    if (storedToken && storedUserData) {
      const user = JSON.parse(storedUserData) as Customer;
      set({ user, token: storedToken, isAuthenticated: true, isLoading: false });
    } else {
      set({ isLoading: false });
    }
  },
}));
```

### Cart Store

```typescript
interface CartState {
  items: CartItem[];
  addItem: (product: Product, qty: number) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
  getTotal: () => number;
}
```

---

## Navigation

### Tab Navigation

```typescript
// app/(tabs)/_layout.tsx
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Theme';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textSecondary,
        headerShown: false,
      }}
    >
      <Tabs.Screen 
        name="index" 
        options={{ 
          title: 'Home',
          tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color} />,
        }} 
      />
      <Tabs.Screen 
        name="bookings" 
        options={{ 
          title: 'Bookings',
          tabBarIcon: ({ color, size }) => <Ionicons name="calendar" size={size} color={color} />,
        }} 
      />
      <Tabs.Screen 
        name="products" 
        options={{ 
          title: 'Shop',
          tabBarIcon: ({ color, size }) => <Ionicons name="bag" size={size} color={color} />,
        }} 
      />
      <Tabs.Screen 
        name="orders" 
        options={{ 
          title: 'Orders',
          tabBarIcon: ({ color, size }) => <Ionicons name="list" size={size} color={color} />,
        }} 
      />
      <Tabs.Screen 
        name="profile" 
        options={{ 
          title: 'Profile',
          tabBarIcon: ({ color, size }) => <Ionicons name="person" size={size} color={color} />,
        }} 
      />
    </Tabs>
  );
}
```

### Stack Navigation

```typescript
// app/_layout.tsx
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}
```

---

## Common Components

### Button Component

```typescript
// components/ui/Button.tsx
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Colors, Typography, BorderRadius, Spacing } from '../../constants/Theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
  loading?: boolean;
}

export default function Button({ 
  title, 
  onPress, 
  variant = 'primary',
  disabled = false,
  loading = false 
}: ButtonProps) {
  return (
    <TouchableOpacity
      style={[styles.button, variant === 'primary' ? styles.primaryButton : styles.secondaryButton]}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? Colors.surface : Colors.primary} />
      ) : (
        <Text style={styles.buttonText}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}
```

### Card Component

```typescript
// components/ui/Card.tsx
import { View, StyleSheet } from 'react-native';
import { Colors, BorderRadius, Spacing, Shadows } from '../../constants/Theme';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export default function Card({ children, style }: CardProps) {
  return <View style={[styles.card, style]}>{children}</View>;
}
```

---

## Forms

### Login Form

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  tenantSlug: z.string(),
});

export function LoginScreen() {
  const { control, handleSubmit } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    // Login logic
  };

  return (
    // Form JSX
  );
}
```

---

## Key Features Implementation

### 1. Booking Flow

```typescript
import { apiClient } from '@/lib/api/client';

// 1. Get available time slots
const timeSlots = await apiClient.get(`/bookings/time-slots?date=${selectedDate}&duration=30`, false);

// 2. Create booking
const booking = await apiClient.post('/bookings', {
  customerName: user.name,
  customerEmail: user.email,
  serviceName: 'Haircut',
  startTime: selectedTime,
  duration: 30,
});
```

### 2. Shopping Cart

```typescript
import { apiClient } from '@/lib/api/client';
import { useCartStore } from '@/stores/cartStore';

// Add to cart
const addToCart = (product: Product) => {
  useCartStore.getState().addItem(product, 1);
};

// Checkout
const checkout = async () => {
  const items = useCartStore.getState().items;
  const order = await apiClient.post('/transactions', {
    items: items.map(item => ({
      product: item.product._id,
      name: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
      subtotal: item.product.price * item.quantity,
    })),
    total: useCartStore.getState().getTotal(),
  });
};
```

### 3. Notifications

```typescript
import * as Notifications from 'expo-notifications';

// Request permissions
await Notifications.requestPermissionsAsync();

// Schedule booking reminder
await Notifications.scheduleNotificationAsync({
  content: {
    title: 'Booking Reminder',
    body: 'Your appointment is tomorrow at 10:00 AM',
  },
  trigger: { date: new Date(bookingDate - 24 * 60 * 60 * 1000) },
});
```

---

## Environment Variables

```bash
# .env
EXPO_PUBLIC_API_URL=https://your-domain.com/api
EXPO_PUBLIC_TENANT_SLUG=default
```

---

## Testing Checklist

### Authentication
- [ ] User can register
- [ ] User can login
- [ ] User can logout
- [ ] Token is stored securely
- [ ] Token expiration handled

### Bookings
- [ ] View available time slots
- [ ] Create booking
- [ ] View my bookings
- [ ] Cancel booking
- [ ] Receive booking confirmation

### Shopping
- [ ] Browse products
- [ ] Add to cart
- [ ] Remove from cart
- [ ] Apply discount code
- [ ] Complete checkout
- [ ] View order history

### Profile
- [ ] View profile
- [ ] Edit profile
- [ ] Manage addresses
- [ ] Change password

---

## Common Issues & Solutions

### Issue: API calls failing
**Solution**: 
- Check API URL configuration in `.env` file
- Ensure `EXPO_PUBLIC_API_URL` is set correctly
- For physical devices, use your computer's IP address instead of localhost
- Check network connectivity and CORS settings on backend

### Issue: Token not persisting
**Solution**: Ensure using `expo-secure-store` not AsyncStorage

### Issue: Navigation not working
**Solution**: Check `expo-router` version and file structure

### Issue: Images not loading
**Solution**: Use `expo-image` instead of `Image` from react-native

---

## Performance Tips

1. **Image Optimization**: Use `expo-image` with caching
2. **Lazy Loading**: Load data on scroll
3. **Memoization**: Use `React.memo` for list items
4. **Code Splitting**: Use dynamic imports for heavy screens

---

## Deployment

### Build for Production

```bash
# iOS
eas build --platform ios

# Android
eas build --platform android
```

### Submit to Stores

```bash
# iOS App Store
eas submit --platform ios

# Google Play Store
eas submit --platform android
```

---

## Resources

- [Expo Documentation](https://docs.expo.dev/)
- [Expo Router](https://docs.expo.dev/router/introduction/)
- [React Native Paper](https://callstack.github.io/react-native-paper/)
- [Zustand](https://github.com/pmndrs/zustand)
- [React Hook Form](https://react-hook-form.com/)

---

## Support

For questions or issues:
1. Check the main [MOBILE_APP_SPECS.md](./MOBILE_APP_SPECS.md)
2. Review [MOBILE_APP_LAYOUTS.md](./MOBILE_APP_LAYOUTS.md)
3. Check API documentation in [MOBILE_API_REFERENCE.md](./MOBILE_API_REFERENCE.md)

---

**Last Updated**: 2024
**Version**: 1.0
