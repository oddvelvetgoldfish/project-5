import { Routes, Route } from 'react-router-dom';
import { Register } from './pages/register';

export const App = () => {
  return (
    <Routes>
      <Route path='/' element={<Register />} />
    </Routes>
  );
};
