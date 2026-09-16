import { create } from 'zustand';
import { internshipAPI, applicationAPI } from './api';

export const useInternshipStore = create((set) => ({
  internships: [],
  selectedInternship: null,
  loading: false,
  error: null,

  fetchInternships: async (search, location, workMode) => {
    set({ loading: true, error: null });
    try {
      const response = await internshipAPI.getAll(search, location, workMode);
      set({ internships: response.data.internships, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  getInternshipById: async (id) => {
    set({ loading: true });
    try {
      const response = await internshipAPI.getById(id);
      set({ selectedInternship: response.data.internship, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  createInternship: async (data) => {
    try {
      const response = await internshipAPI.create(data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
}));

export const useApplicationStore = create((set) => ({
  applications: [],
  loading: false,
  error: null,

  fetchApplications: async (role) => {
    set({ loading: true, error: null });
    try {
      const response = await applicationAPI.getAll(role);
      set({ applications: response.data.applications, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  submitApplication: async (internshipId, coverLetter) => {
    try {
      const response = await applicationAPI.submit(internshipId, coverLetter);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  acceptApplication: async (applicationId) => {
    try {
      const response = await applicationAPI.accept(applicationId);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  rejectApplication: async (applicationId, reason) => {
    try {
      const response = await applicationAPI.reject(applicationId, reason);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  verifyAcceptance: async (verificationCode) => {
    try {
      const response = await applicationAPI.verify(verificationCode);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  confirmAcceptance: async (acceptanceId) => {
    try {
      const response = await applicationAPI.confirm(acceptanceId);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
}));
