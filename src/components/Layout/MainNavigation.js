import { Link, useHistory } from 'react-router-dom';

import classes from './MainNavigation.module.css';

const MainNavigation = () => {
  const history = useHistory();

  const logoutHandler = () => {

    localStorage.removeItem('token');

    history.replace('/auth');
  };

  const token = localStorage.getItem('token');

  const isLoggedIn = !!token;

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
              <button onClick={logoutHandler}>
                Logout
              </button>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default MainNavigation;