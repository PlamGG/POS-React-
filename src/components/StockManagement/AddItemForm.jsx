import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Trash2 } from "lucide-react";

const IngredientsManager = () => {

  const [newIngredient, setNewIngredient] = useState({
    name: '',
    quantity: '',
    unit: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newIngredient.name && newIngredient.quantity && newIngredient.unit) {
      // สร้าง ID ใหม่โดยใช้เวลาปัจจุบัน
      const newId = Date.now();
      
      // เพิ่มข้อมูลใหม่เข้าไปใน array
      setIngredients([
        ...ingredients,
        {
          id: newId,
          ...newIngredient,
          quantity: parseFloat(newIngredient.quantity)
        }
      ]);

      // รีเซ็ตฟอร์ม
      setNewIngredient({ name: '', quantity: '', unit: '' });
    }
  };

  const handleDelete = (id) => {
    setIngredients(ingredients.filter(item => item.id !== id));
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Recipe Ingredients</CardTitle>
        <CardDescription>Manage your recipe ingredients</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* ฟอร์มเพิ่มข้อมูล */}
        <form onSubmit={handleSubmit} className="flex items-end space-x-4">
          <div className="flex-1">
            <Input
              placeholder="Ingredient Name"
              value={newIngredient.name}
              onChange={(e) => setNewIngredient({...newIngredient, name: e.target.value})}
              className="mb-0"
            />
          </div>

          <div className="w-28">
            <Input
              type="number"
              step="0.1"
              min="0"
              placeholder="Amount"
              value={newIngredient.quantity}
              onChange={(e) => setNewIngredient({...newIngredient, quantity: e.target.value})}
              className="mb-0"
            />
          </div>

          <div className="w-36">
            <Select 
              value={newIngredient.unit}
              onValueChange={(value) => setNewIngredient({...newIngredient, unit: value})}
            >
              <SelectTrigger className="mb-0">
                <SelectValue placeholder="Unit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="g">Grams (g)</SelectItem>
                <SelectItem value="kg">Kilograms (kg)</SelectItem>
                <SelectItem value="ml">Milliliters (ml)</SelectItem>
                <SelectItem value="l">Liters (l)</SelectItem>
                <SelectItem value="tsp">Teaspoon (tsp)</SelectItem>
                <SelectItem value="tbsp">Tablespoon (tbsp)</SelectItem>
                <SelectItem value="cup">Cup</SelectItem>
                <SelectItem value="piece">Piece</SelectItem>
              </SelectContent>
            </Select>
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

export default IngredientsManager;