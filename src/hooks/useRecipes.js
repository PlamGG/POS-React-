import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../services/supabase';

export const useRecipes = () => {
  return useQuery({
    queryKey: ['recipes'],
    queryFn: async () => {
      // Fetch recipes and join with products and ingredients
      const { data, error } = await supabase
        .from('recipes')
        .select(`
          id,
          quantity_required,
          products ( id, name, price ),
          ingredients ( id, name, cost_per_unit, unit, stock_quantity )
        `);
        
      if (error) {
        console.error('Error fetching recipes:', error);
        throw error;
      }
      return data;
    }
  });
};

export const useAddRecipe = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (recipe) => {
      const { data, error } = await supabase
        .from('recipes')
        .insert([recipe])
        .select()
        .single();
        
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recipes'] });
    }
  });
};

export const useDeleteRecipe = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase
        .from('recipes')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recipes'] });
    }
  });
};
