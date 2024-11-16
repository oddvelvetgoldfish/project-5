import { Routes, Route } from 'react-router-dom';
import { Register } from './pages/register';
import { Login } from './pages/login';
import { Dashboard } from './pages/dashboard';

export const App = () => {
  return (
    <Routes>
      <Route path='/' element={<Login />} />
      <Route path='register' element={<Register />} />
      <Route path='dashboard' element={<Dashboard />} />
    </Routes>
  );
};
