import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Edit, Trash, Save, X, Loader2, Store, Coffee, Tag, Banknote, Upload } from 'lucide-react';
import { menuItems as initialMenuItems } from '../data/menuItems';
import CashManagement from '../components/CashManagement';
import MenuItems from '../components/MenuItems';
import ModifiersManagement from '../components/ModifiersManagement';
import { useStoreSettings, useUpdateStoreSettings } from '../hooks/useStoreSettings';
import { usePromotions, useAddPromotion, useUpdatePromotion, useDeletePromotion } from '../hooks/usePromotions';

const StoreProfile = () => {
  const { data: settings, isLoading } = useStoreSettings();
  const { mutate: updateSettings, isPending } = useUpdateStoreSettings();
  const [formData, setFormData] = useState({ store_name: '', promptpay_id: '', receipt_footer: '', tax_rate: 7 });

  useEffect(() => {
    if (settings) {
      setFormData({
        store_name: settings.store_name || '',
        promptpay_id: settings.promptpay_id || '',
        receipt_footer: settings.receipt_footer || '',
        tax_rate: settings.tax_rate || 7
      });
    }
  }, [settings]);

  const handleSubmit = (e) => {
    e.preventDefault();
    updateSettings(formData);
  };

  if (isLoading) return <div>Loading Store Profile...</div>;

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
      <div>
        <label className="block text-sm font-medium mb-1">Store Name</label>
        <Input 
          value={formData.store_name}
          onChange={e => setFormData({...formData, store_name: e.target.value})}
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">PromptPay ID (Phone or Tax ID)</label>
        <Input 
          value={formData.promptpay_id}
          onChange={e => setFormData({...formData, promptpay_id: e.target.value})}
        />
        <p className="text-xs text-gray-500 mt-1">Used to generate QR code for customers to scan and pay.</p>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Receipt Footer Message</label>
        <Input 
          value={formData.receipt_footer}
          onChange={e => setFormData({...formData, receipt_footer: e.target.value})}
        />
      </div>
      <Button type="submit" disabled={isPending}>
        {isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
        Save Store Settings
      </Button>
    </form>
  );
};

const PromotionForm = ({ promotion, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState(promotion || {
    code: '',
    type: 'percentage',
    value: '',
    min_purchase: 0
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.code || formData.value === '') return;
    onSubmit({
      ...formData,
      value: Number(formData.value),
      min_purchase: Number(formData.min_purchase) || 0
    });
    if (!promotion) {
      setFormData({ code: '', type: 'percentage', value: '', min_purchase: 0 });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap gap-4 items-end">
      <div className="flex-1 min-w-[150px]">
        <label className="text-xs">Promo Code</label>
        <Input value={formData.code} onChange={e => setFormData({...formData, code: e.target.value})} required />
      </div>
      <div className="w-32">
        <label className="text-xs">Type</label>
        <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value})}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="percentage">Percentage (%)</SelectItem>
            <SelectItem value="fixed">Fixed (฿)</SelectItem>
            <SelectItem value="bogo">Buy 1 Get 1</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="w-24">
        <label className="text-xs">Value</label>
        <Input type="number" value={formData.value} onChange={e => setFormData({...formData, value: e.target.value})} disabled={formData.type === 'bogo'} />
      </div>
      <div className="w-32">
        <label className="text-xs">Min Purchase (฿)</label>
        <Input type="number" value={formData.min_purchase} onChange={e => setFormData({...formData, min_purchase: e.target.value})} />
      </div>
      <div className="flex gap-2">
        <Button type="submit">{promotion ? <Save className="h-4 w-4" /> : <Plus className="h-4 w-4" />}</Button>
        {onCancel && <Button type="button" variant="ghost" onClick={onCancel}><X className="h-4 w-4" /></Button>}
      </div>
    </form>
  );
};

