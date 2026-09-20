import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const calculateOrderTotals = (items) => {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.07; // Assuming 7% tax
  return { subtotal, tax, totalAfterTax: subtotal + tax };
};

export const useCartStore = create(
  persist(
    (set, get) => ({
      order: { items: [], subtotal: 0, tax: 0, totalAfterTax: 0, discountAmount: 0 },
      
      addItem: (item, selectedModifiers = [], itemNote = '') => set((state) => {
        // Calculate additional price from modifiers
        const modifierPrice = selectedModifiers.reduce((sum, mod) => sum + (mod.price || 0), 0);
        const finalPrice = item.price + modifierPrice;
        
        // Create unique ID based on product ID, its modifiers, and note
        const cartItemId = `${item.id}-${JSON.stringify(selectedModifiers)}-${itemNote}`;
        
        const existingItem = state.order.items.find(i => i.cartItemId === cartItemId);
        
        let updatedItems;
        if (existingItem) {
          updatedItems = state.order.items.map(i => 
            i.cartItemId === cartItemId ? { ...i, quantity: i.quantity + 1 } : i
          );
        } else {
          updatedItems = [...state.order.items, { 
            ...item, 
            cartItemId,
            price: finalPrice, 
            originalPrice: item.price,
            selectedModifiers,
            itemNote,
            quantity: 1 
          }];
        }
        
        return { 
          order: { 
            items: updatedItems, 
            ...calculateOrderTotals(updatedItems) 
          } 
        };
      }),

      removeItem: (cartItemId) => set((state) => {
        const updatedItems = state.order.items.reduce((acc, item) => {
          if (item.cartItemId === cartItemId) {
            if (item.quantity > 1) {
              acc.push({ ...item, quantity: item.quantity - 1 });
            }
          } else {
            acc.push(item);
          }
          return acc;
        }, []);
        
        return { 
          order: { 
            items: updatedItems, 
            ...calculateOrderTotals(updatedItems) 
          } 
        };
      }),

      deleteItem: (cartItemId) => set((state) => {
        const updatedItems = state.order.items.filter(item => item.cartItemId !== cartItemId);
        return { 
          order: { 
            items: updatedItems, 
            ...calculateOrderTotals(updatedItems) 
          } 
        };
      }),

      clearCart: () => set({ order: { items: [], subtotal: 0, tax: 0, totalAfterTax: 0, discountAmount: 0 } }),
      
      applyDiscount: (discountCode, availablePromotions = []) => set((state) => {
        const promo = availablePromotions.find(p => p.code === discountCode && p.is_active !== false);
        if (!promo) return state; // Invalid code

        const subtotal = state.order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        if (subtotal < promo.min_purchase) {
          alert(`Minimum purchase of ฿${promo.min_purchase} required for this code.`);
          return state;
        }

        let discountAmount = 0;
        let items = [...state.order.items];

        if (promo.type === 'percentage') {
          discountAmount = subtotal * (promo.value / 100);
        } else if (promo.type === 'fixed') {
          discountAmount = promo.value;
        } else if (promo.type === 'bogo') {
          // BOGO: Find the cheapest eligible item (quantity >= 2 or two separate items of same category?)
          // For simplicity, just find the cheapest item in the cart and make it free
          const sortedItems = [...items].sort((a, b) => a.price - b.price);
          if (sortedItems.length > 0 && state.order.items.reduce((sum, i) => sum + i.quantity, 0) >= 2) {
            discountAmount = sortedItems[0].price;
          } else {
            alert('Buy 1 Get 1 requires at least 2 items in cart.');
            return state;
          }
        }

        discountAmount = Math.min(discountAmount, subtotal); // Cannot discount more than subtotal
        const newSubtotal = subtotal - discountAmount;
        const tax = newSubtotal * 0.07;
        const discountedTotal = newSubtotal + tax;

        return {
          order: {
            ...state.order,
            discountAmount,
            discountCode,
            totalAfterTax: discountedTotal
          }
        };
      })
    }),
    {
      name: 'pos-cart-storage', // saves to localStorage automatically
    }
  )
);
