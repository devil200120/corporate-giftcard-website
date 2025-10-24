import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import corporateAPI from '../../services/corporateAPI';

// Initial state
const initialState = {
  corporateProfile: null,
  corporateOrders: [],
  bulkOrders: [],
  employeeList: [],
  giftingCampaigns: [],
  budgetAllocations: [],
  approvalRequests: [],
  corporateStats: {
    totalOrders: 0,
    totalSpent: 0,
    activeEmployees: 0,
    pendingApprovals: 0,
  },
  isLoading: false,
  profileLoading: false,
  ordersLoading: false,
  employeesLoading: false,
  campaignsLoading: false,
  error: null,
};

// Async thunks
export const fetchCorporateProfile = createAsyncThunk(
  'corporate/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await corporateAPI.getProfile();
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch corporate profile'
      );
    }
  }
);

export const updateCorporateProfile = createAsyncThunk(
  'corporate/updateProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      const response = await corporateAPI.updateProfile(profileData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update corporate profile'
      );
    }
  }
);

export const fetchCorporateOrders = createAsyncThunk(
  'corporate/fetchOrders',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await corporateAPI.getOrders(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch corporate orders'
      );
    }
  }
);

export const createBulkOrder = createAsyncThunk(
  'corporate/createBulkOrder',
  async (bulkOrderData, { rejectWithValue }) => {
    try {
      const response = await corporateAPI.createBulkOrder(bulkOrderData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to create bulk order'
      );
    }
  }
);

export const fetchEmployeeList = createAsyncThunk(
  'corporate/fetchEmployeeList',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await corporateAPI.getEmployeeList(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch employee list'
      );
    }
  }
);

export const addEmployee = createAsyncThunk(
  'corporate/addEmployee',
  async (employeeData, { rejectWithValue }) => {
    try {
      const response = await corporateAPI.addEmployee(employeeData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to add employee'
      );
    }
  }
);

export const updateEmployee = createAsyncThunk(
  'corporate/updateEmployee',
  async ({ employeeId, employeeData }, { rejectWithValue }) => {
    try {
      const response = await corporateAPI.updateEmployee(employeeId, employeeData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update employee'
      );
    }
  }
);

export const removeEmployee = createAsyncThunk(
  'corporate/removeEmployee',
  async (employeeId, { rejectWithValue }) => {
    try {
      const response = await corporateAPI.removeEmployee(employeeId);
      return { employeeId, ...response.data };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to remove employee'
      );
    }
  }
);

export const fetchGiftingCampaigns = createAsyncThunk(
  'corporate/fetchCampaigns',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await corporateAPI.getGiftingCampaigns(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch gifting campaigns'
      );
    }
  }
);

export const createGiftingCampaign = createAsyncThunk(
  'corporate/createCampaign',
  async (campaignData, { rejectWithValue }) => {
    try {
      const response = await corporateAPI.createGiftingCampaign(campaignData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to create gifting campaign'
      );
    }
  }
);

export const updateGiftingCampaign = createAsyncThunk(
  'corporate/updateCampaign',
  async ({ campaignId, campaignData }, { rejectWithValue }) => {
    try {
      const response = await corporateAPI.updateGiftingCampaign(campaignId, campaignData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update gifting campaign'
      );
    }
  }
);

export const fetchBudgetAllocations = createAsyncThunk(
  'corporate/fetchBudgetAllocations',
  async (_, { rejectWithValue }) => {
    try {
      const response = await corporateAPI.getBudgetAllocations();
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch budget allocations'
      );
    }
  }
);

export const updateBudgetAllocation = createAsyncThunk(
  'corporate/updateBudgetAllocation',
  async ({ allocationId, allocationData }, { rejectWithValue }) => {
    try {
      const response = await corporateAPI.updateBudgetAllocation(allocationId, allocationData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update budget allocation'
      );
    }
  }
);

export const fetchApprovalRequests = createAsyncThunk(
  'corporate/fetchApprovalRequests',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await corporateAPI.getApprovalRequests(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch approval requests'
      );
    }
  }
);

