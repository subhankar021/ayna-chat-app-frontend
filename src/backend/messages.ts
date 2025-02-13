import { supabase } from './supabase';
import { Message } from './types';

export const messages = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) throw error;

    return data?.map(msg => ({
      id: msg.id,
      text: msg.text,
      sender: msg.is_from_server ? 'server' : 'user',
      timestamp: new Date(msg.created_at),
    })) as Message[];
  },

  send: async (text: string, userId: string) => {
    // Send both messages in a single request
    const { error } = await supabase
      .from('messages')
      .insert([
        {
          text,
          user_id: userId,
          is_from_server: false,
        },
        {
          text,
          user_id: userId,
          is_from_server: true,
        }
      ]);

    if (error) throw error;
  }
};