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
    navigate(`/dashboard/${question?.categoryId}`);
  };

  if (!question) {
    return <p>Loading...</p>;
  }

  return (
    <div className='min-h-screen bg-gray-100 p-6'>
      <button
        onClick={handleBack}
        className='mb-6 text-blue-500 hover:underline text-lg'
      >
        &larr; Back to Dashboard
      </button>
      <div className='bg-white p-6 rounded-lg shadow-lg border mb-6'>
        <h2 className='text-3xl font-semibold mb-4'>{question.content}</h2>
        <p className='text-sm text-gray-600'>
          Asked by{' '}
          <span className='font-semibold'>{question.user.username}</span> on{' '}
          {new Date(question.createdAt).toLocaleString()}
        </p>
        <button
          className='mt-6 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600'
          onClick={() => setShowAnswerModal(true)}
        >
          Answer
        </button>
      </div>
      {error && <p className='text-red-500 mb-4'>{error}</p>}
      <h3 className='text-2xl font-semibold mb-4'>Answers</h3>
      {answers.length > 0 ? (
        <ul className='space-y-4'>
          {answers.map((answer, index) => (
            <li
              key={answer.id}
              className={`p-4 rounded-lg ${
                index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
              } border shadow-sm`}
            >
              <p className='text-gray-800'>{answer.content}</p>
              <p className='text-sm text-gray-500 mt-2'>
                Answered by{' '}
                <span className='font-semibold'>{answer.user.username}</span> on{' '}
                {new Date(answer.createdAt).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p className='text-gray-600'>No answers yet. Be the first to answer!</p>
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
