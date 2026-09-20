import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit2, Plus, Minus, Wheat, Beef, Droplet, Package, Utensils } from "lucide-react";

const getIngredientIcon = (name) => {
  const n = name.toLowerCase();
  if (n.includes('ไก่') || n.includes('หมู') || n.includes('เนื้อ') || n.includes('meat') || n.includes('chicken') || n.includes('pork')) return <Beef className="w-5 h-5 text-red-400 mr-2" />;
  if (n.includes('ขนมปัง') || n.includes('แป้ง') || n.includes('bread') || n.includes('bun') || n.includes('rice') || n.includes('ข้าว')) return <Wheat className="w-5 h-5 text-yellow-500 mr-2" />;
  if (n.includes('น้ำ') || n.includes('ซอส') || n.includes('water') || n.includes('sauce') || n.includes('milk') || n.includes('นม')) return <Droplet className="w-5 h-5 text-blue-400 mr-2" />;
  if (n.includes('กล่อง') || n.includes('แก้ว') || n.includes('ถุง') || n.includes('box') || n.includes('cup')) return <Package className="w-5 h-5 text-orange-400 mr-2" />;
  return <Utensils className="w-5 h-5 text-gray-400 mr-2" />;
};

const InventoryTable = ({ inventory, onEdit }) => {
  const getStockStatus = (quantity, threshold) => {
    if (quantity <= threshold) {
      return <Badge variant="destructive" className="font-normal">Low Stock</Badge>;
    } else if (quantity <= threshold * 1.5) {
      return <Badge variant="warning" className="bg-yellow-500 font-normal">Medium Stock</Badge>;
    }
    return <Badge variant="success" className="bg-green-500 font-normal">In Stock</Badge>;
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50">
            <TableHead>Item Name</TableHead>
            <TableHead>Stock Status</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Unit</TableHead>
            <TableHead>Min. Alert</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {inventory.map(item => (
            <TableRow key={item.id} className="hover:bg-slate-50">
              <TableCell className="font-medium flex items-center">
                {getIngredientIcon(item.name)}
                {item.name}
              </TableCell>
              <TableCell>{getStockStatus(item.stock_quantity, item.low_stock_threshold)}</TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                  <span className="font-medium">{item.stock_quantity}</span>
                </div>
              </TableCell>
              <TableCell>{item.unit}</TableCell>
              <TableCell>{item.low_stock_threshold}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end space-x-2">
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => onEdit(item, 'decrease')}
                    className="h-8 w-8"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => onEdit(item, 'increase')}
                    className="h-8 w-8"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => onEdit(item, 'edit')}
                    className="flex items-center"
                  >
                    <Edit2 className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
          {inventory.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                No items in inventory yet
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default InventoryTable;