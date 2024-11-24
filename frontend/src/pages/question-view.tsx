import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AnswerModal } from '../components/answer-modal';
import { fetchQuestion, submitAnswer } from '../api';
import { Answer, Question } from '../types';

export const QuestionView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [question, setQuestion] = useState<Question | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [showAnswerModal, setShowAnswerModal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    if (!id || !token) {
      setError('Invalid question ID or missing authentication');
      navigate('/');
      return;
    }

    const loadQuestion = async () => {
      try {
        const data = await fetchQuestion(id, token);
        setQuestion(data.question);
        setAnswers(data.answers);
        setError(null); // Clear any previous errors
      } catch (err) {
        console.error('Error fetching question:', err);
        setError('Failed to load question');
      }
    };

    loadQuestion();
  }, [id, token, navigate]);

  const handleSubmitAnswer = async (content: string) => {
    if (!content.trim()) {
      alert('Answer cannot be empty.');
      return;
    }

    try {
      await submitAnswer(id!, content, token!);
      const { answers } = await fetchQuestion(id!, token!);
      setAnswers(answers);
      setShowAnswerModal(false);
    } catch (err) {
      console.error('Error submitting answer:', err);
      alert('Failed to submit answer.');
    }
  };

  const handleBack = () => {
    navigate(`/dashboard/${question?.category_id}`);
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
      {error && <p className='text-red-500 mb-4'>{error}</p>}{' '}
      {/* Error Message */}
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
