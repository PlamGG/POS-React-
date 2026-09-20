import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Minus, Trash2 } from 'lucide-react';

const OrderItems = ({ order, addItemToOrder, removeItemFromOrder, deleteItemFromOrder }) => {
  const calculateItemTotal = (price, quantity) => {
    return price * quantity;
  };

  const calculateOrderTotal = () => {
    return order.items.reduce((total, item) => total + calculateItemTotal(item.price, item.quantity), 0);
  };

  return (
    <Card className="w-full border-none shadow-none bg-transparent">
      <CardContent className="p-0">
        <div className="space-y-4">
          {order.items.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No items in the cart
            </div>
          ) : (
            <>
              {order.items.map((item) => (
                <div 
                  key={item.cartItemId} 
                  className="flex flex-col bg-white p-3 rounded-lg shadow-sm gap-3"
                >
                  {/* Product Info Section */}
                  <div className="flex items-start w-full">
                    <div className="relative flex-shrink-0">
                      <img 
                        src={item.image || "/api/placeholder/80/80"} 
                        alt={item.name} 
                        className="w-16 h-16 object-cover rounded-lg shadow-sm" 
                      />
                    </div>
                    <div className="ml-3 flex-1 min-w-0">
                      <h3 className="font-semibold text-sm truncate">{item.name}</h3> 
                      {item.selectedModifiers && item.selectedModifiers.length > 0 && (
                        <div className="text-xs text-gray-500 mb-0.5 truncate">
                          {item.selectedModifiers.map(m => m.name).join(', ')}
                        </div>
                      )}
                      {item.itemNote && (
                        <div className="text-xs text-orange-600 mb-0.5 font-medium italic truncate">
                          Note: {item.itemNote}
                        </div>
                      )}
                      <div className="text-sm">
                        <span className="text-gray-600">฿{item.price.toFixed(2)}</span>
                        <span className="text-blue-600 font-medium ml-2">
                          (฿{calculateItemTotal(item.price, item.quantity).toFixed(2)})
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Controls Section */}
                  <div className="flex items-center gap-2 justify-between w-full">
                    <div className="flex items-center bg-gray-100 rounded-lg p-1">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => removeItemFromOrder(item.cartItemId)}
                        className="h-8 w-8 text-gray-600 hover:text-black hover:bg-white"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="font-semibold w-8 text-center text-sm">
                        {item.quantity}
                      </span>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => addItemToOrder(item, item.selectedModifiers)}
                        className="h-8 w-8 text-gray-600 hover:text-black hover:bg-white"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-red-400 hover:text-red-600 hover:bg-red-50 h-9 w-9 shrink-0"
                      onClick={() => deleteItemFromOrder(item.cartItemId)} 
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}

              <div className="mt-6 border-t pt-4">
                <div className="flex justify-between items-center text-base sm:text-lg font-semibold">
                  <span>Total Amount:</span>
                  <span className="text-blue-600">฿{calculateOrderTotal().toFixed(2)}</span>
                </div>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderItems;
