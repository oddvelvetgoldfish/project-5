import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AnswerModal } from '../components/answer-modal';

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

interface Answer {
  id: number;
  content: string;
  user_id: number;
  question_id: number;
  created_at: string;
  user: {
    id: number;
    username: string;
  };
}

export const QuestionView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [question, setQuestion] = useState<Question | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [showAnswerModal, setShowAnswerModal] = useState(false);
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
          setAnswers(data.answers);
        } else {
          console.error('Error fetching question:', data.message);
        }
      } catch (err) {
        console.error('Error fetching question:', err);
      }
    };
    fetchQuestion();
  }, [id, token]);

  const handleSubmitAnswer = async (content: string) => {
    if (!content.trim()) {
      alert('Answer cannot be empty.');
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3000/api/questions/${id}/answers`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ content }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        // Refresh answers
        setAnswers((prevAnswers) => [
          {
            id: data.id,
            content,
            user_id: 0, // Update with actual user ID if available
            question_id: Number(id),
            created_at: new Date().toISOString(),
            user: {
              id: 0,
              username: localStorage.getItem('username') || 'You',
            },
          },
          ...prevAnswers,
        ]);
        setShowAnswerModal(false);
      } else {
        alert(data.message || 'Failed to submit answer.');
      }
    } catch (err) {
      console.error('Error submitting answer:', err);
    }
  };

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
        <button
          className='mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600'
          onClick={() => setShowAnswerModal(true)}
        >
          Answer
        </button>
      </div>
      <h3 className='text-xl mb-2'>Answers</h3>
      {answers.length > 0 ? (
        <ul>
          {answers.map((answer) => (
            <li key={answer.id} className='mb-4 border-b pb-2'>
              <p>{answer.content}</p>
              <p className='text-sm text-gray-500'>
                Answered by {answer.user.username} on{' '}
                {new Date(answer.created_at).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No answers yet.</p>
      )}
      {showAnswerModal && (
        <AnswerModal
          onClose={() => setShowAnswerModal(false)}
          onSubmit={handleSubmitAnswer}
        />
      )}
    </div>
  );
};
