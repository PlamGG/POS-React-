import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase, isDemoUser } from '../services/supabase';

export const useTransactions = () => {
  return useQuery({
    queryKey: ['transactions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) {
        console.error('Error fetching transactions:', error);
        throw error;
      }
      return data;
    }
  });
};

export const useAddTransaction = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (transactionData) => {
      // Create a clean payload matching the DB schema
      const payload = {
        total: transactionData.totalAfterTax || transactionData.total || 0,
        payment_method: transactionData.method || 'cash',
        amount_paid: transactionData.amount || transactionData.cashAmount || transactionData.totalAfterTax || 0,
        change: transactionData.change || 0,
        items: transactionData.items || []
      };

      if (await isDemoUser()) {
        console.log('Demo mode: Fake saving transaction');
        const fakeTxn = { id: `demo-${Date.now()}`, created_at: new Date().toISOString(), ...payload, status: 'completed' };
        
        // Cache it locally so it shows up in the UI (Billing page) without saving to DB
        queryClient.setQueryData(['transactions'], (old) => {
          return [fakeTxn, ...(old || [])];
        });
        
        return fakeTxn;
      }

      const { data, error } = await supabase
        .from('transactions')
        .insert([payload])
        .select()
        .single();
        
      if (error) {
        console.error('Error saving transaction:', error);
        throw error;
      }

      // --- Deduct Stock from Ingredients via Recipes & Modifiers ---
      try {
        const productIds = payload.items.map(i => i.id);
        const [{ data: recipes }, { data: allIngredients }] = await Promise.all([
          supabase.from('recipes').select('product_id, ingredient_id, quantity_required').in('product_id', productIds),
          supabase.from('ingredients').select('id, name, stock_quantity')
        ]);

        const ingredientUsage = {};

        // Calculate Usage from Recipes & Modifiers
        payload.items.forEach(item => {
          // 1. Base Recipe Deduction
          if (recipes) {
            const itemRecipes = recipes.filter(r => r.product_id === item.id);
            itemRecipes.forEach(recipe => {
              ingredientUsage[recipe.ingredient_id] = (ingredientUsage[recipe.ingredient_id] || 0) + (recipe.quantity_required * item.quantity);
            });
          }

          // 2. Modifier Deduction
          if (item.selectedModifiers && Array.isArray(item.selectedModifiers)) {
            item.selectedModifiers.forEach(mod => {
              if (mod.deduct_ingredient_id && mod.deduct_quantity && allIngredients) {
                const targetIng = allIngredients.find(ing => ing.id === mod.deduct_ingredient_id);
                if (targetIng) {
                  ingredientUsage[targetIng.id] = (ingredientUsage[targetIng.id] || 0) + (mod.deduct_quantity * item.quantity);
                }
              }
            });
          }
        });

        // Update stock sequentially
        const ingredientIds = Object.keys(ingredientUsage);
        if (ingredientIds.length > 0 && allIngredients) {
          for (const ingId of ingredientIds) {
            const ing = allIngredients.find(i => i.id === ingId);
            if (ing) {
              const used = ingredientUsage[ingId];
              const newStock = Math.max(0, Number(ing.stock_quantity) - used);
              await supabase
                .from('ingredients')
                .update({ stock_quantity: newStock })
                .eq('id', ing.id);
            }
          }
        }
      } catch (stockError) {
        console.error('Failed to deduct stock:', stockError);
      }

      return data;
    },
    onSuccess: () => {
      // Invalidate both transactions and ingredients
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['ingredients'] });
    }
  });
};

export const useVoidTransaction = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (transactionId) => {
      if (await isDemoUser()) {
        console.log('Demo mode: Fake voiding transaction', transactionId);
        // Cache it locally so it shows as voided in the UI
        queryClient.setQueryData(['transactions'], (old) => {
          if (!old) return old;
          return old.map(txn => txn.id === transactionId ? { ...txn, status: 'voided' } : txn);
        });
        return { success: true };
      }

      // 1. Get the transaction details to refund stock
      const { data: transaction, error: fetchError } = await supabase
        .from('transactions')
        .select('*')
        .eq('id', transactionId)
        .single();
      
      if (fetchError) throw fetchError;
      if (transaction.status === 'voided') throw new Error('Transaction already voided');

      // 2. Mark as voided
      const { error: updateError } = await supabase
        .from('transactions')
        .update({ status: 'voided' })
        .eq('id', transactionId);
        
      if (updateError) throw updateError;

      // 3. Refund Stock
      try {
        const productIds = txn.items.map(i => i.id);
        const { data: recipes } = await supabase
          .from('recipes')
          .select('product_id, ingredient_id, quantity_required')
          .in('product_id', productIds);

        if (recipes && recipes.length > 0) {
          const ingredientRefund = {};
          txn.items.forEach(item => {
            // Refund Base Recipe
            const itemRecipes = recipes.filter(r => r.product_id === item.id);
            itemRecipes.forEach(recipe => {
              if (!ingredientRefund[recipe.ingredient_id]) {
                ingredientRefund[recipe.ingredient_id] = 0;
              }
              ingredientRefund[recipe.ingredient_id] += (recipe.quantity_required * item.quantity);
            });
            
            // Refund Modifiers
            if (item.selectedModifiers && Array.isArray(item.selectedModifiers)) {
              item.selectedModifiers.forEach(mod => {
                if (mod.deduct_ingredient_id && mod.deduct_quantity) {
                  if (!ingredientRefund[mod.deduct_ingredient_id]) {
                    ingredientRefund[mod.deduct_ingredient_id] = 0;
                  }
                  ingredientRefund[mod.deduct_ingredient_id] += (mod.deduct_quantity * item.quantity);
                }
              });
            }
          });

          const ingredientIds = Object.keys(ingredientRefund);
          if (ingredientIds.length > 0) {
            const { data: currentIngredients } = await supabase
              .from('ingredients')
              .select('id, stock_quantity')
              .in('id', ingredientIds);

            if (currentIngredients) {
              for (const ing of currentIngredients) {
                const refund = ingredientRefund[ing.id];
                const newStock = Number(ing.stock_quantity) + refund;
                await supabase
                  .from('ingredients')
                  .update({ stock_quantity: newStock })
                  .eq('id', ing.id);
              }
            }
          }
        }
      } catch (stockError) {
        console.error('Failed to refund stock:', stockError);
      }

      return txn;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['ingredients'] });
    }
  });
};
