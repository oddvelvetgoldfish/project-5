import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

interface Question {
  id: number;
  content: string;
  user_id: number;
  category_id: number;
  created_at: string;
  user: {
    id: number;
    username: string;
  };
}

export const QuestionView = () => {
  const { id } = useParams<{ id: string }>();
  const [question, setQuestion] = useState<Question | null>(null);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/questions/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await response.json();
        if (response.ok) {
          setQuestion(data.question);
        } else {
          console.error('Error fetching question:', data.message);
        }
      } catch (err) {
        console.error('Error fetching question:', err);
      }
    };
    fetchQuestion();
  }, [id, token]);

  const handleBack = () => {
    navigate('/dashboard');
  };

  if (!question) {
    return <p>Loading...</p>;
  }

  return (
    <div className='p-4'>
      <button
        onClick={handleBack}
        className='mb-4 text-blue-500 hover:underline'
      >
        &larr; Back to Dashboard
      </button>
      <div className='bg-white p-6 rounded shadow-md mb-4'>
        <h2 className='text-2xl mb-2'>{question.content}</h2>
        <p className='text-sm text-gray-500'>
          Asked by {question.user.username} on{' '}
          {new Date(question.created_at).toLocaleString()}
        </p>
      </div>
      <h3 className='text-xl mb-2'>Answers</h3>
      <p>No answers yet.</p>
    </div>
  );
};
