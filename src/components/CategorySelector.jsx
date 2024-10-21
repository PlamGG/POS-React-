import React from 'react';
import { Button } from "@/components/ui/button";

const CategorySelector = ({ menuItems, selectedCategory, onSelectCategory }) => {
  const categories = ['All', ...new Set(menuItems.map(item => item.category))];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex space-x-2 overflow-x-auto">
      {categories.map((category) => (
        <Button
          key={category}
          variant={selectedCategory === category ? "default" : "outline"}
          size="sm"
          onClick={() => onSelectCategory(category)}
        >
          {category}
        </Button>
      ))}
    </div>
  );
};

export default CategorySelector;