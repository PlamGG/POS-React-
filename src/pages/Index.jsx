import React from 'react';
import JapaneseMenu from '../components/JapaneseMenu';

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">Welcome to Our Japanese Restaurant</h1>
        <Menu />
      </div>
    </div>
  );
};

export default Index;