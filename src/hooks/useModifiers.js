import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase, isDemoUser } from '../services/supabase';

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
      if (await isDemoUser()) {
        console.log('Demo mode: Fake adding modifier group');
        const fakeGroup = {
          id: `demo-${Date.now()}`,
          ...group,
          groupName: group.name,
          options: [],
          created_at: new Date().toISOString()
        };
        queryClient.setQueryData(['modifiers'], (old) => [...(old || []), fakeGroup]);
        return fakeGroup;
      }

      const { data, error } = await supabase.from('modifier_groups').insert([group]).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: async () => {
      if (await isDemoUser()) return;
      queryClient.invalidateQueries({ queryKey: ['modifiers'] });
    }
  });
};

export const useUpdateModifierGroup = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }) => {
      if (await isDemoUser()) {
        console.log('Demo mode: Fake updating modifier group');
        queryClient.setQueryData(['modifiers'], (old) => {
          if (!old) return old;
          return old.map(g => g.id === id ? { ...g, ...updates, groupName: updates.name || g.name } : g);
        });
        return { id, ...updates };
      }

      const { data, error } = await supabase.from('modifier_groups').update(updates).eq('id', id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: async () => {
      if (await isDemoUser()) return;
      queryClient.invalidateQueries({ queryKey: ['modifiers'] });
    }
  });
};

export const useDeleteModifierGroup = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      if (await isDemoUser()) {
        console.log('Demo mode: Fake deleting modifier group');
        queryClient.setQueryData(['modifiers'], (old) => {
          if (!old) return old;
          return old.filter(g => g.id !== id);
        });
        return { success: true };
      }

      const { error } = await supabase.from('modifier_groups').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: async () => {
      if (await isDemoUser()) return;
      queryClient.invalidateQueries({ queryKey: ['modifiers'] });
    }
  });
};

export const useAddModifierOption = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (option) => {
      if (await isDemoUser()) {
        console.log('Demo mode: Fake adding modifier option');
        const fakeOpt = {
          id: `demo-opt-${Date.now()}`,
          ...option,
          created_at: new Date().toISOString()
        };
        queryClient.setQueryData(['modifiers'], (old) => {
          if (!old) return old;
          return old.map(g => g.id === option.group_id ? { ...g, options: [...(g.options || []), fakeOpt] } : g);
        });
        return fakeOpt;
      }

      const { data, error } = await supabase.from('modifier_options').insert([option]).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: async () => {
      if (await isDemoUser()) return;
      queryClient.invalidateQueries({ queryKey: ['modifiers'] });
    }
  });
};

export const useUpdateModifierOption = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }) => {
      if (await isDemoUser()) {
        console.log('Demo mode: Fake updating modifier option');
        queryClient.setQueryData(['modifiers'], (old) => {
          if (!old) return old;
          return old.map(g => ({
            ...g,
            options: (g.options || []).map(opt => opt.id === id ? { ...opt, ...updates } : opt)
          }));
        });
        return { id, ...updates };
      }

      const { data, error } = await supabase.from('modifier_options').update(updates).eq('id', id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: async () => {
      if (await isDemoUser()) return;
      queryClient.invalidateQueries({ queryKey: ['modifiers'] });
    }
  });
};

export const useDeleteModifierOption = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      if (await isDemoUser()) {
        console.log('Demo mode: Fake deleting modifier option');
        queryClient.setQueryData(['modifiers'], (old) => {
          if (!old) return old;
          return old.map(g => ({
            ...g,
            options: (g.options || []).filter(opt => opt.id !== id)
          }));
        });
        return { success: true };
      }

      const { error } = await supabase.from('modifier_options').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: async () => {
      if (await isDemoUser()) return;
      queryClient.invalidateQueries({ queryKey: ['modifiers'] });
    }
  });
};
