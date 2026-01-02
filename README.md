# ServePOS Mobile App

A modern mobile application for LocalPro POS built with Expo and React Native. This app enables customers to browse products, book services, manage orders, and receive notifications.

## Features

### 🛍️ Shopping
- Browse products and services
- Add items to cart with variations
- Apply discount codes
- Secure checkout process
- Order history tracking

### 📅 Bookings
- View available time slots
- Book appointments for services
- Manage booking history
- Receive booking reminders via notifications

### 👤 User Management
- Phone-based authentication (OTP)
- Guest checkout support
- Profile management
- Secure token storage

### 🔔 Notifications
- Booking confirmation notifications
- Reminder notifications (24 hours before appointment)
- Local push notifications support

## Tech Stack

- **Framework**: Expo (~54.0.30)
- **Routing**: Expo Router (file-based routing)
- **State Management**: Zustand
- **Forms**: React Hook Form + Zod validation
- **Storage**: Expo Secure Store
- **Notifications**: Expo Notifications
- **UI Components**: Custom components with React Native
- **Date Handling**: date-fns

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (for iOS development) or Android Emulator (for Android development)

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory:

```bash
EXPO_PUBLIC_API_URL=http://your-api-url/api
EXPO_PUBLIC_TENANT_SLUG=default
```

**Important Notes:**
- For physical devices, use your computer's IP address instead of `localhost`
- Example: `EXPO_PUBLIC_API_URL=http://192.168.1.100:3000/api`
- For Android emulator, you can use `http://10.0.2.2:3000/api`
- Restart the Expo dev server after changing `.env` file

### 3. Start the Development Server

```bash
npm start
# or
npx expo start
```

### 4. Run on Device/Emulator

- **iOS Simulator**: Press `i` in the terminal or run `npm run ios`
- **Android Emulator**: Press `a` in the terminal or run `npm run android`
- **Physical Device**: Scan the QR code with Expo Go app (iOS) or Camera app (Android)

## Project Structure

```
app/
├── (auth)/              # Authentication screens
│   ├── login.tsx        # Phone-based login with OTP
│   ├── register.tsx     # User registration
│   └── forgot-password.tsx
├── (tabs)/              # Main app tabs
│   ├── index.tsx        # Home screen
│   ├── products.tsx     # Product catalog
│   ├── bookings.tsx     # Booking management
│   ├── orders.tsx       # Order history
│   └── profile.tsx      # User profile
├── booking/             # Booking flow
│   ├── select-date.tsx
│   ├── confirm.tsx
│   └── confirmation.tsx
├── products/            # Product details
├── orders/              # Order details
├── cart.tsx             # Shopping cart
└── checkout.tsx         # Checkout screen

components/
└── ui/                  # Reusable UI components
    ├── Button.tsx
    ├── Card.tsx
    ├── Input.tsx
    ├── LoadingSpinner.tsx
    └── ErrorView.tsx

lib/
├── api/                 # API client and endpoints
│   ├── client.ts       # HTTP client with auth
│   ├── auth.ts
│   ├── products.ts
│   ├── bookings.ts
│   └── orders.ts
├── storage/            # Secure storage utilities
│   └── token.ts
└── utils/              # Utility functions
    ├── notifications.ts # Notification scheduling
    └── validation.ts

stores/                 # Zustand state management
├── authStore.ts        # Authentication state
└── cartStore.ts        # Shopping cart state

hooks/                  # Custom React hooks
├── useAuth.ts
├── useCart.ts
├── useProducts.ts
├── useBookings.ts
└── useOrders.ts
```

## Key Features Implementation

### Authentication

The app uses phone-based authentication with OTP verification:

```typescript
import { useAuth } from '@/hooks/useAuth';

const { sendLoginOtp, verifyLoginOtp, isLoading } = useAuth();
```

### Shopping Cart

Add items to cart and manage quantities:

```typescript
import { useCartStore } from '@/stores/cartStore';

const { addItem, removeItem, getTotal } = useCartStore();
```

### Booking Flow

1. Select service and date
2. Choose time slot
3. Confirm booking details
4. Receive confirmation and reminder notifications

### Notifications

Booking reminders are automatically scheduled:

```typescript
import { scheduleBookingReminder } from '@/lib/utils/notifications';

await scheduleBookingReminder(bookingDate, serviceName, 24); // 24 hours before
```

## Development

### Available Scripts

- `npm start` - Start Expo development server
- `npm run android` - Run on Android emulator
- `npm run ios` - Run on iOS simulator
- `npm run web` - Run in web browser
- `npm run lint` - Run ESLint

### Code Style

- TypeScript for type safety
- ESLint for code quality
- File-based routing with Expo Router
- Component-based architecture

## API Integration

The app communicates with a backend API. Ensure your API server is running and configured correctly.

Key API endpoints:
- `POST /api/auth/customer-login` - Customer authentication
- `GET /api/products` - Get products
- `GET /api/bookings/time-slots` - Get available time slots
- `POST /api/bookings` - Create booking
- `POST /api/transactions` - Create order

See [API_ENDPOINTS_COMPLETE.md](./API_ENDPOINTS_COMPLETE.md) for full API documentation.

## Documentation

- [MOBILE_APP_SPECS.md](./MOBILE_APP_SPECS.md) - Complete app specifications
- [MOBILE_APP_QUICK_REFERENCE.md](./MOBILE_APP_QUICK_REFERENCE.md) - Quick reference guide for developers
- [MOBILE_APP_LAYOUTS.md](./MOBILE_APP_LAYOUTS.md) - UI/UX layouts and designs
- [API_ENDPOINTS_COMPLETE.md](./API_ENDPOINTS_COMPLETE.md) - API endpoint documentation

## Troubleshooting

### API Calls Failing

1. Check `.env` file exists and `EXPO_PUBLIC_API_URL` is set
2. Verify API server is running
3. For physical devices, ensure you're using your computer's IP address (not localhost)
4. Check network connectivity and CORS settings

### Notifications Not Working

1. Ensure notification permissions are granted
2. Check device notification settings
3. For iOS, ensure app has notification permissions in Settings

### Token Not Persisting

- The app uses `expo-secure-store` for secure token storage
- Tokens are automatically included in API requests
- Check that secure store permissions are granted

## Building for Production

### iOS

```bash
eas build --platform ios
```

### Android

```bash
eas build --platform android
```

### Submit to Stores

```bash
# iOS App Store
eas submit --platform ios

# Google Play Store
eas submit --platform android
```

## Contributing

1. Follow the existing code style
2. Use TypeScript for all new code
3. Add proper error handling
4. Test on both iOS and Android when possible

## License

Private project - All rights reserved

## Support

For questions or issues:
1. Check the documentation files in the project root
2. Review the [MOBILE_APP_QUICK_REFERENCE.md](./MOBILE_APP_QUICK_REFERENCE.md)
3. Check API configuration and network connectivity

---

**Version**: 1.0.0  
**Last Updated**: 2024
