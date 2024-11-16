import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Categories } from '../components/categories';
import { QuestionsList } from '../components/questions-list';

interface Category {
  id: number;
  name: string;
}
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

export const Dashboard = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [questions, setQuestions] = useState<Question[]>([]);

  const username = localStorage.getItem('username');
  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          'http://localhost:3000/api/questions/categories/all',
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await response.json();
        setCategories(data);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };
    fetchCategories();
  }, [token]);

  const handleCategorySelect = async (category: Category) => {
    setSelectedCategory(category);
    try {
      const response = await fetch(
        `http://localhost:3000/api/questions/category/${category.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await response.json();
      setQuestions(data);
    } catch (err) {
      console.error('Error fetching questions:', err);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <div className='flex h-screen'>
      <aside className='w-64 bg-gray-200 p-4 overflow-y-auto'>
        <h2 className='text-xl font-semibold mb-4'>Categories</h2>
        <Categories categories={categories} onSelect={handleCategorySelect} />
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
