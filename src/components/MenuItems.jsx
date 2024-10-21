import React, { useState, useCallback } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash, X, Upload } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

// เปลี่ยนแปลง CATEGORIES
const CATEGORIES = ['Main Course', 'Snacks', 'Drinks', 'Desserts'];

const MenuItemForm = ({ item, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState(item || { name: '', price: '', category: '', image: '' });
  const [imagePreview, setImagePreview] = useState(item?.image || '');

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.size <= 5000000) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData((prev) => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    } else {
      alert('Image size should be less than 5MB');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.category) return;
    onSubmit({ ...formData, image: imagePreview });
    if (!item) {
      setFormData({ name: '', price: '', category: '', image: '' });
      setImagePreview('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Input
            placeholder="Menu Name"
            value={formData.name}
            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
          />
          <Input
            type="number"
            placeholder="Price"
            value={formData.price}
            onChange={(e) => setFormData((prev) => ({ ...prev, price: e.target.value }))}
          />
          <Select
            value={formData.category}
            onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Card className="border-dashed">
            <CardContent className="p-4">
              {imagePreview ? (
                <div className="relative">
                  <img src={imagePreview} alt="Preview" className="w-full h-40 object-cover rounded-md" />
                  <Button variant="ghost" size="sm" className="absolute top-2 right-2" onClick={() => setImagePreview('')}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center h-40 cursor-pointer border-2 border-dashed rounded-md border-gray-300 hover:border-gray-400">
                  <Upload className="h-8 w-8 text-gray-400" />
                  <span className="mt-2 text-sm text-gray-500">Upload Image</span>
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      <div className="flex justify-end gap-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit">{item ? 'Save' : 'Add Menu'}</Button>
      </div>
    </form>
  );
};

const MenuItems = ({ menuItems, setMenuItems }) => {
  const [editingId, setEditingId] = useState(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const handleAddMenuItem = useCallback(
    (formData) => {
      setMenuItems((prev) => [...prev, { ...formData, id: Date.now() }]);
      setIsAddDialogOpen(false);
    },
    [setMenuItems]
  );

  const handleUpdateMenuItem = useCallback(
    (formData) => {
      setMenuItems((prev) => prev.map((item) => (item.id === editingId ? { ...formData, id: editingId } : item)));
      setEditingId(null);
    },
    [setMenuItems, editingId]
  );

  const handleDeleteMenuItem = useCallback(
    (id) => {
      if (window.confirm("Are you sure you want to delete this menu?")) {
        setMenuItems((prev) => prev.filter((item) => item.id !== id));
      }
    },
    [setMenuItems]
  );

  return (
    <div className="space-y-4">
      {menuItems.length === 0 ? (
        <Alert>
          <AlertDescription>No menu items found. Please add a new menu.</AlertDescription>
        </Alert>
      ) : (
        <div className="rounded-md border overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="p-4 text-left font-medium">Image</th>
                <th className="p-4 text-left font-medium">Name</th>
                <th className="p-4 text-left font-medium">Price</th>
                <th className="p-4 text-left font-medium">Category</th>
                <th className="p-4 text-left font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {menuItems.map((item) => (
                <tr key={item.id} className="border-b">
                  <td className="p-4">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-md" />
                    ) : (
                      <div className="w-16 h-16 bg-gray-100 rounded-md flex items-center justify-center">
                        <span className="text-gray-400">No image</span>
                      </div>
                    )}
                  </td>
                  <td className="p-4">{item.name}</td>
                  <td className="p-4">฿{item.price}</td>
                  <td className="p-4">{item.category}</td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" onClick={() => setEditingId(item.id)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteMenuItem(item.id)}>
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="flex justify-end">
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add New Menu
        </Button>
      </div>

      {/* Add Menu Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Menu</DialogTitle>
          </DialogHeader>
          <MenuItemForm onSubmit={handleAddMenuItem} onCancel={() => setIsAddDialogOpen(false)} />
        </DialogContent>
      </Dialog>

      {/* Edit Menu Dialog */}
      <Dialog open={!!editingId} onOpenChange={() => setEditingId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Menu</DialogTitle>
          </DialogHeader>
          {editingId && (
            <MenuItemForm
              item={menuItems.find((item) => item.id === editingId)}
              onSubmit={handleUpdateMenuItem}
              onCancel={() => setEditingId(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MenuItems;
