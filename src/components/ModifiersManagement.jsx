import React, { useState } from 'react';
import { 
  useModifiers, 
  useAddModifierGroup, 
  useUpdateModifierGroup, 
  useDeleteModifierGroup,
  useAddModifierOption,
  useUpdateModifierOption,
  useDeleteModifierOption
} from '../hooks/useModifiers';
import { useIngredients } from '../hooks/useIngredients';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Edit, Trash, Save, X, ChevronDown, ChevronUp } from 'lucide-react';

import { useProducts } from '../hooks/useProducts';

const ModifiersManagement = () => {
  const { data: modifiers = [], isLoading: isLoadingModifiers } = useModifiers();
  const { data: ingredients = [] } = useIngredients();
  const { data: products = [], isLoading: isLoadingProducts } = useProducts();
  
  const { mutate: addGroup } = useAddModifierGroup();
  const { mutate: deleteGroup } = useDeleteModifierGroup();
  const { mutate: addOption } = useAddModifierOption();
  const { mutate: deleteOption } = useDeleteModifierOption();

  const [expandedGroup, setExpandedGroup] = useState(null);

  // Forms states
  const [newGroup, setNewGroup] = useState({ category: '', name: '', type: 'single', is_required: false });
  const [newOption, setNewOption] = useState({ group_id: null, name: '', price: 0, deduct_ingredient_id: 'none', deduct_quantity: 0 });

  const categories = [...new Set(products.map(p => p.category))].filter(Boolean);

  const handleAddGroup = (e) => {
    e.preventDefault();
    if (!newGroup.name || !newGroup.category) {
      alert('Please select a category and enter a group name');
      return;
    }
    addGroup(newGroup);
    setNewGroup({ ...newGroup, name: '' });
  };

  const handleAddOption = (e, groupId) => {
    e.preventDefault();
    if (!newOption.name) return;
    addOption({
      group_id: groupId,
      name: newOption.name,
      price: Number(newOption.price) || 0,
      deduct_ingredient_id: newOption.deduct_ingredient_id === 'none' ? null : newOption.deduct_ingredient_id,
      deduct_quantity: Number(newOption.deduct_quantity) || 0
    });
    setNewOption({ group_id: null, name: '', price: 0, deduct_ingredient_id: 'none', deduct_quantity: 0 });
  };

  if (isLoadingModifiers || isLoadingProducts) return <div>Loading Modifiers...</div>;

  return (
    <div className="space-y-6">
      <Card className="border-dashed border-2 bg-slate-50 shadow-none">
        <CardHeader className="py-4"><CardTitle className="text-base text-blue-600">Add New Modifier Group</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleAddGroup} className="flex flex-wrap gap-4 items-end">
            <div className="w-40">
              <label className="text-xs mb-1 block">Category</label>
              <Select value={newGroup.category} onValueChange={(value) => setNewGroup({...newGroup, category: value})}>
                <SelectTrigger><SelectValue placeholder="Select Category" /></SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1 min-w-[150px]">
              <label className="text-xs mb-1 block">Group Name</label>
              <Input placeholder="e.g. Sweetness Level" value={newGroup.name} onChange={e => setNewGroup({...newGroup, name: e.target.value})} required />
            </div>
            <div className="w-32">
              <label className="text-xs mb-1 block">Type</label>
              <Select value={newGroup.type} onValueChange={(value) => setNewGroup({...newGroup, type: value})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="single">Single Choice</SelectItem>
                  <SelectItem value="multiple">Multiple Choice</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2 h-10 px-2">
              <input type="checkbox" checked={newGroup.is_required} onChange={e => setNewGroup({...newGroup, is_required: e.target.checked})} className="w-4 h-4 rounded" />
              <label className="text-sm">Required?</label>
            </div>
            <Button type="submit"><Plus className="w-4 h-4 mr-2" /> Add Group</Button>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {modifiers.map(group => (
          <Card key={group.id} className="overflow-hidden">
            <div 
              className="flex justify-between items-center p-4 bg-white hover:bg-slate-50 cursor-pointer"
              onClick={() => setExpandedGroup(expandedGroup === group.id ? null : group.id)}
            >
              <div className="flex items-center gap-4">
                <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">{group.category}</span>
                <span className="font-semibold text-lg">{group.name}</span>
                <span className="text-sm text-gray-500">
                  ({group.type === 'single' ? 'Pick 1' : 'Pick Any'} {group.is_required ? '- Required' : ''})
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); if(window.confirm('Delete group?')) deleteGroup(group.id); }}><Trash className="w-4 h-4 text-red-500" /></Button>
                {expandedGroup === group.id ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </div>
            </div>

            {expandedGroup === group.id && (
              <div className="p-4 border-t bg-slate-50/50">
                <table className="w-full text-sm mb-4">
                  <thead>
                    <tr className="text-left text-gray-500 border-b">
                      <th className="pb-2">Option Name</th>
                      <th className="pb-2">Extra Price (฿)</th>
                      <th className="pb-2">Deduct Ingredient</th>
                      <th className="pb-2">Deduct Qty</th>
                      <th className="pb-2 w-10"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {group.options.map(opt => {
                      const ing = ingredients.find(i => i.id === opt.deduct_ingredient_id);
                      return (
                        <tr key={opt.id} className="border-b last:border-0">
                          <td className="py-2 font-medium">{opt.name}</td>
                          <td className="py-2 text-green-600">+{opt.price}</td>
                          <td className="py-2 text-gray-600">{ing ? ing.name : '-'}</td>
                          <td className="py-2 text-gray-600">{opt.deduct_quantity > 0 ? `${opt.deduct_quantity} ${ing?.unit || ''}` : '-'}</td>
                          <td className="py-2">
                            <Button variant="ghost" size="icon" className="h-6 w-6 text-red-400 hover:text-red-600" onClick={() => { if(window.confirm('Delete option?')) deleteOption(opt.id); }}><X className="w-3 h-3" /></Button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>

                {/* Add Option Form */}
                <form onSubmit={(e) => handleAddOption(e, group.id)} className="flex flex-wrap gap-2 items-end bg-white p-3 rounded-lg border">
                  <div className="flex-1 min-w-[150px]">
                    <Input placeholder="New Option (e.g. Boba)" value={newOption.group_id === group.id ? newOption.name : ''} onChange={e => setNewOption({ ...newOption, group_id: group.id, name: e.target.value })} required />
                  </div>
                  <div className="w-24">
                    <Input type="number" min="0" placeholder="+฿" value={newOption.group_id === group.id ? newOption.price : ''} onChange={e => setNewOption({ ...newOption, group_id: group.id, price: e.target.value })} />
                  </div>
                  <div className="w-48">
                    <Select value={newOption.group_id === group.id ? newOption.deduct_ingredient_id : 'none'} onValueChange={(value) => setNewOption({ ...newOption, group_id: group.id, deduct_ingredient_id: value })}>
                      <SelectTrigger><SelectValue placeholder="No deduction" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No deduction</SelectItem>
                        {ingredients.map(ing => <SelectItem key={ing.id} value={ing.id}>{ing.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="w-24">
                    <Input type="number" step="0.01" min="0" placeholder="Qty" value={newOption.group_id === group.id ? newOption.deduct_quantity : ''} onChange={e => setNewOption({ ...newOption, group_id: group.id, deduct_quantity: e.target.value })} />
                  </div>
                  <Button type="submit" variant="secondary" size="sm">Add Option</Button>
                </form>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ModifiersManagement;
