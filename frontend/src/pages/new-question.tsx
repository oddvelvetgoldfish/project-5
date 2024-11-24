import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchCategories, submitQuestion } from '../api';
import { Category } from '../types';

export const NewQuestion = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const [categories, setCategories] = useState<Category[]>([]);
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categories = await fetchCategories(token!);
        setCategories(categories);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError('Failed to load categories.');
      }
    };

    loadCategories();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!content.trim().endsWith('?')) {
      setError('Question must end with a question mark.');
      return;
    }

    try {
      await submitQuestion(content, Number(categoryId), token!);
      navigate(`/dashboard/${categoryId}`);
    } catch (err: any) {
      setError(
        err.message || 'An error occurred while submitting the question.'
      );
      console.error(err);
    }
  };

  const handleCancel = () => {
    navigate(`/dashboard/${categoryId}`);
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-100'>
      <form
        className='bg-white p-6 rounded shadow-md w-full max-w-lg'
        onSubmit={handleSubmit}
      >
        <h2 className='text-2xl mb-4'>
          New Question:{' '}
          {categories.find((c) => c.id === Number(categoryId))?.name}
        </h2>
        {error && <p className='text-red-500'>{error}</p>}
        <div className='mb-4'>
          <label className='block'>Question</label>
          <textarea
            className='w-full p-2 border rounded'
            rows={4}
            value={content}
            onChange={(e) => setContent(e.target.value)}
          ></textarea>
        </div>
        <div className='flex justify-end space-x-2'>
          <button
            type='button'
            className='bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600'
            onClick={handleCancel}
          >
            Cancel
          </button>
          <button
            type='submit'
            className='bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600'
          >
            Submit Question
          </button>
        </div>
      </form>
    </div>
  );
};
