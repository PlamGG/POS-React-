import React, { useState } from 'react';
import { useInventory } from '../hooks/useInventory';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileEdit, AlertTriangle } from "lucide-react";

const initialMenus = [
  {
    id: 1,
    name: 'เบอร์เกอร์ไก่กรอบ',
    category: 'Main Course',
    ingredients: [
      { ingredientId: 1, amount: 2 }, // 2 pieces of burger
      { ingredientId: 7, amount: 1 }, // 1 bottle ketchup per 20 burgers
    ],
    profitMargin: 40,
  },
  {
    id: 2,
    name: 'ไก่ทอดไทยสไปซี่',
    category: 'Main Course',
    ingredients: [
      { ingredientId: 3, amount: 3 }, // 3 pieces of fried chicken
    ],
    profitMargin: 45,
  },
  {
    id: 3,
    name: 'เฟรนช์ฟรายส์',
    category: 'Snacks',
    ingredients: [
      { ingredientId: 2, amount: 0.2 }, // 0.2kg of fries per serving
    ],
    profitMargin: 50,
  },
  {
    id: 4,
    name: 'ส้มตำไทย',
    category: 'Main Course',
    ingredients: [
      { ingredientId: 5, amount: 1 }, // 1 serving of papaya salad
    ],
    profitMargin: 55,
  },
  {
    id: 5,
    name: 'ข้าวเหนียวมะม่วง',
    category: 'Desserts',
    ingredients: [
      { ingredientId: 6, amount: 1 }, // 1 serving of mango sticky rice
    ],
    profitMargin: 60,
  },
  {
    id: 6,
    name: 'เฉาก๊วย',
    category: 'Drinks',
    ingredients: [
      { ingredientId: 8, amount: 1 }, // 1 serving of grass jelly
    ],
    profitMargin: 50,
  }
];


const FoodCostManagement = () => {
  const { inventory } = useInventory();
  const [menus, setMenus] = useState(initialMenus);
  const [editingMenu, setEditingMenu] = useState(null);
  const [profitMarginFilter, setProfitMarginFilter] = useState('all');

  // Helper function to get cost per unit
  const getIngredientUnitCost = (ingredient) => {
    const baseCosts = {
      'pieces': 5, // ฿5 per piece
      'kg': 100, // ฿100 per kg
      'bottles': 20, // ฿20 per bottle
      'containers': 30 // ฿30 per container
    };
    return baseCosts[ingredient.unit] || 0;
  };

  // Calculate menu costs using current inventory
  const calculateMenuCost = (menuIngredients) => {
    return menuIngredients.reduce((total, item) => {
      const ingredient = inventory.find(ing => ing.id === item.ingredientId);
      if (!ingredient) return total;
      const unitCost = getIngredientUnitCost(ingredient);
      return total + (unitCost * item.amount);
    }, 0);
  };

  const calculateSellingPrice = (cost, profitMargin) => {
    return cost * (1 + profitMargin / 100);
  };

  // Calculate food cost percentage
  const calculateFoodCostPercentage = (cost, sellingPrice) => {
    return (cost / sellingPrice) * 100;
  };

  // Filter menus by profit margin
  const getFilteredMenus = () => {
    if (profitMarginFilter === 'all') return menus;
    if (profitMarginFilter === 'high') return menus.filter(menu => menu.profitMargin > 45);
    if (profitMarginFilter === 'medium') return menus.filter(menu => menu.profitMargin >= 35 && menu.profitMargin <= 45);
    return menus.filter(menu => menu.profitMargin < 35);
  };

  // Update profit margin
  const handleUpdateProfitMargin = (menuId, newMargin) => {
    setMenus(prev => prev.map(menu => 
      menu.id === menuId ? { ...menu, profitMargin: parseFloat(newMargin) } : menu
    ));
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Menu Pricing Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>FoodCost  Management</CardTitle>
          <CardDescription>Analyze costs and set optimal prices for menu items</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Select 
              value={profitMarginFilter} 
              onValueChange={setProfitMarginFilter}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by profit margin" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Items</SelectItem>
                <SelectItem value="high">High Margin (&gt;45%)</SelectItem>
                <SelectItem value="medium">Medium Margin (35-45%)</SelectItem>
                <SelectItem value="low">Low Margin (&lt;35%)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Menu Item</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Cost (฿)</TableHead>
                <TableHead className="text-right">Profit Margin (%)</TableHead>
                <TableHead className="text-right">Selling Price (฿)</TableHead>
                <TableHead className="text-right">Food Cost %</TableHead>
                <TableHead className="w-16"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {getFilteredMenus().map((menu) => {
                const cost = calculateMenuCost(menu.ingredients);
                const sellingPrice = calculateSellingPrice(cost, menu.profitMargin);
                const foodCostPercentage = calculateFoodCostPercentage(cost, sellingPrice);
                
                return (
                  <TableRow key={menu.id}>
                    <TableCell>{menu.name}</TableCell>
                    <TableCell>{menu.category}</TableCell>
                    <TableCell className="text-right">{cost.toFixed(2)}</TableCell>
                    <TableCell className="text-right">
                      {editingMenu === menu.id ? (
                        <Input
                          type="number"
                          value={menu.profitMargin}
                          onChange={(e) => handleUpdateProfitMargin(menu.id, e.target.value)}
                          className="w-20 inline-block"
                          onBlur={() => setEditingMenu(null)}
                        />
                      ) : (
                        <span>{menu.profitMargin}%</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">{sellingPrice.toFixed(2)}</TableCell>
                    <TableCell className="text-right">
                      <span className={`px-2 py-1 rounded-full text-sm ${
                        foodCostPercentage > 35 ? 'bg-red-100 text-red-800' :
                        foodCostPercentage > 30 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {foodCostPercentage.toFixed(1)}%
                      </span>
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => setEditingMenu(menu.id)}
                      >
                        <FileEdit className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pricing Analytics */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Average Profit Margin</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(menus.reduce((acc, menu) => acc + menu.profitMargin, 0) / menus.length).toFixed(1)}%
            </div>
            <p className="text-sm text-muted-foreground">Across all menu items</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Average Food Cost</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(menus.reduce((acc, menu) => {
                const cost = calculateMenuCost(menu.ingredients);
                const price = calculateSellingPrice(cost, menu.profitMargin);
                return acc + (cost / price) * 100;
              }, 0) / menus.length).toFixed(1)}%
            </div>
            <p className="text-sm text-muted-foreground">Target: 28-32%</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Highest Margin Item</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {menus.reduce((max, menu) => menu.profitMargin > max.margin ? 
                { name: menu.name, margin: menu.profitMargin } : max, 
                { name: '', margin: 0 }
              ).name}
            </div>
            <p className="text-sm text-muted-foreground">Best performing menu item</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FoodCostManagement;