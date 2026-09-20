import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash, X, Upload, Loader2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useProducts, useAddProduct, useUpdateProduct, useDeleteProduct } from '../hooks/useProducts';
import { supabase } from '../services/supabase';

const CATEGORIES = ['Main Course', 'Snacks', 'Drinks', 'Desserts'];

const MenuItemForm = ({ item, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState(item ? { ...item, modifiers: item.modifiers || [] } : { name: '', price: '', category: '', image: '', modifiers: [] });
  const [imagePreview, setImagePreview] = useState(item?.image || '');
  const [fileToUpload, setFileToUpload] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file && file.size <= 5000000) {
      setFileToUpload(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      alert('Image size should be less than 5MB');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.category) return;
    
    setIsUploading(true);
    let finalImageUrl = formData.image;

    if (fileToUpload) {
      const fileName = `${Date.now()}-${fileToUpload.name.replace(/[^a-zA-Z0-9.-]/g, '')}`;
      const { data, error } = await supabase.storage
        .from('product_images')
        .upload(fileName, fileToUpload);

      if (error) {
        alert('Upload failed: ' + error.message);
        setIsUploading(false);
        return;
      }

      const { data: urlData } = supabase.storage
        .from('product_images')
        .getPublicUrl(fileName);
      
      finalImageUrl = urlData.publicUrl;
    }

    await onSubmit({ 
      name: formData.name,
      price: Number(formData.price),
      category: formData.category,
      image: finalImageUrl,
      modifiers: formData.modifiers.filter(m => m.name.trim() !== '').map(m => ({
        name: m.name,
        price: Number(m.price) || 0
      }))
    });
    
    setIsUploading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Input
            placeholder="Menu Name"
            value={formData.name}
            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
            required
          />
          <Input
            type="number"
            placeholder="Price"
            value={formData.price}
            onChange={(e) => setFormData((prev) => ({ ...prev, price: e.target.value }))}
            required
          />
          <Select
            value={formData.category}
            onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
            required
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
                  <Button type="button" variant="ghost" size="sm" className="absolute top-2 right-2 bg-white/80" onClick={() => {
                    setImagePreview('');
                    setFileToUpload(null);
                    setFormData(prev => ({ ...prev, image: '' }));
                  }}>
                    <X className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center h-40 cursor-pointer border-2 border-dashed rounded-md border-gray-300 hover:border-gray-400">
                  <Upload className="h-8 w-8 text-gray-400" />
                  <span className="mt-2 text-sm text-gray-500">Upload Image</span>
                  <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                </label>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="space-y-2 pt-2 border-t mt-4">
        <label className="text-sm font-medium">Add-ons / Modifiers (Optional)</label>
        {formData.modifiers.map((mod, idx) => (
          <div key={idx} className="flex gap-2 items-center">
            <Input 
              placeholder="Name (e.g. Extra Shot)" 
              value={mod.name}
              onChange={(e) => {
                const newMods = [...formData.modifiers];
                newMods[idx].name = e.target.value;
                setFormData(prev => ({ ...prev, modifiers: newMods }));
              }}
              className="flex-1"
            />
            <Input 
              type="number" 
              placeholder="Price (+฿)" 
              value={mod.price}
              onChange={(e) => {
                const newMods = [...formData.modifiers];
                newMods[idx].price = Number(e.target.value);
                setFormData(prev => ({ ...prev, modifiers: newMods }));
              }}
              className="w-24"
            />
            <Button 
              type="button" 
              variant="ghost" 
              size="icon"
              onClick={() => {
                const newMods = formData.modifiers.filter((_, i) => i !== idx);
                setFormData(prev => ({ ...prev, modifiers: newMods }));
              }}
            >
              <X className="w-4 h-4 text-red-500" />
            </Button>
          </div>
        ))}
        <Button 
          type="button" 
          variant="outline" 
          size="sm"
          onClick={() => setFormData(prev => ({ ...prev, modifiers: [...prev.modifiers, { name: '', price: 0 }] }))}
        >
          <Plus className="w-4 h-4 mr-2" /> Add Modifier
        </Button>
      </div>

      <div className="flex justify-end gap-2 mt-4">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={isUploading}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isUploading}>
          {isUploading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
          {item ? 'Save' : 'Add Menu'}
        </Button>
      </div>
    </form>
  );
};

const MenuItems = () => {
  const { data: menuItems = [], isLoading } = useProducts();
  const { mutate: addProduct } = useAddProduct();
  const { mutate: updateProduct } = useUpdateProduct();
  const { mutate: deleteProduct } = useDeleteProduct();

  const [editingId, setEditingId] = useState(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const handleAddMenuItem = (formData) => {
    addProduct(formData, {
      onSuccess: () => setIsAddDialogOpen(false)
    });
  };

  const handleUpdateMenuItem = (formData) => {
    updateProduct({ id: editingId, ...formData }, {
      onSuccess: () => setEditingId(null)
    });
  };

  const handleDeleteMenuItem = (id) => {
    if (window.confirm("Are you sure you want to delete this menu?")) {
      deleteProduct(id);
    }
  };

  if (isLoading) return <div>Loading...</div>;

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
                        <span className="text-gray-400 text-xs">No image</span>
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
                        <Trash className="h-4 w-4 text-red-500" />
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

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Menu</DialogTitle>
          </DialogHeader>
          <MenuItemForm onSubmit={handleAddMenuItem} onCancel={() => setIsAddDialogOpen(false)} />
        </DialogContent>
      </Dialog>

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
