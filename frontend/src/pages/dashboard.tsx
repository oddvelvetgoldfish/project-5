import { useNavigate } from 'react-router-dom';

export const Dashboard = () => {
  const username = localStorage.getItem('username');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <div className='flex h-screen'>
      <aside className='w-64 bg-gray-200 p-4 overflow-y-auto'>
        <h2 className='text-xl font-semibold mb-4'>Categories</h2>
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

        <p>Select a category to view its questions.</p>
      </main>
    </div>
  );
};
