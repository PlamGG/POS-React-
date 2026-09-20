import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";

const AddItemForm = ({ addItem }) => {
  const [newIngredient, setNewIngredient] = useState({
    name: '',
    quantity: '',
    unit: '',
    cost: '',
    lowStockThreshold: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newIngredient.name && newIngredient.unit) {
      addItem({
        name: newIngredient.name,
        quantity: parseFloat(newIngredient.quantity) || 0,
        unit: newIngredient.unit,
        cost: parseFloat(newIngredient.cost) || 0,
        lowStockThreshold: parseFloat(newIngredient.lowStockThreshold) || 10
      });

      // รีเซ็ตฟอร์ม
      setNewIngredient({ name: '', quantity: '', unit: '', cost: '', lowStockThreshold: '' });
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Add New Ingredient</CardTitle>
        <CardDescription>Register a new ingredient to your inventory</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-4">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium mb-1">Name</label>
            <Input
              placeholder="e.g. Bread Buns"
              value={newIngredient.name}
              onChange={(e) => setNewIngredient({...newIngredient, name: e.target.value})}
              required
            />
          </div>

          <div className="w-32">
            <label className="block text-sm font-medium mb-1">Init Stock</label>
            <Input
              type="number"
              min="0"
              placeholder="Amount"
              value={newIngredient.quantity}
              onChange={(e) => setNewIngredient({...newIngredient, quantity: e.target.value})}
            />
          </div>

          <div className="w-36">
            <label className="block text-sm font-medium mb-1">Unit</label>
            <Select 
              value={newIngredient.unit}
              onValueChange={(value) => setNewIngredient({...newIngredient, unit: value})}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Unit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="g">Grams (g)</SelectItem>
                <SelectItem value="kg">Kilograms (kg)</SelectItem>
                <SelectItem value="ml">Milliliters (ml)</SelectItem>
                <SelectItem value="l">Liters (l)</SelectItem>
                <SelectItem value="piece">Piece</SelectItem>
                <SelectItem value="pack">Pack</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="w-32">
            <label className="block text-sm font-medium mb-1">Cost / Unit</label>
            <Input
              type="number"
              min="0"
              placeholder="฿"
              value={newIngredient.cost}
              onChange={(e) => setNewIngredient({...newIngredient, cost: e.target.value})}
            />
          </div>

          <div className="w-32">
            <label className="block text-sm font-medium mb-1">Min Alert</label>
            <Input
              type="number"
              min="0"
              placeholder="Threshold"
              value={newIngredient.lowStockThreshold}
              onChange={(e) => setNewIngredient({...newIngredient, lowStockThreshold: e.target.value})}
            />
          </div>

          <Button type="submit" className="flex items-center">
            <Plus className="w-4 h-4 mr-2" />
            Add
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddItemForm;