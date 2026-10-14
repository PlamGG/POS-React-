import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase, isDemoUser } from '../services/supabase';
export const useProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data: products, error } = await supabase
        .from('products')
        .select('*');
      if (error) {
        console.error('Error fetching products:', error);
        throw error;
      }
      
      const { data: groups, error: groupsError } = await supabase.from('modifier_groups').select('*');
      const { data: options, error: optionsError } = await supabase.from('modifier_options').select('*');
      
      const categoryModifiers = {};
      
      if (!groupsError && !optionsError && groups && options) {
        groups.forEach(group => {
          if (!categoryModifiers[group.category]) {
            categoryModifiers[group.category] = [];
          }
          categoryModifiers[group.category].push({
            ...group,
            groupName: group.name,
            options: options.filter(opt => opt.group_id === group.id).map(opt => ({
              ...opt,
              price: Number(opt.price)
            }))
          });
        });
      }
      
      // Attach modifiers based on category
      const productsWithModifiers = products.map(product => ({
        ...product,
        modifierGroups: categoryModifiers[product.category] || []
      }));
      
      return productsWithModifiers;
    }
  });
};

export const useAddProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (product) => {
      if (await isDemoUser()) {
        console.log('Demo mode: Fake adding product');
        const fakeProduct = { id: `demo-${Date.now()}`, ...product, modifierGroups: [] };
        queryClient.setQueryData(['products'], (old) => [...(old || []), fakeProduct]);
        return fakeProduct;
      }

      const { data, error } = await supabase
        .from('products')
        .insert([product])
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: async () => {
      if (await isDemoUser()) return;
      queryClient.invalidateQueries({ queryKey: ['products'] });
    }
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }) => {
      if (await isDemoUser()) {
        console.log('Demo mode: Fake updating product');
        queryClient.setQueryData(['products'], (old) => {
          if (!old) return old;
          return old.map(p => p.id === id ? { ...p, ...updates } : p);
        });
        return { id, ...updates };
      }

      const { data, error } = await supabase
        .from('products')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: async () => {
      if (await isDemoUser()) return;
      queryClient.invalidateQueries({ queryKey: ['products'] });
    }
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      if (await isDemoUser()) {
        console.log('Demo mode: Fake deleting product');
        queryClient.setQueryData(['products'], (old) => {
          if (!old) return old;
          return old.filter(p => p.id !== id);
        });
        return { success: true };
      }

      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: async () => {
      if (await isDemoUser()) return;
      queryClient.invalidateQueries({ queryKey: ['products'] });
    }
  });
};
