import { Link } from 'react-router-dom';
import { useAuth } from '../../store/auth-context';

import classes from './MainNavigation.module.css';

const MainNavigation = () => {
  const { isLoggedIn, logout, isLoading } = useAuth();

  const logoutHandler = () => {
    logout();
  };

  return (
    <header className={classes.header}>
      <Link to='/'>
        <div className={classes.logo}>React Auth</div>
      </Link>
      <nav>
        <ul>
          {!isLoggedIn && (
            <li>
              <Link to='/auth'>Login</Link>
            </li>
          )}
          {isLoggedIn && (
            <li>
              <Link to='/profile'>Profile</Link>
            </li>
          )}
          {isLoggedIn && (
            <li>
              <button onClick={logoutHandler} disabled={isLoading}>
                {isLoading ? 'Logging out...' : 'Logout'}
              </button>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default MainNavigation;
