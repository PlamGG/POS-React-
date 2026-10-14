import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase, isDemoUser } from '../services/supabase';

export const useExpenses = () => {
  return useQuery({
    queryKey: ['expenses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .order('expense_date', { ascending: false });
        
      if (error) {
        console.error('Error fetching expenses:', error);
        throw error;
      }
      return data;
    }
  });
};

export const useAddExpense = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (expense) => {
      if (await isDemoUser()) {
        console.log('Demo mode: Fake adding expense');
        const fakeExp = {
          id: `demo-${Date.now()}`,
          ...expense,
          amount: Number(expense.amount),
          created_at: new Date().toISOString()
        };
        queryClient.setQueryData(['expenses'], (old) => [fakeExp, ...(old || [])]);
        return fakeExp;
      }

      const { data, error } = await supabase
        .from('expenses')
        .insert([{
          ...expense,
          amount: Number(expense.amount)
        }])
        .select()
        .single();
        
      if (error) throw error;
      return data;
    },
    onSuccess: async () => {
      if (await isDemoUser()) return;
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
    }
  });
};
