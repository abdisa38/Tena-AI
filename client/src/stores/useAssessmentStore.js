import { create } from 'zustand';
import { assessmentAPI } from '@services/api';

const useAssessmentStore = create((set, get) => ({
  assessments: [],
  currentAssessment: null,
  stats: null,
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  },

  // Fetch all assessments
  fetchAssessments: async (params = {}) => {
    set({ loading: true, error: null });
    try {
      const response = await assessmentAPI.getAll(params);
      set({ 
        assessments: response.data.assessments,
        pagination: response.pagination,
        loading: false 
      });
      return response.data.assessments;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  // Fetch single assessment
  fetchAssessment: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await assessmentAPI.getById(id);
      set({ 
        currentAssessment: response.data.assessment,
        loading: false 
      });
      return response.data.assessment;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  // Create assessment
  createAssessment: async (data) => {
    set({ loading: true, error: null });
    try {
      const response = await assessmentAPI.create(data);
      const newAssessment = response.data.assessment;
      
      set((state) => ({
        assessments: [newAssessment, ...state.assessments],
        currentAssessment: newAssessment,
        loading: false,
      }));
      
      return newAssessment;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  // Update assessment
  updateAssessment: async (id, data) => {
    set({ loading: true, error: null });
    try {
      const response = await assessmentAPI.update(id, data);
      const updatedAssessment = response.data.assessment;
      
      set((state) => ({
        assessments: state.assessments.map((a) =>
          a._id === id ? updatedAssessment : a
        ),
        currentAssessment: state.currentAssessment?._id === id 
          ? updatedAssessment 
          : state.currentAssessment,
        loading: false,
      }));
      
      return updatedAssessment;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  // Delete assessment
  deleteAssessment: async (id) => {
    set({ loading: true, error: null });
    try {
      await assessmentAPI.delete(id);
      
      set((state) => ({
        assessments: state.assessments.filter((a) => a._id !== id),
        currentAssessment: state.currentAssessment?._id === id 
          ? null 
          : state.currentAssessment,
        loading: false,
      }));
      
      return true;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  // Fetch statistics
  fetchStats: async () => {
    set({ loading: true, error: null });
    try {
      const response = await assessmentAPI.getStats();
      set({ 
        stats: response.data.stats,
        loading: false 
      });
      return response.data.stats;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  // Clear current assessment
  clearCurrentAssessment: () => {
    set({ currentAssessment: null });
  },

  // Clear error
  clearError: () => {
    set({ error: null });
  },
}));

export default useAssessmentStore;
