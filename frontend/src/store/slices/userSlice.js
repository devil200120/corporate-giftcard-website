import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { userAPI } from '../../services/api';

// Async thunks for user operations
export const fetchUserProfile = createAsyncThunk(
  'user/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await userAPI.getProfile();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch profile');
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  'user/updateProfile',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await userAPI.updateProfile(userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update profile');
    }
  }
);

export const changePassword = createAsyncThunk(
  'user/changePassword',
  async (passwordData, { rejectWithValue }) => {
    try {
      const response = await userAPI.changePassword(passwordData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to change password');
    }
  }
);

export const fetchUserAddresses = createAsyncThunk(
  'user/fetchAddresses',
  async (_, { rejectWithValue }) => {
    try {
      const response = await userAPI.getAddresses();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch addresses');
    }
  }
);

export const addUserAddress = createAsyncThunk(
  'user/addAddress',
  async (addressData, { rejectWithValue }) => {
    try {
      const response = await userAPI.addAddress(addressData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add address');
    }
  }
);

export const updateUserAddress = createAsyncThunk(
  'user/updateAddress',
  async ({ id, addressData }, { rejectWithValue }) => {
    try {
      const response = await userAPI.updateAddress(id, addressData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update address');
    }
  }
);

export const deleteUserAddress = createAsyncThunk(
  'user/deleteAddress',
  async (addressId, { rejectWithValue }) => {
    try {
      await userAPI.deleteAddress(addressId);
      return addressId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete address');
    }
  }
);

export const setDefaultAddress = createAsyncThunk(
  'user/setDefaultAddress',
  async (addressId, { rejectWithValue }) => {
    try {
      const response = await userAPI.setDefaultAddress(addressId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to set default address');
    }
  }
);

export const updateNotificationPreferences = createAsyncThunk(
  'user/updateNotificationPreferences',
  async (preferences, { rejectWithValue }) => {
    try {
      const response = await userAPI.updateNotificationPreferences(preferences);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update preferences');
    }
  }
);

export const deleteUserAccount = createAsyncThunk(
  'user/deleteAccount',
  async (password, { rejectWithValue }) => {
    try {
      await userAPI.deleteAccount(password);
      return true;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete account');
    }
  }
);

const initialState = {
  profile: null,
  addresses: [],
  notificationPreferences: {
    email: {
      orderUpdates: true,
      promotions: true,
      newsletters: false,
      recommendations: true
    },
    sms: {
      orderUpdates: true,
      promotions: false,
      newsletters: false
    },
    push: {
      orderUpdates: true,
      promotions: true,
      newsletters: false,
      recommendations: true
    }
  },
  isLoading: false,
  error: null,
  addressLoading: false,
  addressError: null,
  updateLoading: false
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
      state.addressError = null;
    },
    clearProfile: (state) => {
      state.profile = null;
      state.addresses = [];
      state.notificationPreferences = initialState.notificationPreferences;
    },
    updateProfileField: (state, action) => {
      if (state.profile) {
        state.profile = { ...state.profile, ...action.payload };
      }
    },
    updateNotificationPreferencesLocal: (state, action) => {
      state.notificationPreferences = { ...state.notificationPreferences, ...action.payload };
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch profile
      .addCase(fetchUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload.user;
        state.notificationPreferences = action.payload.user.notificationPreferences || state.notificationPreferences;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Update profile
      .addCase(updateUserProfile.pending, (state) => {
        state.updateLoading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.updateLoading = false;
        state.profile = { ...state.profile, ...action.payload.user };
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.updateLoading = false;
        state.error = action.payload;
      })
      
      // Change password
      .addCase(changePassword.pending, (state) => {
        state.updateLoading = true;
        state.error = null;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.updateLoading = false;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.updateLoading = false;
        state.error = action.payload;
      })
      
      // Fetch addresses
      .addCase(fetchUserAddresses.pending, (state) => {
        state.addressLoading = true;
        state.addressError = null;
      })
      .addCase(fetchUserAddresses.fulfilled, (state, action) => {
        state.addressLoading = false;
        state.addresses = action.payload.addresses;
      })
      .addCase(fetchUserAddresses.rejected, (state, action) => {
        state.addressLoading = false;
        state.addressError = action.payload;
      })
      
      // Add address
      .addCase(addUserAddress.pending, (state) => {
        state.addressLoading = true;
        state.addressError = null;
      })
      .addCase(addUserAddress.fulfilled, (state, action) => {
        state.addressLoading = false;
        state.addresses.push(action.payload.address);
      })
      .addCase(addUserAddress.rejected, (state, action) => {
        state.addressLoading = false;
        state.addressError = action.payload;
      })
      
      // Update address
      .addCase(updateUserAddress.pending, (state) => {
        state.addressLoading = true;
        state.addressError = null;
      })
      .addCase(updateUserAddress.fulfilled, (state, action) => {
        state.addressLoading = false;
        const index = state.addresses.findIndex(addr => addr.id === action.payload.address.id);
        if (index !== -1) {
          state.addresses[index] = action.payload.address;
        }
      })
      .addCase(updateUserAddress.rejected, (state, action) => {
        state.addressLoading = false;
        state.addressError = action.payload;
      })
      
      // Delete address
      .addCase(deleteUserAddress.pending, (state) => {
        state.addressLoading = true;
        state.addressError = null;
      })
      .addCase(deleteUserAddress.fulfilled, (state, action) => {
        state.addressLoading = false;
        state.addresses = state.addresses.filter(addr => addr.id !== action.payload);
      })
      .addCase(deleteUserAddress.rejected, (state, action) => {
        state.addressLoading = false;
        state.addressError = action.payload;
      })
      
      // Set default address
      .addCase(setDefaultAddress.fulfilled, (state, action) => {
        state.addresses = state.addresses.map(addr => ({
          ...addr,
          isDefault: addr.id === action.payload.address.id
        }));
      })
      
      // Update notification preferences
      .addCase(updateNotificationPreferences.pending, (state) => {
        state.updateLoading = true;
        state.error = null;
      })
      .addCase(updateNotificationPreferences.fulfilled, (state, action) => {
        state.updateLoading = false;
        state.notificationPreferences = action.payload.preferences;
      })
      .addCase(updateNotificationPreferences.rejected, (state, action) => {
        state.updateLoading = false;
        state.error = action.payload;
      })
      
      // Delete account
      .addCase(deleteUserAccount.pending, (state) => {
        state.updateLoading = true;
        state.error = null;
      })
      .addCase(deleteUserAccount.fulfilled, (state) => {
        state.updateLoading = false;
        // Account will be cleared by auth slice
      })
      .addCase(deleteUserAccount.rejected, (state, action) => {
        state.updateLoading = false;
        state.error = action.payload;
      });
  }
});

export const { 
  clearError, 
  clearProfile, 
  updateProfileField, 
  updateNotificationPreferencesLocal 
} = userSlice.actions;

// Selectors
export const selectUser = (state) => state.user.profile;
export const selectUserAddresses = (state) => state.user.addresses;
export const selectDefaultAddress = (state) => 
  state.user.addresses.find(addr => addr.isDefault);
export const selectNotificationPreferences = (state) => 
  state.user.notificationPreferences;
export const selectUserLoading = (state) => state.user.isLoading;
export const selectUserError = (state) => state.user.error;
export const selectAddressLoading = (state) => state.user.addressLoading;
export const selectAddressError = (state) => state.user.addressError;
export const selectUpdateLoading = (state) => state.user.updateLoading;

export default userSlice.reducer;