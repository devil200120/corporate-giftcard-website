import { configureStore } from '@reduxjs/toolkit';
import { 
  persistStore, 
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from '@reduxjs/toolkit';

// Import slice reducers
import authReducer from './slices/authSlice';
import productReducer from './slices/productSlice';
import categoryReducer from './slices/categorySlice';
import cartReducer from './slices/cartSlice';
import orderReducer from './slices/orderSlice';
import wishlistReducer from './slices/wishlistSlice';
import corporateReducer from './slices/corporateSlice';
import uiReducer from './slices/uiSlice';
import adminReducer from './slices/adminSlice';
import userReducer from './slices/userSlice';

// Persist configuration
const persistConfig = {
  key: 'root',
  version: 1,
  storage,
  whitelist: ['auth', 'cart', 'wishlist'], // Only persist these reducers
  blacklist: ['ui'], // Don't persist UI state
};

// Auth persist config (separate for sensitive data)
const authPersistConfig = {
  key: 'auth',
  storage,
  whitelist: ['user', 'token', 'isAuthenticated'], // Only persist essential auth data
};

// Cart persist config
const cartPersistConfig = {
  key: 'cart',
  storage,
  whitelist: ['items', 'appliedCoupons'], // Persist cart items and coupons
};

// Root reducer
const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authReducer),
  products: productReducer,
  categories: categoryReducer,
  cart: persistReducer(cartPersistConfig, cartReducer),
  orders: orderReducer,
  wishlist: wishlistReducer,
  corporate: corporateReducer,
  ui: uiReducer,
  admin: adminReducer,
  user: userReducer,
});

// Persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        ignoredActionsPaths: ['meta.arg', 'payload.timestamp'],
        ignoredPaths: ['items.dates'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

// Create persistor
export const persistor = persistStore(store);

// Export store types for use in components
export const getRootState = () => store.getState();
export const getAppDispatch = () => store.dispatch;

// Action to clear persisted data (useful for logout)
export const clearPersistedData = () => {
  persistor.purge();
};

export default store;