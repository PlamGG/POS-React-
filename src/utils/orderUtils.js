import { menuItems } from '../data/menuItems';

export const calculateOrderTotal = (order) => {
  if (!order || !order.items) return { subtotal: 0, tax: 0, totalAfterTax: 0 };

  const subtotal = order.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  const tax = subtotal * 0.00; // % tax
  const totalAfterTax = subtotal + tax;

  return {
    ...order,
    subtotal: Math.round(subtotal * 100) / 100,
    tax: Math.round(tax * 100) / 100,
    totalAfterTax: Math.round(totalAfterTax * 100) / 100,
  };
};

export const applyPromotion = (order, promotionCode) => {

  //  add  promotion code here
  if (promotionCode) {
    const discountAmount = order.subtotal * 0.1;
    return {
      ...order,
      discountAmount: Math.round(discountAmount * 100) / 100,
      totalAfterTax: Math.round((order.totalAfterTax - discountAmount) * 100) / 100,
    };
  }
  return order;
};

export const updateInventory = (inventory, itemId, change) => {
  return inventory.map(item => 
    item.id === itemId 
      ? { ...item, stock: item.stock + change } 
      : item
  );
};

export const filterMenuItems = (inventory, selectedCategory, searchTerm) => {
  return inventory.filter(item => 
    (selectedCategory === 'All' || item.category === selectedCategory) &&
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
};