const PromotionsManagement = () => {
  const { data: promotions = [], isLoading } = usePromotions();
  const { mutate: addPromo } = useAddPromotion();
  const { mutate: updatePromo } = useUpdatePromotion();
  const { mutate: deletePromo } = useDeletePromotion();
  const [editingId, setEditingId] = useState(null);

  if (isLoading) return <div>Loading Promotions...</div>;

  return (
    <div className="space-y-6">
      <div className="rounded-md border overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="p-4 text-left font-medium">Code</th>
              <th className="p-4 text-left font-medium">Type</th>
              <th className="p-4 text-left font-medium">Value</th>
              <th className="p-4 text-left font-medium">Min Purchase</th>
              <th className="p-4 text-left font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {promotions.map(promo => (
              <tr key={promo.id} className="border-b">
                {editingId === promo.id ? (
                  <td colSpan={5} className="p-4">
                    <PromotionForm 
                      promotion={promo}
                      onSubmit={(data) => { updatePromo({ id: promo.id, ...data }); setEditingId(null); }}
                      onCancel={() => setEditingId(null)}
                    />
                  </td>
                ) : (
                  <>
                    <td className="p-4 font-bold">{promo.code}</td>
                    <td className="p-4 capitalize">{promo.type}</td>
                    <td className="p-4">{promo.type === 'bogo' ? 'BOGO' : promo.type === 'percentage' ? `${promo.value}%` : `฿${promo.value}`}</td>
                    <td className="p-4">฿{promo.min_purchase}</td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={() => setEditingId(promo.id)}><Edit className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="sm" onClick={() => { if(window.confirm('Delete this promo?')) deletePromo(promo.id); }}><Trash className="h-4 w-4 text-red-500" /></Button>
                      </div>
                    </td>
                  </>
                )}
              </tr>
            ))}
            {promotions.length === 0 && (
              <tr><td colSpan={5} className="p-4 text-center text-gray-500">No promotions active.</td></tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="pt-4 border-t">
        <h3 className="font-medium mb-4">Add New Promotion</h3>
        <PromotionForm onSubmit={(data) => addPromo(data)} />
      </div>
    </div>
  );
};

const Settings = () => {
  const [dailyCashBalance, setDailyCashBalance] = useState(() => parseFloat(localStorage.getItem('storeCashBalance')) || 0);
  const [cashInput, setCashInput] = useState('');

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      
      <Tabs defaultValue="store" className="space-y-4">
        <TabsList>
          <TabsTrigger value="store">Store Profile</TabsTrigger>
          <TabsTrigger value="menu">Menu Items</TabsTrigger>
          <TabsTrigger value="modifiers">Modifiers & Add-ons</TabsTrigger>
          <TabsTrigger value="promotions">Promotions</TabsTrigger>
          <TabsTrigger value="cash">Cash Drawer</TabsTrigger>
        </TabsList>
        
        <TabsContent value="store">
          <Card><CardHeader><CardTitle>Store Configuration</CardTitle></CardHeader><CardContent><StoreProfile /></CardContent></Card>
        </TabsContent>
        
        <TabsContent value="menu">
          <Card><CardHeader><CardTitle>Menu Management</CardTitle></CardHeader><CardContent><MenuItems /></CardContent></Card>
        </TabsContent>
        
        <TabsContent value="modifiers">
          <Card><CardHeader><CardTitle>Modifiers & Add-ons</CardTitle></CardHeader><CardContent><ModifiersManagement /></CardContent></Card>
        </TabsContent>
        
        <TabsContent value="promotions">
          <Card><CardHeader><CardTitle>Campaigns & Discounts</CardTitle></CardHeader><CardContent><PromotionsManagement /></CardContent></Card>
        </TabsContent>
        
        <TabsContent value="cash">
          <CashManagement 
            dailyCashBalance={dailyCashBalance}
            setDailyCashBalance={setDailyCashBalance}
            cashInput={cashInput}
            setCashInput={setCashInput}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;