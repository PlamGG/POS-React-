import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase, isDemoUser } from '../services/supabase';

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
      if (await isDemoUser()) {
        console.log('Demo mode: Fake adding recipe');
        const products = queryClient.getQueryData(['products']) || [];
        const ingredients = queryClient.getQueryData(['ingredients']) || [];
        const prod = products.find(p => p.id === recipe.product_id);
        const ing = ingredients.find(i => i.id === recipe.ingredient_id);
        
        const fakeRecipe = {
          id: `demo-${Date.now()}`,
          quantity_required: recipe.quantity_required,
          products: prod ? { id: prod.id, name: prod.name, price: prod.price } : null,
          ingredients: ing ? { id: ing.id, name: ing.name, cost_per_unit: ing.cost_per_unit, unit: ing.unit, stock_quantity: ing.stock_quantity } : null
        };
        queryClient.setQueryData(['recipes'], (old) => [...(old || []), fakeRecipe]);
        return fakeRecipe;
      }

      const { data, error } = await supabase
        .from('recipes')
        .insert([recipe])
        .select()
        .single();
        
      if (error) throw error;
      return data;
    },
    onSuccess: async () => {
      if (await isDemoUser()) return;
      queryClient.invalidateQueries({ queryKey: ['recipes'] });
    }
  });
};

export const useDeleteRecipe = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      if (await isDemoUser()) {
        console.log('Demo mode: Fake deleting recipe');
        queryClient.setQueryData(['recipes'], (old) => {
          if (!old) return old;
          return old.filter(r => r.id !== id);
        });
        return { success: true };
      }

      const { error } = await supabase
        .from('recipes')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
    },
    onSuccess: async () => {
      if (await isDemoUser()) return;
      queryClient.invalidateQueries({ queryKey: ['recipes'] });
    }
  });
};
