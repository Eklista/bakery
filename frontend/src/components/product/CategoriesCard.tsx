import React from 'react';

interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export const CategoriesCard: React.FC = () => {
  const categories: Category[] = [
    { id: 'pastry', name: 'Pastry', icon: '🥐', color: 'bg-pink-100 text-pink-600' },
    { id: 'sweet', name: 'Sweet', icon: '🍭', color: 'bg-blue-600 text-white' },
    { id: 'scoop', name: 'Scoop', icon: '🍦', color: 'bg-purple-100 text-purple-600' },
    { id: 'bake', name: 'Bake', icon: '🍞', color: 'bg-green-100 text-green-600' },
    { id: 'brew', name: 'Brew', icon: '☕', color: 'bg-orange-100 text-orange-600' },
  ];

  return (
    <div className="bg-white rounded-3xl shadow-lg p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4 text-center">
        Shop by Category
      </h3>
      
      <div className="grid grid-cols-2 gap-3">
        {categories.map((category) => (
          <button
            key={category.id}
            className={`${category.color} p-4 rounded-2xl text-center transition-all hover:shadow-md hover:scale-105 cursor-pointer`}
          >
            <div className="w-8 h-8 mx-auto mb-2 rounded-full bg-white/20 flex items-center justify-center">
              <span className="text-lg">
                {category.icon}
              </span>
            </div>
            <div className="text-sm font-medium">{category.name}</div>
          </button>
        ))}
      </div>
    </div>
  );
};