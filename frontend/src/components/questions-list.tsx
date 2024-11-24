import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Answer, Question } from '../types';
import { fetchQuestion } from '../api';

interface QuestionsListProps {
  questions: Question[];
}

export const QuestionsList: React.FC<QuestionsListProps> = ({ questions }) => {
  const [answers, setAnswers] = useState<Answer[]>([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    questions.map(async (question) => {
      try {
        const { answers } = await fetchQuestion(question.id, token!);
        // deduplicate answers
        setAnswers((prevAnswers) => [
          ...prevAnswers,
          ...answers.filter(
            (answer) => !prevAnswers.some((a) => a.id === answer.id)
          ),
        ]);
      } catch (err) {
        console.error('Error fetching answers:', err);
      }
    });
  }, [questions, token]);

  return (
    <ul>
      {questions.map((question) => {
        const questionAnswers = answers.filter(
          (answer) => answer.questionId === question.id
        );

        return (
          <li key={question.id} className='mb-4 border-b pb-2'>
            <Link
              to={`/question/${question.id}`}
              className='text-blue-500 hover:underline text-lg'
            >
              {question.content}
            </Link>
            <p className='text-sm text-gray-500'>
              Asked by {question.user.username} on{' '}
              {new Date(question.createdAt).toLocaleString()}
            </p>
            <p className='text-sm text-gray-500'>
              {questionAnswers.length} answer
              {questionAnswers.length !== 1 ? 's' : ''}
            </p>
          </li>
        );
      })}
    </ul>
  );
};
