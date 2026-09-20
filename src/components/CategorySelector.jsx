import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Utensils, Coffee, IceCream, Cookie, LayoutGrid } from "lucide-react";

const getCategoryIcon = (category) => {
  const cat = category.toLowerCase();
  if (cat === 'all') return <LayoutGrid className="w-4 h-4 mr-2" />;
  if (cat.includes('drink') || cat.includes('น้ำ')) return <Coffee className="w-4 h-4 mr-2" />;
  if (cat.includes('dessert') || cat.includes('หวาน')) return <IceCream className="w-4 h-4 mr-2" />;
  if (cat.includes('snack') || cat.includes('ทานเล่น')) return <Cookie className="w-4 h-4 mr-2" />;
  return <Utensils className="w-4 h-4 mr-2" />;
};

const CategorySelector = ({ menuItems, selectedCategory, onSelectCategory, searchTerm, onSearch }) => {
  const categories = ['All', ...new Set(menuItems.map(item => item.category))];

  return (
    <div className="max-w-7xl mx-auto py-4 flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
      {/* Category Pills */}
      <div className="flex space-x-2 overflow-x-auto pb-2 w-full md:w-auto flex-nowrap scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            className={`rounded-full px-4 py-1 h-9 text-sm md:px-6 md:h-11 md:text-base whitespace-nowrap transition-all flex items-center ${
              selectedCategory === category 
                ? 'shadow-lg scale-105 bg-blue-600 hover:bg-blue-700 text-white border-none' 
                : 'text-gray-600 hover:text-gray-900 bg-white border-gray-200'
            }`}
            onClick={() => onSelectCategory(category)}
          >
            {getCategoryIcon(category)}
            {category}
          </Button>
        ))}
      </div>

      {/* Search Bar */}
      <div className="relative w-full md:w-72 flex-shrink-0">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <Input 
          type="text" 
          placeholder="ค้นหาสินค้า..." 
          value={searchTerm}
          onChange={(e) => onSearch(e.target.value)}
          className="pl-10 rounded-full bg-white border-gray-200 shadow-sm focus-visible:ring-primary h-12"
        />
      </div>
    </div>
  );
};

export default CategorySelector;