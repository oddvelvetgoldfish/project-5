import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export const NewQuestion = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!content.trim().endsWith('?')) {
      setError('Question must end with a question mark.');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content, categoryId: Number(categoryId) }),
      });

      const data = await response.json();

      if (response.ok) {
        navigate('/dashboard');
      } else {
        setError(data.message || 'Failed to submit question.');
      }
    } catch (err) {
      setError('An error occurred while submitting the question.');
      console.error(err);
    }
  };

  const handleCancel = () => {
    navigate('/dashboard');
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-100'>
      <form
        className='bg-white p-6 rounded shadow-md w-full max-w-lg'
        onSubmit={handleSubmit}
      >
        <h2 className='text-2xl mb-4'>New Question</h2>
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
