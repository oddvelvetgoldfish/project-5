import React from 'react';
import { Category } from '../types';

interface CategoriesProps {
  categories: Category[];
  onSelect: (category: Category) => void;
  selectedCategoryId?: string;
}

export const Categories: React.FC<CategoriesProps> = ({
  categories,
  selectedCategoryId,
  onSelect,
}) => {
  return (
    <ul>
      {categories.map((category) => (
        <li key={category.id} className='mb-2'>
          <button
            className={`w-full text-left p-2 rounded ${
              category.id === selectedCategoryId
                ? 'bg-blue-500 text-white'
                : 'hover:bg-gray-300'
            }`}
            onClick={() => onSelect(category)}
          >
            {category.name}
          </button>
        </li>
      ))}
    </ul>
  );
};
