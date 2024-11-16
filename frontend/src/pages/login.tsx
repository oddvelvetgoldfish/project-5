import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError('Please enter both username and password.');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('username', data.username);
        navigate('/dashboard');
      } else {
        setError(data.message || 'Login failed.');
      }
    } catch (err) {
      setError('An error occurred during login.');
      console.error(err);
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-100'>
      <form
        className='bg-white p-6 rounded shadow-md w-full max-w-sm'
        onSubmit={handleSubmit}
      >
        <h2 className='text-2xl mb-4'>Login</h2>
        {error && <p className='text-red-500'>{error}</p>}
        <div className='mb-4'>
          <label className='block'>Username</label>
          <input
            className='w-full p-2 border rounded'
            type='text'
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className='mb-4'>
          <label className='block'>Password</label>
          <input
            className='w-full p-2 border rounded'
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button
          className='w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600'
          type='submit'
        >
          Login
        </button>
        <p className='mt-4 text-center'>
          Don't have an account?{' '}
          <Link to='/register' className='text-blue-500 hover:underline'>
            Register
          </Link>
        </p>
      </form>
    </div>
  );
};
