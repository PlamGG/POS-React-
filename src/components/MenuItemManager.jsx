import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Edit, Trash, Upload } from 'lucide-react';

const MenuItemManager = ({ menuItems, updateMenuItem, addMenuItem }) => {
  const [newMenuItem, setNewMenuItem] = useState({ name: '', price: '', category: '', image: '' });
  const [editingMenuItem, setEditingMenuItem] = useState(null);

  const handleUpdateMenuItem = (id, field, value) => {
    const updatedMenuItem = menuItems.find(item => item.id === id);
    updatedMenuItem[field] = value;
    updateMenuItem(updatedMenuItem);
  };

  const handleAddMenuItem = () => {
    addMenuItem(newMenuItem);
    setNewMenuItem({ name: '', price: '', category: '', image: '' });
  };

  const handleImageUpload = (event, itemId) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (itemId) {
          handleUpdateMenuItem(itemId, 'image', reader.result);
        } else {
          setNewMenuItem({...newMenuItem, image: reader.result});
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-4">
      {menuItems.map(item => (
        <div key={item.id} className="flex flex-col md:flex-row items-center space-x-2 bg-white/20 p-2 rounded">
          <Input
            value={item.name}
            onChange={(e) => handleUpdateMenuItem(item.id, 'name', e.target.value)}
            className="bg-transparent text-white flex-1 mb-2 md:mb-0"
            placeholder="Item Name"
          />
          <Input
            type="number"
            value={item.price}
            onChange={(e) => handleUpdateMenuItem(item.id, 'price', parseFloat(e.target.value))}
            className="bg-transparent text-white flex-1 mb-2 md:mb-0"
            placeholder="Price"
          />
          <select
            value={item.category}
            onChange={(e) => handleUpdateMenuItem(item.id, 'category', e.target.value)}
            className="bg-transparent text-white border rounded p-2 mb-2 md:mb-0 flex-1"
          >
            <option value="Main Course">Main Course</option>
            <option value="Desserts">Desserts</option>
            <option value="Drinks">Drinks</option>
          </select>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleImageUpload(e, item.id)}
            className="hidden"
            id={`image-upload-${item.id}`}
          />
          <label htmlFor={`image-upload-${item.id}`} className="cursor-pointer mb-2 md:mb-0">
            <Upload className="h-6 w-6 text-white" />
          </label>
          <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded mb-2 md:mb-0" />
          <Button variant="ghost" size="icon" className="text-white"><Edit className="h-4 w-4" /></Button>
          <Button variant="ghost" size="icon" className="text-white"><Trash className="h-4 w-4" /></Button>
        </div>
      ))}
      <div className="flex flex-col md:flex-row items-center space-x-2">
        <Input
          value={newMenuItem.name}
          onChange={(e) => setNewMenuItem({...newMenuItem, name: e.target.value})}
          placeholder="New Item Name"
          className="bg-transparent text-white flex-1 mb-2 md:mb-0"
        />
        <Input
          type="number"
          value={newMenuItem.price}
          onChange={(e) => setNewMenuItem({...newMenuItem, price: parseFloat(e.target.value)})}
          placeholder="Price"
          className="bg-transparent text-white flex-1 mb-2 md:mb-0"
        />
        <select
          value={newMenuItem.category}
          onChange={(e) => setNewMenuItem({...newMenuItem, category: e.target.value})}
          className="bg-transparent text-white border rounded p-2 mb-2 md:mb-0 flex-1"
        >
          <option value="">Select Category</option>
          <option value="Main Course">Main Course</option>
          <option value="Desserts">Desserts</option>
          <option value="Drinks">Drinks</option>
        </select>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleImageUpload(e)}
          className="hidden"
          id="new-image-upload"
        />
        <label htmlFor="new-image-upload" className="cursor-pointer mb-2 md:mb-0">
          <Upload className="h-6 w-6 text-white" />
        </label>
        <Button onClick={handleAddMenuItem} className="bg-yellow-400 text-blue-900"><Plus className="h-4 w-4" /></Button>
      </div>
    </div>
  );
};

export default MenuItemManager;
