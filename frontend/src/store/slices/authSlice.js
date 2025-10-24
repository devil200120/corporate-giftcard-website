import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authAPI from '../../services/authAPI';

// Initial state
// Get stored tokens from localStorage
const storedToken = localStorage.getItem('token');
const storedRefreshToken = localStorage.getItem('refreshToken');

const initialState = {
  user: null,
  token: storedToken || null,
  refreshToken: storedRefreshToken || null,
  isAuthenticated: !!storedToken,
  isLoading: false,
  error: null,
  passwordResetLoading: false,
  emailVerificationLoading: false,
};

// Async thunks
export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await authAPI.register(userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Registration failed'
      );
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authAPI.login(credentials);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Login failed'
      );
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await authAPI.logout();
      return {};
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Logout failed'
      );
    }
  }
);

export const getCurrentUser = createAsyncThunk(
  'auth/getCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authAPI.getCurrentUser();
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to get user data'
      );
    }
  }
);

export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      const response = await authAPI.updateProfile(profileData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Profile update failed'
      );
    }
  }
);

export const changePassword = createAsyncThunk(
  'auth/changePassword',
  async (passwordData, { rejectWithValue }) => {
    try {
      const response = await authAPI.changePassword(passwordData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Password change failed'
      );
    }
  }
);

export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async (email, { rejectWithValue }) => {
    try {
      const response = await authAPI.forgotPassword(email);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to send reset email'
      );
    }
  }
);

export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async (resetData, { rejectWithValue }) => {
    try {
      const response = await authAPI.resetPassword(resetData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Password reset failed'
      );
    }
  }
);

export const verifyEmail = createAsyncThunk(
  'auth/verifyEmail',
  async (tokenData, { rejectWithValue }) => {
    try {
      const token = typeof tokenData === 'string' ? tokenData : tokenData.token;
      const response = await authAPI.verifyEmail(token);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Email verification failed'
      );
    }
  }
);

export const resendVerificationEmail = createAsyncThunk(
  'auth/resendVerificationEmail',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authAPI.resendVerificationEmail();
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to resend verification email'
      );
    }
  }
);

export const refreshToken = createAsyncThunk(
  'auth/refreshToken',
  async (refreshToken, { rejectWithValue }) => {
    try {
      const response = await authAPI.refreshToken(refreshToken);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Token refresh failed'
      );
    }
  }
);

export const registerCorporateUser = createAsyncThunk(
  'auth/registerCorporate',
  async (corporateData, { rejectWithValue }) => {
    try {
      const response = await authAPI.registerCorporate(corporateData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Corporate registration failed'
      );
    }
  }
);

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearAuthState: (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;
      
      // Clear tokens from localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('refreshToken');
    },
    setCredentials: (state, action) => {
      const { user, token, refreshToken } = action.payload;
      state.user = user;
      state.token = token;
      state.refreshToken = refreshToken;
      state.isAuthenticated = true;
      state.error = null;
      
      // Store tokens in localStorage
      if (token) localStorage.setItem('token', token);
      if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
    },
    updateUser: (state, action) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Register User
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.data.user;
        state.token = action.payload.data.token;
        state.refreshToken = action.payload.data.refreshToken;
        state.isAuthenticated = true;
        state.error = null;
        
        // Store tokens in localStorage for persistence
        localStorage.setItem('token', action.payload.data.token);
        localStorage.setItem('refreshToken', action.payload.data.refreshToken);
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Login User
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.data.user;
        state.token = action.payload.data.token;
        state.refreshToken = action.payload.data.refreshToken;
        state.isAuthenticated = true;
        state.error = null;
        
        // Store tokens in localStorage for persistence
        localStorage.setItem('token', action.payload.data.token);
        localStorage.setItem('refreshToken', action.payload.data.refreshToken);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Logout User
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
        state.isLoading = false;
        state.error = null;
        
        // Remove tokens from localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('refreshToken');
      })
      .addCase(logoutUser.rejected, (state, action) => {
        // Even if logout fails on server, clear local state
        state.user = null;
        state.token = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
        state.isLoading = false;
        state.error = action.payload;
      })

      // Get Current User
      .addCase(getCurrentUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.data.user;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.token = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
        state.error = action.payload;
      })

      // Update Profile
      .addCase(updateProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = { ...state.user, ...action.payload.data.user };
        state.error = null;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Change Password
      .addCase(changePassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Forgot Password
      .addCase(forgotPassword.pending, (state) => {
        state.passwordResetLoading = true;
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.passwordResetLoading = false;
        state.error = null;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.passwordResetLoading = false;
        state.error = action.payload;
      })

      // Reset Password
      .addCase(resetPassword.pending, (state) => {
        state.passwordResetLoading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.passwordResetLoading = false;
        state.error = null;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.passwordResetLoading = false;
        state.error = action.payload;
      })

      // Verify Email
      .addCase(verifyEmail.pending, (state) => {
        state.emailVerificationLoading = true;
        state.error = null;
      })
      .addCase(verifyEmail.fulfilled, (state) => {
        state.emailVerificationLoading = false;
        if (state.user) {
          state.user.isEmailVerified = true;
        }
        state.error = null;
      })
      .addCase(verifyEmail.rejected, (state, action) => {
        state.emailVerificationLoading = false;
        state.error = action.payload;
      })

      // Resend Verification Email
      .addCase(resendVerificationEmail.pending, (state) => {
        state.emailVerificationLoading = true;
        state.error = null;
      })
      .addCase(resendVerificationEmail.fulfilled, (state) => {
        state.emailVerificationLoading = false;
        state.error = null;
      })
      .addCase(resendVerificationEmail.rejected, (state, action) => {
        state.emailVerificationLoading = false;
        state.error = action.payload;
      })

      // Refresh Token
      .addCase(refreshToken.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.isLoading = false;
        state.token = action.payload.data.token;
        state.refreshToken = action.payload.data.refreshToken;
        state.error = null;
        
        // Store new tokens in localStorage
        localStorage.setItem('token', action.payload.data.token);
        localStorage.setItem('refreshToken', action.payload.data.refreshToken);
      })
      .addCase(refreshToken.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.token = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
        state.error = action.payload;
        
        // Clear tokens from localStorage when refresh fails
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('refreshToken');
      })

      // Register Corporate User
      .addCase(registerCorporateUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerCorporateUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.data.user;
        state.token = action.payload.data.token;
        state.refreshToken = action.payload.data.refreshToken;
        state.isAuthenticated = true;
        state.error = null;
        
        // Store tokens in localStorage for persistence
        localStorage.setItem('token', action.payload.data.token);
        localStorage.setItem('refreshToken', action.payload.data.refreshToken);
      })
      .addCase(registerCorporateUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

// Export actions
export const { clearError, clearAuthState, setCredentials, updateUser } = authSlice.actions;

// Export aliases for components expecting different names
export const login = loginUser;
export const register = registerUser;
export const logout = logoutUser;
export const registerCorporate = registerCorporateUser;

// Selectors
export const selectAuth = (state) => state.auth;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectUser = (state) => state.auth.user;
export const selectToken = (state) => state.auth.token;
export const selectAuthLoading = (state) => state.auth.isLoading;
export const selectAuthError = (state) => state.auth.error;
export const selectIsCorporateUser = (state) => 
  state.auth.user?.role === 'corporate_admin' && 
  state.auth.user?.corporateDetails?.isApproved;

// Export reducer
export default authSlice.reducer;