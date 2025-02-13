import { supabase } from './supabase';
import { AuthFormData } from './types';

export const auth = {
  signIn: async (formData: AuthFormData) => {
    return await supabase.auth.signInWithPassword(formData);
  },

  signUp: async (formData: AuthFormData) => {
    return await supabase.auth.signUp(formData);
  },

  signOut: async () => {
    return await supabase.auth.signOut();
  },

  getUser: () => {
    return supabase.auth.getUser();
  },

  onAuthStateChange: (callback: (event: string, session: any) => void) => {
    return supabase.auth.onAuthStateChange(callback);
  }
};