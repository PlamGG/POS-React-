import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash, Save, X } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { menuItems as initialMenuItems } from '../data/menuItems';
import CashManagement from './CashManagement';
import MenuItems from './MenuItems';

const PromotionForm = ({ promotion, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState(promotion || {
    code: '',
    type: 'percentage',
    value: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.code || !formData.value) {
      return;
    }
    onSubmit(formData);
    if (!promotion) {
      setFormData({ code: '', type: 'percentage', value: '' });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-4 items-end">
      <div className="flex-1">
        <Input 
          placeholder="Promotion Code"
          value={formData.code}
          onChange={(e) => setFormData({...formData, code: e.target.value})}
        />
      </div>
      <div className="w-32">
        <Select
          value={formData.type}
          onValueChange={(value) => setFormData({...formData, type: value})}
        >
          <SelectTrigger>
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="percentage">Percentage</SelectItem>
            <SelectItem value="fixed">Fixed Amount</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="w-32">
        <Input 
          type="number"
          placeholder="Value"
          value={formData.value}
          onChange={(e) => setFormData({...formData, value: e.target.value})}
        />
      </div>
      <div className="flex gap-2">
        <Button type="submit">
          {promotion ? <Save className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
        </Button>
        {onCancel && (
          <Button type="button" variant="ghost" onClick={onCancel}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </form>
  );
};

const Settings = () => {
  const [promotions, setPromotions] = useState([
    { id: 1, code: 'Sale10', type: 'percentage', value: 10 },
    { id: 2, code: 'GOGO', type: 'fixed', value: 100 },
  ]);
  const [menuItems, setMenuItems] = useState(initialMenuItems);
  const [editingId, setEditingId] = useState(null);
  const [dailyCashBalance, setDailyCashBalance] = useState(0);
  const [cashInput, setCashInput] = useState('');

  const handleAddPromotion = (formData) => {
    setPromotions([...promotions, { ...formData, id: Date.now() }]);
  };

  const handleUpdatePromotion = (formData) => {
    setPromotions(promotions.map(promo => 
      promo.id === editingId ? { ...formData, id: editingId } : promo
    ));
    setEditingId(null);
  };

  const handleDeletePromotion = (id) => {
    setPromotions(promotions.filter(promo => promo.id !== id));
  };

  const formatValue = (promotion) => {
    return promotion.type === 'percentage' 
      ? `${promotion.value}%` 
      : `฿${promotion.value}`;
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold mb-8">Settings</h1>

      <CashManagement 
        dailyCashBalance={dailyCashBalance}
        setDailyCashBalance={setDailyCashBalance}
        cashInput={cashInput}
        setCashInput={setCashInput}
      />

      <Card>
        <CardHeader>
          <CardTitle>Promotions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {promotions.length === 0 ? (
            <Alert>
              <AlertDescription>
                No promotions found. Add a new promotion below.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="rounded-md border">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="p-4 text-left font-medium">Code</th>
                    <th className="p-4 text-left font-medium">Type</th>
                    <th className="p-4 text-left font-medium">Value</th>
                    <th className="p-4 text-left font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {promotions.map(promotion => (
                    <tr key={promotion.id} className="border-b">
                      {editingId === promotion.id ? (
                        <td colSpan={4} className="p-4">
                          <PromotionForm 
                            promotion={promotion}
                            onSubmit={handleUpdatePromotion}
                            onCancel={() => setEditingId(null)}
                          />
                        </td>
                      ) : (
                        <>
                          <td className="p-4">{promotion.code}</td>
                          <td className="p-4 capitalize">{promotion.type}</td>
                          <td className="p-4">{formatValue(promotion)}</td>
                          <td className="p-4">
                            <div className="flex gap-2">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => setEditingId(promotion.id)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleDeletePromotion(promotion.id)}
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="pt-4 border-t">
            <PromotionForm onSubmit={handleAddPromotion} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Menu Items</CardTitle>
        </CardHeader>
        <CardContent>
          <MenuItems menuItems={menuItems} setMenuItems={setMenuItems} />
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;