import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from 'lucide-react';
import InventoryTable from '../components/StockManagement/InventoryTable';
import ConfirmationDialog from '../components/ConfirmationDialog';
import { useIngredients, useAddIngredient, useUpdateIngredientStock } from '../hooks/useIngredients';
import AddItemForm from '../components/StockManagement/AddItemForm';
import { useAddWasteLog } from '../hooks/useWasteLogs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

const StockManagement = () => {
  const { data: inventory = [], isLoading } = useIngredients();
  const { mutate: addIngredient } = useAddIngredient();
  const { mutate: updateStock } = useUpdateIngredientStock();
  const { mutate: addWasteLog } = useAddWasteLog();

  const [searchTerm, setSearchTerm] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [quantityChange, setQuantityChange] = useState(0);

  // Waste Log State
  const [isWasteDialogOpen, setIsWasteDialogOpen] = useState(false);
  const [wasteItem, setWasteItem] = useState('');
  const [wasteQuantity, setWasteQuantity] = useState(0);
  const [wasteReason, setWasteReason] = useState('');
  
  // Stock Take State
  const [isStockTakeOpen, setIsStockTakeOpen] = useState(false);
  const [stockTakeValues, setStockTakeValues] = useState({});

  const lowStockAlert = React.useMemo(() => {
    return inventory.filter(item => Number(item.stock_quantity) <= Number(item.low_stock_threshold));
  }, [inventory]);

  const handleEditStock = (item, action) => {
    if (action === 'increase') {
      updateStock({ id: item.id, quantityChange: 1 });
      return;
    }
    if (action === 'decrease') {
      updateStock({ id: item.id, quantityChange: -1 });
      return;
    }
    setEditingItem(item);
    setQuantityChange(0);
    setIsConfirmDialogOpen(true);
  };

  const handleConfirmEdit = () => {
    if (editingItem && quantityChange !== 0) {
      updateStock({ id: editingItem.id, quantityChange: parseInt(quantityChange) });
    }
    setIsConfirmDialogOpen(false);
    setEditingItem(null);
    setQuantityChange(0);
  };

  const handleAddItem = (newItem) => {
    addIngredient({
      name: newItem.name,
      unit: newItem.unit || 'units',
      cost_per_unit: newItem.cost || 0,
      stock_quantity: newItem.quantity || 0,
      low_stock_threshold: newItem.lowStockThreshold || 10
    });
  };

  const handleRecordWaste = () => {
    if (!wasteItem || wasteQuantity <= 0 || !wasteReason) return;
    
    const item = inventory.find(i => i.id === wasteItem);
    if (item) {
      updateStock({ id: item.id, quantityChange: -Math.abs(wasteQuantity) });
      addWasteLog({
        ingredient_name: item.name,
        quantity: Math.abs(wasteQuantity),
        unit: item.unit,
        reason: wasteReason
      });
      setIsWasteDialogOpen(false);
      setWasteItem('');
      setWasteQuantity(0);
      setWasteReason('');
    }
  };

  const handleConfirmStockTake = () => {
    Object.keys(stockTakeValues).forEach(id => {
      const actualQuantity = parseInt(stockTakeValues[id]);
      const currentItem = inventory.find(i => i.id === id);
      if (currentItem && !isNaN(actualQuantity)) {
        const diff = actualQuantity - currentItem.stock_quantity;
        if (diff !== 0) {
          updateStock({ id: currentItem.id, quantityChange: diff });
          addWasteLog({
            ingredient_name: currentItem.name,
            quantity: Math.abs(diff),
            unit: currentItem.unit,
            reason: diff < 0 ? 'Stock Take (Loss)' : 'Stock Take (Gain)'
          });
        }
      }
    });
    setIsStockTakeOpen(false);
    setStockTakeValues({});
  };

  const filteredInventory = inventory.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) return <div className="flex justify-center items-center h-full">Loading...</div>;

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-bold text-gray-800">Stock Management</h1>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" className="text-orange-600 border-orange-200 hover:bg-orange-50 h-9 text-sm md:h-10 md:text-base" onClick={() => setIsWasteDialogOpen(true)}>
            Record Waste
          </Button>
          <Button variant="outline" className="text-blue-600 border-blue-200 hover:bg-blue-50 h-9 text-sm md:h-10 md:text-base" onClick={() => setIsStockTakeOpen(true)}>
            Stock Take
          </Button>
        </div>
      </div>
      
      <LowStockAlert lowStockAlert={lowStockAlert} />
      
      <AddItemForm addItem={handleAddItem} />

      <Card className="border-none shadow-sm">
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

      {/* Waste Log Dialog */}
      <Dialog open={isWasteDialogOpen} onOpenChange={setIsWasteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Record Waste / Loss</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Select Ingredient</Label>
              <Select value={wasteItem} onValueChange={setWasteItem}>
                <SelectTrigger>
                  <SelectValue placeholder="Select an ingredient" />
                </SelectTrigger>
                <SelectContent>
                  {inventory.map(item => (
                    <SelectItem key={item.id} value={item.id}>{item.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Quantity Lost</Label>
              <Input 
                type="number" 
                min="0" 
                value={wasteQuantity} 
                onChange={(e) => setWasteQuantity(e.target.value)} 
                placeholder="0"
              />
            </div>
            <div className="space-y-2">
              <Label>Reason</Label>
              <Input 
                value={wasteReason} 
                onChange={(e) => setWasteReason(e.target.value)} 
                placeholder="e.g. Expired, Spilled, Damaged"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsWasteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleRecordWaste}>Record Waste</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Stock Take Dialog */}
      <Dialog open={isStockTakeOpen} onOpenChange={setIsStockTakeOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Stock Take (Reconciliation)</DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto py-4 space-y-3 pr-2">
            <p className="text-sm text-gray-500 mb-4">Enter the actual physical count for ingredients. Leave blank if unchanged.</p>
            {inventory.map(item => (
              <div key={item.id} className="flex items-center justify-between gap-4 bg-gray-50 p-3 rounded-lg">
                <div className="flex-1">
                  <p className="font-medium">{item.name}</p>
                  <p className="text-xs text-gray-500">System: {item.stock_quantity} {item.unit}</p>
                </div>
                <div className="flex items-center gap-2 w-1/3">
                  <Input 
                    type="number" 
                    placeholder="Actual Qty"
                    value={stockTakeValues[item.id] || ''}
                    onChange={(e) => setStockTakeValues(prev => ({...prev, [item.id]: e.target.value}))}
                  />
                  <span className="text-sm text-gray-500">{item.unit}</span>
                </div>
              </div>
            ))}
          </div>
          <DialogFooter className="pt-4 border-t">
            <Button variant="outline" onClick={() => setIsStockTakeOpen(false)}>Cancel</Button>
            <Button onClick={handleConfirmStockTake}>Confirm Stock Take</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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