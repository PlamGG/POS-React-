import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Loader2, MessageSquare } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const MenuItemList = ({ filteredMenuItems, addItemToOrder }) => {
  const [loadingItems, setLoadingItems] = useState({});
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedModifiers, setSelectedModifiers] = useState({});
  const [itemNote, setItemNote] = useState('');

  const handleItemClick = (item) => {
    setSelectedProduct(item);
    
    // Auto-select first option for 'single' required modifiers
    const initialModifiers = {};
    if (item.modifierGroups) {
      item.modifierGroups.forEach(group => {
        if (group.type === 'single' && group.required && group.options.length > 0) {
          initialModifiers[group.groupName] = [group.options[0]];
        } else {
          initialModifiers[group.groupName] = [];
        }
      });
    }
    
    setSelectedModifiers(initialModifiers);
    setItemNote('');
  };

  const handleAddToOrder = async (item, modifiersDict, note) => {
    setLoadingItems(prev => ({ ...prev, [item.id]: true }));
    try {
      const flatModifiers = Object.values(modifiersDict).flat();
      await addItemToOrder(item, flatModifiers, note);
      setSelectedProduct(null);
    } finally {
      setLoadingItems(prev => ({ ...prev, [item.id]: false }));
    }
  };

  const toggleMultipleModifier = (groupName, mod) => {
    setSelectedModifiers(prev => {
      const groupSelected = prev[groupName] || [];
      const isSelected = groupSelected.some(m => m.name === mod.name);
      
      return {
        ...prev,
        [groupName]: isSelected
          ? groupSelected.filter(m => m.name !== mod.name)
          : [...groupSelected, mod]
      };
    });
  };

  const setSingleModifier = (groupName, mod) => {
    setSelectedModifiers(prev => ({
      ...prev,
      [groupName]: [mod]
    }));
  };

  const currentModalPrice = selectedProduct 
    ? selectedProduct.price + Object.values(selectedModifiers).flat().reduce((sum, m) => sum + (m.price || 0), 0)
    : 0;

  return (
    <>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-3 md:gap-4 mt-4">
        {filteredMenuItems.map((item) => (
          <Card 
            key={item.id} 
            className="flex flex-col justify-between relative overflow-hidden"
          >
            <div className="relative cursor-pointer" onClick={() => handleItemClick(item)}>
              <div className="relative w-full pt-[75%]">
                <div className="absolute inset-0 overflow-hidden rounded-t-lg">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105" 
                  />
                </div>
              </div>
            </div>

            <CardHeader className="pt-2 px-2 pb-1"> 
              <CardTitle className="text-md font-semibold line-clamp-2 min-h-[2.5rem]">
                {item.name}
              </CardTitle>
            </CardHeader>

            <CardContent className="px-2 py-1"> 
              <div className="flex justify-between items-center mt-1"> 
                <p className="font-bold text-md text-blue-600">฿{item.price.toFixed(2)}</p> 
              </div>
            </CardContent>

            <CardFooter className="p-2 pt-1 flex gap-1 sm:gap-2"> 
              <Button 
                onClick={(e) => { e.stopPropagation(); handleAddToOrder(item, {}, ''); }} 
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white h-8 text-xs sm:h-10 sm:text-sm px-2"
                disabled={loadingItems[item.id]}
              >
                {loadingItems[item.id] ? (
                  <Loader2 className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                ) : (
                  <ShoppingCart className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                )}
                <span className="hidden sm:inline">Add</span>
                <span className="sm:hidden">Add</span>
              </Button>
              {item.modifierGroups && item.modifierGroups.length > 0 && (
                <Button 
                  variant="outline"
                  onClick={(e) => { e.stopPropagation(); handleItemClick(item); }} 
                  className="px-2 h-8 text-xs sm:px-3 sm:h-10 sm:text-sm"
                >
                  Options
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>

      <Dialog open={!!selectedProduct} onOpenChange={(open) => !open && setSelectedProduct(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedProduct?.name}</DialogTitle>
          </DialogHeader>
          
          <div className="py-2 space-y-6 max-h-[60vh] overflow-y-auto pr-2">
            {selectedProduct?.modifierGroups?.map((group, gIndex) => (
              <div key={gIndex} className="space-y-3">
                <h4 className="font-semibold text-sm text-gray-800 flex justify-between border-b pb-1">
                  {group.groupName}
                  {group.required && <span className="text-xs text-red-500 font-normal">Required</span>}
                </h4>
                
                {group.type === 'single' ? (
                  <RadioGroup 
                    value={selectedModifiers[group.groupName]?.[0]?.name || ''}
                    onValueChange={(val) => {
                      const mod = group.options.find(o => o.name === val);
                      if (mod) setSingleModifier(group.groupName, mod);
                    }}
                    className="space-y-2"
                  >
                    {group.options.map((mod, index) => (
                      <div key={index} className="flex items-center space-x-3 bg-gray-50 p-2.5 rounded-md cursor-pointer hover:bg-gray-100 transition-colors">
                        <RadioGroupItem value={mod.name} id={`mod-${gIndex}-${index}`} />
                        <label 
                          htmlFor={`mod-${gIndex}-${index}`} 
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex-1 cursor-pointer"
                        >
                          {mod.name}
                        </label>
                        <span className="text-sm font-semibold text-blue-600">
                          {mod.price > 0 ? `+฿${mod.price.toFixed(2)}` : ''}
                        </span>
                      </div>
                    ))}
                  </RadioGroup>
                ) : (
                  <div className="space-y-2">
                    {group.options.map((mod, index) => (
                      <div key={index} className="flex items-center space-x-3 bg-gray-50 p-2.5 rounded-md hover:bg-gray-100 transition-colors">
                        <Checkbox 
                          id={`mod-${gIndex}-${index}`} 
                          checked={selectedModifiers[group.groupName]?.some(m => m.name === mod.name) || false}
                          onCheckedChange={() => toggleMultipleModifier(group.groupName, mod)}
                        />
                        <label 
                          htmlFor={`mod-${gIndex}-${index}`} 
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex-1 cursor-pointer"
                        >
                          {mod.name}
                        </label>
                        <span className="text-sm font-semibold text-blue-600">
                          {mod.price > 0 ? `+฿${mod.price.toFixed(2)}` : ''}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}

            <div>
              <h4 className="font-semibold text-sm text-gray-800 mb-2 flex items-center gap-1 border-b pb-1">
                <MessageSquare className="w-4 h-4" /> Special Instructions
              </h4>
              <Input 
                placeholder="e.g. ขอเผ็ดๆ, ไม่ใส่ผัก, หวานน้อย" 
                value={itemNote}
                onChange={(e) => setItemNote(e.target.value)}
                maxLength={100}
                className="mt-2"
              />
            </div>
          </div>
          
          <DialogFooter className="flex items-center justify-between border-t pt-4">
            <div className="font-bold text-lg text-blue-600">
              Total: ฿{currentModalPrice.toFixed(2)}
            </div>
            <Button onClick={() => handleAddToOrder(selectedProduct, selectedModifiers, itemNote)}>
              Add to Cart
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MenuItemList;
