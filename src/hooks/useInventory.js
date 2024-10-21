import { useState, useCallback } from 'react';

const initialInventory = [
  { id: 1, name: 'ขนมปังเบอร์เกอร์', quantity: 100, unit: 'pieces', lowStockThreshold: 20 },
  { id: 2, name: 'เฟรนช์ฟรายส์', quantity: 500, unit: 'kg', lowStockThreshold: 100 },
  { id: 3, name: 'ไก่ทอดไทยสไปซี่', quantity: 300, unit: 'pieces', lowStockThreshold: 50 },
  { id: 4, name: 'ไก่ทอดนักเก็ต', quantity: 200, unit: 'pieces', lowStockThreshold: 50 },
  { id: 5, name: 'มะละกอ', quantity: 50, unit: 'pieces', lowStockThreshold: 15 },
  { id: 6, name: 'ข้าวเหนียวมะม่วง', quantity: 40, unit: 'containers', lowStockThreshold: 10 },
  { id: 7, name: 'ซอสมะเขือเทศ', quantity: 20, unit: 'bottles', lowStockThreshold: 5 },
  { id: 8, name: 'เฉาก๊วย', quantity: 15, unit: 'bottles', lowStockThreshold: 3 },
];


export const useInventory = () => {
  const [inventory, setInventory] = useState(initialInventory);

  const addItem = useCallback((newItem) => {
    setInventory(prev => [...prev, { ...newItem, id: Date.now() }]);
  }, []);

  const updateItem = useCallback((id, updates) => {
    setInventory(prev => prev.map(item =>
      item.id === id ? { ...item, ...updates } : item
    ));
  }, []);

  const deleteItem = useCallback((id) => {
    setInventory(prev => prev.filter(item => item.id !== id));
  }, []);

  const updateItemQuantity = useCallback((id, change) => {
    setInventory(prev => prev.map(item => {
      if (item.id === id) {
        const newQuantity = Math.max(0, item.quantity + change);
        return { ...item, quantity: newQuantity };
      }
      return item;
    }));
  }, []);

  const checkLowStock = useCallback(() => {
    return inventory.filter(item => item.quantity <= item.lowStockThreshold);
  }, [inventory]);

  const checkMediumStock = useCallback(() => {
    return inventory.filter(item => 
      item.quantity > item.lowStockThreshold && 
      item.quantity <= item.lowStockThreshold * 1.5
    );
  }, [inventory]);

  const getStockStatus = useCallback((id) => {
    const item = inventory.find(item => item.id === id);
    if (!item) return null;

    if (item.quantity <= item.lowStockThreshold) {
      return 'low';
    } else if (item.quantity <= item.lowStockThreshold * 1.5) {
      return 'medium';
    }
    return 'good';
  }, [inventory]);

  return {
    inventory,
    addItem,
    updateItem,
    deleteItem,
    updateItemQuantity,
    checkLowStock,
    checkMediumStock,
    getStockStatus,
  };
};