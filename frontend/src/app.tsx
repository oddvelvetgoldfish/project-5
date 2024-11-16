import { Routes, Route } from 'react-router-dom';
import { Register } from './pages/register';
import { Login } from './pages/login';

export const App = () => {
  return (
    <Routes>
      <Route path='/' element={<Login />} />
      <Route path='register' element={<Register />} />
    </Routes>
  );
};
