import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Categories } from '../components/categories';
import { QuestionsList } from '../components/questions-list';
import { fetchCategories, fetchQuestionsByCategory } from '../api';
import { Category, Question } from '../types';

export const Dashboard = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [questions, setQuestions] = useState<Question[]>([]);
  const [error, setError] = useState<string | null>(null);

  const username = localStorage.getItem('username');
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const { categoryId } = useParams<{ categoryId: string }>();

  useEffect(() => {
    if (!token) {
      setError('User is not authenticated');
      navigate('/');
      return;
    }

    const loadCategories = async () => {
      try {
        const categories = await fetchCategories(token);
        setCategories(categories);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError('Failed to load categories.');
      }
    };

    loadCategories();
  }, [token, navigate]);

  useEffect(() => {
    if (categoryId && token) {
      const selected = categories.find(
        (category) => category.id === Number(categoryId)
      );
      if (selected) {
        setSelectedCategory(selected);
        fetchQuestionsByCategory(selected.id, token)
          .then((questions) => setQuestions(questions))
          .catch((err) => {
            console.error('Error fetching questions:', err);
            setError('Failed to load questions.');
          });
      }
    }
  }, [categoryId, categories, token]);

  const handleCategorySelect = (category: Category | null) => {
    if (!category) {
      setSelectedCategory(null);
      setQuestions([]);
      navigate('/dashboard');
      return;
    }
    navigate(`/dashboard/${category.id}`);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const handleNewQuestion = () => {
    if (selectedCategory) navigate(`/new-question/${selectedCategory.id}`);
  };

  return (
    <div className='flex h-screen'>
      <aside className='w-64 bg-gray-200 p-4 overflow-y-auto'>
        <button
          className='text-xl font-semibold mb-4'
          onClick={() => {
            handleCategorySelect(null);
          }}
        >
          Categories
        </button>
        {/* <h2 className='text-xl font-semibold mb-4'>Categories</h2> */}
        {error && <p className='text-red-500'>{error}</p>}
        <Categories
          categories={categories}
          selectedCategoryId={selectedCategory?.id}
          onSelect={handleCategorySelect}
        />
      </aside>
      <main className='flex-1 p-4 overflow-y-auto'>
        <div className='flex justify-between items-center mb-4'>
          <h1 className='text-2xl font-semibold'>TechTalk</h1>
          <div>
            <span className='mr-4'>Welcome, {username}</span>
            <button
              className='text-blue-500 hover:underline'
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>
        {selectedCategory ? (
          <>
            <div className='flex justify-between items-center mb-4'>
              <h2 className='text-xl font-semibold'>
                {selectedCategory.name} - Questions
              </h2>
              <button
                className='bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600'
                onClick={handleNewQuestion}
              >
                New Question
              </button>
            </div>
            <QuestionsList questions={questions} />
          </>
        ) : (
          <p>Select a category to view its questions.</p>
        )}
      </main>
    </div>
  );
};