export const processApprovalRequest = createAsyncThunk(
  'corporate/processApprovalRequest',
  async ({ requestId, action, comments }, { rejectWithValue }) => {
    try {
      const response = await corporateAPI.processApprovalRequest(requestId, { action, comments });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to process approval request'
      );
    }
  }
);

export const fetchCorporateStats = createAsyncThunk(
  'corporate/fetchStats',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await corporateAPI.getCorporateStats(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch corporate stats'
      );
    }
  }
);

// Corporate slice
const corporateSlice = createSlice({
  name: 'corporate',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCorporateData: (state) => {
      return { ...initialState };
    },
    updateEmployeeInList: (state, action) => {
      const { employeeId, updates } = action.payload;
      const employeeIndex = state.employeeList.findIndex(emp => emp._id === employeeId);
      if (employeeIndex !== -1) {
        state.employeeList[employeeIndex] = { ...state.employeeList[employeeIndex], ...updates };
      }
    },
    updateCampaignInList: (state, action) => {
      const { campaignId, updates } = action.payload;
      const campaignIndex = state.giftingCampaigns.findIndex(campaign => campaign._id === campaignId);
      if (campaignIndex !== -1) {
        state.giftingCampaigns[campaignIndex] = { ...state.giftingCampaigns[campaignIndex], ...updates };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Corporate Profile
      .addCase(fetchCorporateProfile.pending, (state) => {
        state.profileLoading = true;
        state.error = null;
      })
      .addCase(fetchCorporateProfile.fulfilled, (state, action) => {
        state.profileLoading = false;
        state.corporateProfile = action.payload.data.profile;
        state.error = null;
      })
      .addCase(fetchCorporateProfile.rejected, (state, action) => {
        state.profileLoading = false;
        state.error = action.payload;
      })

      // Update Corporate Profile
      .addCase(updateCorporateProfile.pending, (state) => {
        state.profileLoading = true;
        state.error = null;
      })
      .addCase(updateCorporateProfile.fulfilled, (state, action) => {
        state.profileLoading = false;
        state.corporateProfile = action.payload.data.profile;
        state.error = null;
      })
      .addCase(updateCorporateProfile.rejected, (state, action) => {
        state.profileLoading = false;
        state.error = action.payload;
      })

      // Fetch Corporate Orders
      .addCase(fetchCorporateOrders.pending, (state) => {
        state.ordersLoading = true;
        state.error = null;
      })
      .addCase(fetchCorporateOrders.fulfilled, (state, action) => {
        state.ordersLoading = false;
        state.corporateOrders = action.payload.data.orders;
        state.error = null;
      })
      .addCase(fetchCorporateOrders.rejected, (state, action) => {
        state.ordersLoading = false;
        state.error = action.payload;
      })

      // Create Bulk Order
      .addCase(createBulkOrder.fulfilled, (state, action) => {
        state.bulkOrders.unshift(action.payload.data.bulkOrder);
        state.corporateOrders.unshift(action.payload.data.bulkOrder);
      })

      // Fetch Employee List
      .addCase(fetchEmployeeList.pending, (state) => {
        state.employeesLoading = true;
        state.error = null;
      })
      .addCase(fetchEmployeeList.fulfilled, (state, action) => {
        state.employeesLoading = false;
        state.employeeList = action.payload.data.employees;
        state.error = null;
      })
      .addCase(fetchEmployeeList.rejected, (state, action) => {
        state.employeesLoading = false;
        state.error = action.payload;
      })

      // Add Employee
      .addCase(addEmployee.fulfilled, (state, action) => {
        state.employeeList.push(action.payload.data.employee);
      })

      // Update Employee
      .addCase(updateEmployee.fulfilled, (state, action) => {
        const updatedEmployee = action.payload.data.employee;
        const employeeIndex = state.employeeList.findIndex(emp => emp._id === updatedEmployee._id);
        if (employeeIndex !== -1) {
          state.employeeList[employeeIndex] = updatedEmployee;
        }
      })

      // Remove Employee
      .addCase(removeEmployee.fulfilled, (state, action) => {
        const { employeeId } = action.payload;
        state.employeeList = state.employeeList.filter(emp => emp._id !== employeeId);
      })

      // Fetch Gifting Campaigns
      .addCase(fetchGiftingCampaigns.pending, (state) => {
        state.campaignsLoading = true;
        state.error = null;
      })
      .addCase(fetchGiftingCampaigns.fulfilled, (state, action) => {
        state.campaignsLoading = false;
        state.giftingCampaigns = action.payload.data.campaigns;
        state.error = null;
      })
      .addCase(fetchGiftingCampaigns.rejected, (state, action) => {
        state.campaignsLoading = false;
        state.error = action.payload;
      })

      // Create Gifting Campaign
      .addCase(createGiftingCampaign.fulfilled, (state, action) => {
        state.giftingCampaigns.unshift(action.payload.data.campaign);
      })

      // Update Gifting Campaign
      .addCase(updateGiftingCampaign.fulfilled, (state, action) => {
        const updatedCampaign = action.payload.data.campaign;
        const campaignIndex = state.giftingCampaigns.findIndex(campaign => campaign._id === updatedCampaign._id);
        if (campaignIndex !== -1) {
          state.giftingCampaigns[campaignIndex] = updatedCampaign;
        }
      })

      // Fetch Budget Allocations
      .addCase(fetchBudgetAllocations.fulfilled, (state, action) => {
        state.budgetAllocations = action.payload.data.allocations;
      })

      // Update Budget Allocation
      .addCase(updateBudgetAllocation.fulfilled, (state, action) => {
        const updatedAllocation = action.payload.data.allocation;
        const allocationIndex = state.budgetAllocations.findIndex(alloc => alloc._id === updatedAllocation._id);
        if (allocationIndex !== -1) {
          state.budgetAllocations[allocationIndex] = updatedAllocation;
        }
      })

      // Fetch Approval Requests
      .addCase(fetchApprovalRequests.fulfilled, (state, action) => {
        state.approvalRequests = action.payload.data.requests;
      })

      // Process Approval Request
      .addCase(processApprovalRequest.fulfilled, (state, action) => {
        const updatedRequest = action.payload.data.request;
        const requestIndex = state.approvalRequests.findIndex(req => req._id === updatedRequest._id);
        if (requestIndex !== -1) {
          state.approvalRequests[requestIndex] = updatedRequest;
        }
      })

      // Fetch Corporate Stats
      .addCase(fetchCorporateStats.fulfilled, (state, action) => {
        state.corporateStats = action.payload.data.stats;
      });
  },
});

// Export actions
export const {
  clearError,
  clearCorporateData,
  updateEmployeeInList,
  updateCampaignInList,
} = corporateSlice.actions;

// Selectors
export const selectCorporateProfile = (state) => state.corporate.corporateProfile;
export const selectCorporateOrders = (state) => state.corporate.corporateOrders;
export const selectBulkOrders = (state) => state.corporate.bulkOrders;
export const selectEmployeeList = (state) => state.corporate.employeeList;
export const selectGiftingCampaigns = (state) => state.corporate.giftingCampaigns;
export const selectBudgetAllocations = (state) => state.corporate.budgetAllocations;
export const selectApprovalRequests = (state) => state.corporate.approvalRequests;
export const selectCorporateStats = (state) => state.corporate.corporateStats;
export const selectCorporateLoading = (state) => state.corporate.isLoading;
export const selectProfileLoading = (state) => state.corporate.profileLoading;
export const selectOrdersLoading = (state) => state.corporate.ordersLoading;
export const selectEmployeesLoading = (state) => state.corporate.employeesLoading;
export const selectCampaignsLoading = (state) => state.corporate.campaignsLoading;
export const selectCorporateError = (state) => state.corporate.error;

// Export aliases for components expecting different names
export const fetchTeamMembers = fetchEmployeeList;
export const inviteTeamMember = addEmployee;
export const updateTeamMember = updateEmployee;
export const removeTeamMember = removeEmployee;
export const getCorporateAnalytics = fetchCorporateStats;

// Export reducer
export default corporateSlice.reducer;