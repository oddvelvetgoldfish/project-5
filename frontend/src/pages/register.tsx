import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

interface Errors {
  username?: string;
  password?: string;
  confirmPassword?: string;
  general?: string;
}

export const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<Errors>({});
  const navigate = useNavigate();

  const validate = () => {
    const newErrors: Errors = {};
    if (!username) newErrors.username = 'Username is required.';
    if (!password) newErrors.password = 'Password is required.';
    if (password.length < 6)
      newErrors.password = 'Password must be at least 6 characters.';
    if (password !== confirmPassword)
      newErrors.confirmPassword = 'Passwords do not match.';
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    try {
      const response = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          password,
          confirmPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        navigate('/');
      } else {
        setErrors({ general: data.message || 'Registration failed.' });
      }
    } catch (err) {
      setErrors({ general: 'An error occurred during registration.' });
      console.error(err);
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-100'>
      <form
        className='bg-white p-6 rounded shadow-md w-full max-w-sm'
        onSubmit={handleSubmit}
      >
        <h2 className='text-2xl mb-4'>Register</h2>
        {errors.general && <p className='text-red-500'>{errors.general}</p>}
        <div className='mb-4'>
          <label className='block'>Username</label>
          <input
            className={`w-full p-2 border rounded ${
              errors.username ? 'border-red-500' : ''
            }`}
            type='text'
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              if (errors.username)
                setErrors({ ...errors, username: undefined });
            }}
          />
          {errors.username && (
            <p className='text-red-500 text-sm'>{errors.username}</p>
          )}
        </div>
        <div className='mb-4'>
          <label className='block'>Password</label>
          <input
            className={`w-full p-2 border rounded ${
              errors.password ? 'border-red-500' : ''
            }`}
            type='password'
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (errors.password)
                setErrors({ ...errors, password: undefined });
            }}
          />
          {errors.password && (
            <p className='text-red-500 text-sm'>{errors.password}</p>
          )}
        </div>
        <div className='mb-4'>
          <label className='block'>Confirm Password</label>
          <input
            className={`w-full p-2 border rounded ${
              errors.confirmPassword ? 'border-red-500' : ''
            }`}
            type='password'
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              if (errors.confirmPassword)
                setErrors({ ...errors, confirmPassword: undefined });
            }}
          />
          {errors.confirmPassword && (
            <p className='text-red-500 text-sm'>{errors.confirmPassword}</p>
          )}
        </div>
        <button
          className='w-full bg-green-500 text-white p-2 rounded hover:bg-green-600'
          type='submit'
        >
          Register
        </button>
        <p className='mt-4 text-center'>
          Already have an account?{' '}
          <Link to='/' className='text-blue-500 hover:underline'>
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};
