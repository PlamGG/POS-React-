import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Minus, Trash2 } from 'lucide-react';

const OrderItems = ({ order, addItemToOrder, removeItemFromOrder, updateItemQuantity }) => {
  const calculateItemTotal = (price, quantity) => {
    return price * quantity;
  };

  const calculateOrderTotal = () => {
    return order.items.reduce((total, item) => total + calculateItemTotal(item.price, item.quantity), 0);
  };

  return (
    <Card className="w-full">
      <CardContent className="pt-6">
        <div className="space-y-4">
          {order.items.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No items in the cart
            </div>
          ) : (
            <>
              {order.items.map((item) => (
                <div 
                  key={item.id} 
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-gray-50 p-2 rounded-lg hover:bg-gray-100 transition-all duration-200 gap-3 sm:gap-0"
                >
                  {/* Product Info Section */}
                  <div className="flex items-start sm:items-center w-full sm:w-auto">
                    <div className="relative">
                      <img 
                        src={item.image || "/api/placeholder/80/80"} 
                        alt={item.name} 
                        className="w-14 h-14 sm:w-16 sm:h-16 object-cover rounded-lg shadow-sm" 
                      />
                      {item.quantity > 1 && (
                        <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center">
                          {item.quantity}
                        </span>
                      )}
                    </div>
                    <div className="ml-3 sm:ml-4 flex-1">
                      <h3 className="font-semibold text-sm sm:text-base">{item.name}</h3> 
                      <div className="flex flex-col sm:block text-sm">
                        <span className="text-gray-600">฿{item.price.toFixed(2)} each</span>
                        <span className="text-blue-600 font-medium sm:ml-2">
                          Total: ฿{calculateItemTotal(item.price, item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Controls Section */}
                  <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end pl-16 sm:pl-0">
                    <div className="flex items-center bg-white rounded-lg shadow-sm p-1">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => updateItemQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        className="h-6 w-6 sm:h-7 sm:w-7"
                      >
                        <Minus className="h-3 w-3 sm:h-4 sm:w-4" />
                      </Button>
                      <span className="mx-2 sm:mx-3 font-semibold min-w-[1.5rem] sm:min-w-[2rem] text-center text-sm sm:text-base">
                        {item.quantity}
                      </span>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => addItemToOrder(item)}
                        className="h-6 w-6 sm:h-7 sm:w-7"
                      >
                        <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                      </Button>
                    </div>
                    
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-red-500 hover:text-red-600 hover:bg-red-50 h-6 w-6 sm:h-7 sm:w-7"
                      onClick={() => removeItemFromOrder(item.id)} 
                    >
                      <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
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
