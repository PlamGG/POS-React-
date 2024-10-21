import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Loader2 } from 'lucide-react';

const MenuItemList = ({ filteredMenuItems, addItemToOrder }) => {
  const [loadingItems, setLoadingItems] = useState({});

  const handleAddToOrder = async (item) => {
    setLoadingItems(prev => ({ ...prev, [item.id]: true }));
    try {
      await addItemToOrder(item);
    } finally {
      setLoadingItems(prev => ({ ...prev, [item.id]: false }));
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
      {filteredMenuItems.map((item) => (
        <Card 
          key={item.id} 
          className="flex flex-col justify-between relative overflow-hidden"
        >
          <div className="relative">
            <div className="relative w-full pt-[75%]">
              <div className="absolute inset-0 overflow-hidden rounded-t-lg">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover" 
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
            {item.description && (
              <p className="text-sm text-gray-500 line-clamp-2 min-h-[3rem]"> 
                {item.description}
              </p>
            )}
            <div className="flex justify-between items-center mt-1"> 
              <p className="font-bold text-md text-blue-600">฿{item.price.toFixed(2)}</p> 
            </div>
            {item.stock && (
              <p className="text-xs text-gray-500 mt-1">
                Remaining: {item.stock} pieces
              </p>
            )}
          </CardContent>

          <CardFooter className="p-2 pt-1"> 
            <Button 
              onClick={() => handleAddToOrder(item)} 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              disabled={loadingItems[item.id] || (item.stock && item.stock < 1)}
            >
              {loadingItems[item.id] ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <ShoppingCart className="mr-2 h-4 w-4" />
              )}
              {item.stock && item.stock < 1 ? 'Out of stock' : 'Add to Cart'} 
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default MenuItemList;
