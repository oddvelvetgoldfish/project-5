import { Routes, Route } from 'react-router-dom';
import { Register } from './pages/register';
import { Login } from './pages/login';
import { Dashboard } from './pages/dashboard';
import { PrivateRoute } from './components/protected-route';
import { NewQuestion } from './pages/new-question';
import { QuestionView } from './pages/question-view';

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
      <Route path='question'>
        <Route
          path=':id'
          element={
            <PrivateRoute>
              <QuestionView />
            </PrivateRoute>
          }
        />
      </Route>
      <Route path='new-question'>
        <Route
          path=':categoryId'
          element={
            <PrivateRoute>
              <NewQuestion />
            </PrivateRoute>
          }
        />
      </Route>
    </Routes>
  );
};
