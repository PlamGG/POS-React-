import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../services/supabase';

export const useFeedback = () => {
  return useQuery({
    queryKey: ['feedback'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('feedback')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) {
        console.error('Error fetching feedback:', error);
        throw error;
      }
      return data;
    }
  });
};

export const useAddFeedback = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (feedback) => {
      const { data, error } = await supabase
        .from('feedback')
        .insert([feedback])
        .select()
        .single();
        
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feedback'] });
    }
  });
};
