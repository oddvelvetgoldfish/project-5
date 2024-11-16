import React from 'react';
import { Link } from 'react-router-dom';

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

interface QuestionsListProps {
  questions: Question[];
}

export const QuestionsList: React.FC<QuestionsListProps> = ({ questions }) => {
  return (
    <ul>
      {questions.map((question) => (
        <li key={question.id} className='mb-4 border-b pb-2'>
          <Link
            to={`/question/${question.id}`}
            className='text-blue-500 hover:underline text-lg'
          >
            {question.content}
          </Link>
          <p className='text-sm text-gray-500'>
            Asked by {question.user.username} on{' '}
            {new Date(question.created_at).toLocaleString()}
          </p>
        </li>
      ))}
    </ul>
  );
};
