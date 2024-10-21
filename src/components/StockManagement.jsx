import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from 'lucide-react';
import InventoryTable from './StockManagement/InventoryTable';
import ConfirmationDialog from './ConfirmationDialog';
import { useInventory } from '../hooks/useInventory';
import AddItemForm from './StockManagement/AddItemForm';

const StockManagement = () => {
  const { inventory, addItem, updateItemQuantity, checkLowStock } = useInventory();
  const [searchTerm, setSearchTerm] = useState('');
  const [lowStockAlert, setLowStockAlert] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [quantityChange, setQuantityChange] = useState(0);

  useEffect(() => {
    setLowStockAlert(checkLowStock(inventory));
  }, [inventory, checkLowStock]);

  const handleEditStock = (item) => {
    setEditingItem(item);
    setQuantityChange(0);
    setIsConfirmDialogOpen(true);
  };

  const handleConfirmEdit = () => {
    if (editingItem && quantityChange !== 0) {
      updateItemQuantity(editingItem.id, parseInt(quantityChange));
    }
    setIsConfirmDialogOpen(false);
    setEditingItem(null);
    setQuantityChange(0);
  };

  const filteredInventory = inventory.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Stock Management</h1>
      
      <LowStockAlert lowStockAlert={lowStockAlert} />
      
      <AddItemForm addItem={addItem} />

      <Card>
        <CardHeader>
          <CardTitle>Inventory</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="Search inventory..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-4"
          />
          <InventoryTable inventory={filteredInventory} onEdit={handleEditStock} />
        </CardContent>
      </Card>

      <ConfirmationDialog
        isOpen={isConfirmDialogOpen}
        onClose={() => setIsConfirmDialogOpen(false)}
        onConfirm={handleConfirmEdit}
        title="Edit Stock Quantity"
        description={`Are you sure you want to ${quantityChange >= 0 ? 'add' : 'remove'} ${Math.abs(quantityChange)} ${editingItem?.unit || 'units'} ${quantityChange >= 0 ? 'to' : 'from'} ${editingItem?.name}?`}
      >
        <Input
          type="number"
          value={quantityChange}
          onChange={(e) => setQuantityChange(e.target.value)}
          placeholder="Enter quantity change"
          className="mt-2"
        />
      </ConfirmationDialog>
    </div>
  );
};

const LowStockAlert = ({ lowStockAlert }) => {
  if (lowStockAlert.length === 0) return null;
  
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Low Stock Alert</AlertTitle>
      <AlertDescription>
        The following items are low on stock: {lowStockAlert.map(item => item.name).join(', ')}
      </AlertDescription>
    </Alert>
  );
};

export default StockManagement;