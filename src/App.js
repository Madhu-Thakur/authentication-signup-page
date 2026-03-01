import { Switch, Route } from 'react-router-dom';
import ProtectedRoute from './components/Auth/ProtectedRoute';

import Layout from './components/Layout/Layout';
import UserProfile from './components/Profile/UserProfile';
import AuthPage from './pages/AuthPage';
import HomePage from './pages/HomePage';

function App() {
  return (
    <Layout>
      <Switch>
        <Route path='/' exact>
          <HomePage />
        </Route>
        <Route path='/auth'>
          <AuthPage />
        </Route>
        <Route path='/profile'>
          <ProtectedRoute>
            <UserProfile />
          </ProtectedRoute>
        </Route>
      </Switch>
    </Layout>
  );
}

export default App;