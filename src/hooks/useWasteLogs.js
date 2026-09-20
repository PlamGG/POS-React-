import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase, isDemoUser } from '../services/supabase';

export const useWasteLogs = () => {
  return useQuery({
    queryKey: ['waste_logs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('waste_logs')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) {
        console.error('Error fetching waste logs:', error);
        throw error;
      }
      return data;
    }
  });
};

export const useAddWasteLog = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (log) => {
      if (await isDemoUser()) {
        console.log('Demo mode: Fake adding waste log');
        const fakeLog = { id: `demo-${Date.now()}`, created_at: new Date().toISOString(), ...log };
        queryClient.setQueryData(['waste_logs'], (old) => {
          return [fakeLog, ...(old || [])];
        });
        return fakeLog;
      }

      const { data, error } = await supabase
        .from('waste_logs')
        .insert([log])
        .select()
        .single();
        
      if (error) {
        console.error('Error adding waste log:', error);
        throw error;
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['waste_logs'] });
    }
  });
};
