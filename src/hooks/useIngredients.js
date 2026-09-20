import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase, isDemoUser } from '../services/supabase';

export const useIngredients = () => {
  return useQuery({
    queryKey: ['ingredients'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ingredients')
        .select('*')
        .order('name');
        
      if (error) {
        console.error('Error fetching ingredients:', error);
        throw error;
      }
      return data;
    }
  });
};

export const useAddIngredient = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (ingredient) => {
      if (await isDemoUser()) {
        console.log('Demo mode: Fake adding ingredient');
        const fakeIng = { id: `demo-${Date.now()}`, ...ingredient };
        queryClient.setQueryData(['ingredients'], (old) => {
          return [...(old || []), fakeIng].sort((a, b) => a.name.localeCompare(b.name));
        });
        return fakeIng;
      }

      const { data, error } = await supabase
        .from('ingredients')
        .insert([ingredient])
        .select()
        .single();
        
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ingredients'] });
    }
  });
};

export const useUpdateIngredientStock = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, quantityChange }) => {
      if (await isDemoUser()) {
        console.log('Demo mode: Fake updating stock');
        // Optimistically update cache
        queryClient.setQueryData(['ingredients'], (old) => {
          if (!old) return old;
          return old.map(ing => ing.id === id ? { ...ing, stock_quantity: Math.max(0, Number(ing.stock_quantity) + Number(quantityChange)) } : ing);
        });
        return { success: true };
      }

      // First get current stock (in a real production app you'd use a Postgres RPC to avoid race conditions)
      const { data: current, error: fetchError } = await supabase
        .from('ingredients')
        .select('stock_quantity')
        .eq('id', id)
        .single();
        
      if (fetchError) throw fetchError;

      const newStock = Number(current.stock_quantity) + Number(quantityChange);

      const { data, error } = await supabase
        .from('ingredients')
        .update({ stock_quantity: Math.max(0, newStock) })
        .eq('id', id)
        .select()
        .single();
        
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ingredients'] });
    }
  });
};
