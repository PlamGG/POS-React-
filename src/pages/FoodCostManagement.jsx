import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FileEdit, Plus, Trash2, Save } from "lucide-react";
import { useProducts, useUpdateProduct } from '../hooks/useProducts';
import { useIngredients } from '../hooks/useIngredients';
import { useRecipes, useAddRecipe, useDeleteRecipe } from '../hooks/useRecipes';

const FoodCostManagement = () => {
  const { data: products = [], isLoading: loadingProducts } = useProducts();
  const { data: ingredients = [], isLoading: loadingIngredients } = useIngredients();
  const { data: recipes = [], isLoading: loadingRecipes } = useRecipes();
  const { mutate: addRecipe } = useAddRecipe();
  const { mutate: deleteRecipe } = useDeleteRecipe();
  const { mutate: updateProduct } = useUpdateProduct();

  const [editingMenu, setEditingMenu] = useState(null);
  const [profitMarginFilter, setProfitMarginFilter] = useState('all');
  
  // Recipe Dialog State
  const [recipeDialogOpen, setRecipeDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [newIngredientId, setNewIngredientId] = useState('');
  const [newQuantity, setNewQuantity] = useState('');

  if (loadingProducts || loadingIngredients || loadingRecipes) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  // Calculate costs
  const calculateMenuCost = (productId) => {
    const productRecipes = recipes.filter(r => r.products?.id === productId);
    return productRecipes.reduce((total, r) => {
      const costPerUnit = Number(r.ingredients?.cost_per_unit || 0);
      return total + (costPerUnit * Number(r.quantity_required));
    }, 0);
  };

  const calculateFoodCostPercentage = (cost, sellingPrice) => {
    if (!sellingPrice || sellingPrice <= 0) return 0;
    return (cost / sellingPrice) * 100;
  };
  
  const calculateProfitMargin = (cost, sellingPrice) => {
    if (!sellingPrice || sellingPrice <= 0) return 0;
    return ((sellingPrice - cost) / sellingPrice) * 100;
  };

  // Enhance products with calculated stats
  const enhancedProducts = products.map(product => {
    const cost = calculateMenuCost(product.id);
    const sellingPrice = Number(product.price);
    const margin = calculateProfitMargin(cost, sellingPrice);
    const fcPercent = calculateFoodCostPercentage(cost, sellingPrice);
    return { ...product, cost, sellingPrice, margin, fcPercent };
  });

  // Filter menus
  const getFilteredMenus = () => {
    if (profitMarginFilter === 'all') return enhancedProducts;
    if (profitMarginFilter === 'high') return enhancedProducts.filter(p => p.margin > 45);
    if (profitMarginFilter === 'medium') return enhancedProducts.filter(p => p.margin >= 35 && p.margin <= 45);
    return enhancedProducts.filter(p => p.margin < 35);
  };

  const handleUpdatePrice = (productId, newPrice) => {
    updateProduct({ id: productId, price: newPrice });
    setEditingMenu(null);
  };

  const openRecipeDialog = (product) => {
    setSelectedProduct(product);
    setRecipeDialogOpen(true);
  };

  const handleAddIngredientToRecipe = () => {
    if (!selectedProduct || !newIngredientId || !newQuantity) return;
    
    addRecipe({
      product_id: selectedProduct.id,
      ingredient_id: newIngredientId,
      quantity_required: Number(newQuantity)
    });
    
    setNewIngredientId('');
    setNewQuantity('');
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Food Cost & Recipe Management</CardTitle>
          <CardDescription>Manage ingredient recipes, analyze costs, and set optimal prices</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Select value={profitMarginFilter} onValueChange={setProfitMarginFilter}>
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
                <TableHead className="text-right">Cost (฿)</TableHead>
                <TableHead className="text-right">Selling Price (฿)</TableHead>
                <TableHead className="text-right">Profit Margin (%)</TableHead>
                <TableHead className="text-right">Food Cost %</TableHead>
                <TableHead className="text-center">Manage Recipe</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {getFilteredMenus().map((menu) => (
                <TableRow key={menu.id}>
                  <TableCell className="font-medium">{menu.name}</TableCell>
                  <TableCell className="text-right">{menu.cost.toFixed(2)}</TableCell>
                  <TableCell className="text-right flex justify-end gap-2 items-center">
                    {editingMenu === menu.id ? (
                      <Input
                        type="number"
                        defaultValue={menu.sellingPrice}
                        className="w-20"
                        onBlur={(e) => handleUpdatePrice(menu.id, e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleUpdatePrice(menu.id, e.target.value);
                        }}
                        autoFocus
                      />
                    ) : (
                      <>
                        <span>{menu.sellingPrice.toFixed(2)}</span>
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setEditingMenu(menu.id)}>
                          <FileEdit className="h-3 w-3" />
                        </Button>
                      </>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <span className={menu.margin < 35 ? 'text-red-500 font-bold' : 'text-green-500'}>
                      {menu.margin.toFixed(1)}%
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      menu.fcPercent > 40 ? 'bg-red-100 text-red-800' :
                      menu.fcPercent > 30 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {menu.fcPercent.toFixed(1)}%
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <Button variant="outline" size="sm" onClick={() => openRecipeDialog(menu)}>
                      Edit Recipe
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Recipe Editor Dialog */}
      <Dialog open={recipeDialogOpen} onOpenChange={setRecipeDialogOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Recipe: {selectedProduct?.name}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 pt-4">
            <h4 className="font-semibold text-sm">Ingredients Used</h4>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ingredient</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Cost</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recipes.filter(r => r.products?.id === selectedProduct?.id).map(r => (
                  <TableRow key={r.id}>
                    <TableCell>{r.ingredients?.name}</TableCell>
                    <TableCell>{r.quantity_required} {r.ingredients?.unit}</TableCell>
                    <TableCell>฿{(r.quantity_required * r.ingredients?.cost_per_unit).toFixed(2)}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" onClick={() => deleteRecipe(r.id)}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="flex gap-2 items-end pt-4 border-t">
              <div className="flex-1">
                <label className="text-xs font-medium mb-1 block">Add Ingredient</label>
                <Select value={newIngredientId} onValueChange={setNewIngredientId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent>
                    {ingredients.map(ing => (
                      <SelectItem key={ing.id} value={ing.id}>{ing.name} ({ing.unit})</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="w-24">
                <label className="text-xs font-medium mb-1 block">Quantity</label>
                <Input 
                  type="number" 
                  step="0.1"
                  min="0"
                  value={newQuantity} 
                  onChange={e => setNewQuantity(e.target.value)} 
                />
              </div>
              <Button onClick={handleAddIngredientToRecipe} disabled={!newIngredientId || !newQuantity}>
                <Plus className="h-4 w-4 mr-2" /> Add
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FoodCostManagement;