import { Routes, Route } from 'react-router-dom';
import { Register } from './pages/register';
import { Login } from './pages/login';
import { Dashboard } from './pages/dashboard';
import { PrivateRoute } from './components/protected-route';

export const App = () => {
  return (
    <Routes>
      <Route path='/' element={<Login />} />
      <Route path='register' element={<Register />} />
      <Route
        path='dashboard'
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
    </Routes>
  );
};
