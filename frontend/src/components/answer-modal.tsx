import React, { useState } from 'react';

interface AnswerModalProps {
  onClose: () => void;
  onSubmit: (content: string) => void;
}

export const AnswerModal: React.FC<AnswerModalProps> = ({
  onClose,
  onSubmit,
}) => {
  const [content, setContent] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      setError('Answer cannot be empty.');
      return;
    }
    onSubmit(content);
  };

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
      <form
        className='bg-white p-6 rounded shadow-md w-full max-w-lg'
        onSubmit={handleSubmit}
      >
        <h2 className='text-2xl mb-4'>Your Answer</h2>
        {error && <p className='text-red-500'>{error}</p>}
        <div className='mb-4'>
          <textarea
            className='w-full p-2 border rounded'
            rows={4}
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
              if (error) setError('');
            }}
          ></textarea>
        </div>
        <div className='flex justify-end space-x-2'>
          <button
            type='button'
            className='bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600'
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type='submit'
            className='bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600'
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};
