import React from 'react';
import { Category } from '../types';

interface CategoriesProps {
  categories: Category[];
  onSelect: (category: Category) => void;
}

export const Categories: React.FC<CategoriesProps> = ({
  categories,
  onSelect,
}) => {
  return (
    <ul>
      {categories.map((category) => (
        <li key={category.id} className='mb-2'>
          <button
            className='w-full text-left p-2 hover:bg-gray-300 rounded'
            onClick={() => onSelect(category)}
          >
            {category.name}
          </button>
        </li>
      ))}
    </ul>
  );
};
