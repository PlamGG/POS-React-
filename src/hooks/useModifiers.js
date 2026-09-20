import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../services/supabase';

// Fetch all groups and their options
export const useModifiers = () => {
  return useQuery({
    queryKey: ['modifiers'],
    queryFn: async () => {
      const { data: groups, error: groupsError } = await supabase
        .from('modifier_groups')
        .select('*')
        .order('created_at', { ascending: true });
        
      if (groupsError) throw groupsError;

      const { data: options, error: optionsError } = await supabase
        .from('modifier_options')
        .select('*')
        .order('created_at', { ascending: true });
        
      if (optionsError) throw optionsError;

      // Group options into their respective groups
      return groups.map(group => ({
        ...group,
        groupName: group.name, // Map for compatibility with old UI
        options: options.filter(opt => opt.group_id === group.id).map(opt => ({
          ...opt,
          price: Number(opt.price)
        }))
      }));
    }
  });
};

export const useAddModifierGroup = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (group) => {
      const { data, error } = await supabase.from('modifier_groups').insert([group]).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['modifiers'] })
  });
};

export const useUpdateModifierGroup = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }) => {
      const { data, error } = await supabase.from('modifier_groups').update(updates).eq('id', id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['modifiers'] })
  });
};

export const useDeleteModifierGroup = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase.from('modifier_groups').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['modifiers'] })
  });
};

export const useAddModifierOption = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (option) => {
      const { data, error } = await supabase.from('modifier_options').insert([option]).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['modifiers'] })
  });
};

export const useUpdateModifierOption = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }) => {
      const { data, error } = await supabase.from('modifier_options').update(updates).eq('id', id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['modifiers'] })
  });
};

export const useDeleteModifierOption = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase.from('modifier_options').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['modifiers'] })
  });
};
