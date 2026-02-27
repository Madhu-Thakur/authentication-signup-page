import { useState, useRef } from 'react';
import { useAuth } from '../../store/auth-context';

import classes from './AuthForm.module.css';

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const emailInputRef = useRef();
  const passwordInputRef = useRef();

  const { login, setLoading, setError: setAuthError } = useAuth();

  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
    setError(null);
  };

  const submitHandler = async (event) => {
    event.preventDefault();

    const enteredEmail = emailInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;

    // Basic validation
    if (!enteredEmail || !enteredPassword) {
      setError('Please enter both email and password.');
      return;
    }

    if (enteredPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setLoading(true);

    try {
      const response = await fetch('/api/auth', {
        method: isLogin ? 'POST' : 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: enteredEmail,
          password: enteredPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Authentication failed');
      }

      if (isLogin) {
        login('dummy-token-' + Date.now(), 'user-' + Date.now());
      } else {
        
        setIsLogin(true);
      }

    } catch (error) {
      setError(error.message || 'Something went wrong!');
      setAuthError(error.message);
    } finally {
      setIsLoading(false);
      setLoading(false);
    }
  };

  return (
    <section className={classes.auth}>
      <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
      {error && <p className={classes.error}>{error}</p>}
      <form onSubmit={submitHandler}>
        <div className={classes.control}>
          <label htmlFor='email'>Your Email</label>
          <input 
            type='email' 
            id='email' 
            required 
            ref={emailInputRef}
            disabled={isLoading}
          />
        </div>
        <div className={classes.control}>
          <label htmlFor='password'>Your Password</label>
          <input
            type='password'
            id='password'
            required
            minLength='6'
            ref={passwordInputRef}
            disabled={isLoading}
          />
        </div>
        <div className={classes.actions}>
          {!isLoading && (
            <button type='submit'>
              {isLogin ? 'Login' : 'Create Account'}
            </button>
          )}
          {isLoading && <p>Authenticating...</p>}
          <button
            type='button'
            className={classes.toggle}
            onClick={switchAuthModeHandler}
            disabled={isLoading}
          >
            {isLogin ? 'Create new account' : 'Login with existing account'}
          </button>
        </div>
      </form>
    </section>
  );
};

export default AuthForm;
