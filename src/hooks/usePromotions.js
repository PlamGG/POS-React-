import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase, isDemoUser } from '../services/supabase';

export const usePromotions = () => {
  return useQuery({
    queryKey: ['promotions'],
    queryFn: async () => {
      const { data, error } = await supabase.from('promotions').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    }
  });
};

export const useAddPromotion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (promo) => {
      if (await isDemoUser()) {
        console.log('Demo mode: Fake adding promotion');
        const fakePromo = { id: `demo-${Date.now()}`, ...promo, created_at: new Date().toISOString() };
        queryClient.setQueryData(['promotions'], (old) => [fakePromo, ...(old || [])]);
        return fakePromo;
      }

      const { data, error } = await supabase.from('promotions').insert([promo]).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: async () => {
      if (await isDemoUser()) return;
      queryClient.invalidateQueries({ queryKey: ['promotions'] });
    }
  });
};

export const useUpdatePromotion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }) => {
      if (await isDemoUser()) {
        console.log('Demo mode: Fake updating promotion');
        queryClient.setQueryData(['promotions'], (old) => {
          if (!old) return old;
          return old.map(p => p.id === id ? { ...p, ...updates } : p);
        });
        return { id, ...updates };
      }

      const { data, error } = await supabase.from('promotions').update(updates).eq('id', id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: async () => {
      if (await isDemoUser()) return;
      queryClient.invalidateQueries({ queryKey: ['promotions'] });
    }
  });
};

export const useDeletePromotion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      if (await isDemoUser()) {
        console.log('Demo mode: Fake deleting promotion');
        queryClient.setQueryData(['promotions'], (old) => {
          if (!old) return old;
          return old.filter(p => p.id !== id);
        });
        return { success: true };
      }

      const { error } = await supabase.from('promotions').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: async () => {
      if (await isDemoUser()) return;
      queryClient.invalidateQueries({ queryKey: ['promotions'] });
    }
  });
};
