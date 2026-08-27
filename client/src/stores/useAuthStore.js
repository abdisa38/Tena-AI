import { create } from 'zustand';
import { authAPI } from '@services/api';

const useAuthStore = create((set, get) => ({
  user: null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: false,
  loading: false,
  error: null,

  // Set token
  setToken: (token) => {
    localStorage.setItem('token', token);
    set({ token, isAuthenticated: true });
  },

  // Set user
  setUser: (user) => {
    set({ user, isAuthenticated: true });
  },

  // Fetch current user
  fetchUser: async () => {
    set({ loading: true, error: null });
    try {
      const response = await authAPI.getMe();
      set({ 
        user: response.data.user, 
        isAuthenticated: true, 
        loading: false 
      });
      return response.data.user;
    } catch (error) {
      set({ error: error.message, loading: false, isAuthenticated: false });
      throw error;
    }
  },

  // Update user profile
  updateUser: async (data) => {
    set({ loading: true, error: null });
    try {
      const response = await authAPI.updateProfile(data);
      set({ user: response.data.user, loading: false });
      return response.data.user;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  // Sync user with Clerk
  syncUser: async (clerkData) => {
    set({ loading: true, error: null });
    try {
      const response = await authAPI.register({
        clerkId: clerkData.id,
        email: clerkData.emailAddresses[0].emailAddress,
        firstName: clerkData.firstName,
        lastName: clerkData.lastName,
        profileImage: clerkData.imageUrl,
      });
      
      set({ 
        user: response.data.user, 
        token: response.data.token,
        isAuthenticated: true, 
        loading: false 
      });
      
      localStorage.setItem('token', response.data.token);
      return response.data.user;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  // Logout
  logout: () => {
    localStorage.removeItem('token');
    set({ 
      user: null, 
      token: null, 
      isAuthenticated: false,
      error: null 
    });
  },

  // Clear error
  clearError: () => {
    set({ error: null });
  },
}));

export default useAuthStore;
