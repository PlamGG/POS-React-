import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase, isDemoUser } from '../services/supabase';

export const useStoreSettings = () => {
  return useQuery({
    queryKey: ['store_settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('store_settings')
        .select('*')
        .limit(1)
        .single();
      if (error && error.code !== 'PGRST116') throw error; // Ignore not found
      return data;
    }
  });
};

export const useUpdateStoreSettings = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (settings) => {
      if (await isDemoUser()) {
        console.log('Demo mode: Fake updating store settings');
        queryClient.setQueryData(['store_settings'], (old) => ({ ...(old || {}), ...settings }));
        return settings;
      }

      // Assuming only 1 row exists
      let { data: existing } = await supabase.from('store_settings').select('id').limit(1).single();
      
      let query;
      if (existing) {
        query = supabase.from('store_settings').update(settings).eq('id', existing.id);
      } else {
        query = supabase.from('store_settings').insert([settings]);
      }
      
      const { data, error } = await query.select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: async () => {
      if (await isDemoUser()) return;
      queryClient.invalidateQueries({ queryKey: ['store_settings'] });
    }
  });
};
