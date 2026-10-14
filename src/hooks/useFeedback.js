import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase, isDemoUser } from '../services/supabase';

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
      if (await isDemoUser()) {
        console.log('Demo mode: Fake adding feedback');
        const fakeFb = {
          id: `demo-${Date.now()}`,
          ...feedback,
          created_at: new Date().toISOString()
        };
        queryClient.setQueryData(['feedback'], (old) => [fakeFb, ...(old || [])]);
        return fakeFb;
      }

      const { data, error } = await supabase
        .from('feedback')
        .insert([feedback])
        .select()
        .single();
        
      if (error) throw error;
      return data;
    },
    onSuccess: async () => {
      if (await isDemoUser()) return;
      queryClient.invalidateQueries({ queryKey: ['feedback'] });
    }
  });
};
