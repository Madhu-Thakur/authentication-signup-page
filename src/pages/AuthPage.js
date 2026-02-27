import { useState } from 'react';
import { auth } from '../firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';

import classes from '../components/Auth/AuthForm.module.css';

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
  };

  const submitHandler = async (event) => {
    event.preventDefault();

    const enteredEmail = event.target.email.value;
    const enteredPassword = event.target.password.value;

    setIsLoading(true);
    setError(null);

    try {
      if (isLogin) {
        // LOGIN
        await signInWithEmailAndPassword(
          auth,
          enteredEmail,
          enteredPassword
        );
      } else {
        // SIGN UP
        await createUserWithEmailAndPassword(
          auth,
          enteredEmail,
          enteredPassword
        );
      }

      alert("Authentication Successful!");
    } catch (err) {
      setError(err.message);
    }

    setIsLoading(false);
  };

  return (
    <section className={classes.auth}>
      <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>

      <form onSubmit={submitHandler}>
        <div className={classes.control}>
          <label htmlFor='email'>Your Email</label>
          <input type='email' id='email' required />
        </div>

        <div className={classes.control}>
          <label htmlFor='password'>Your Password</label>
          <input type='password' id='password' required />
        </div>

        <div className={classes.actions}>
          {!isLoading && (
            <button>
              {isLogin ? 'Login' : 'Create Account'}
            </button>
          )}

          {isLoading && <p>Sending request...</p>}

          {error && <p style={{ color: 'red' }}>{error}</p>}

          <button
            type='button'
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          >
            {isLogin
              ? 'Create new account'
              : 'Login with existing account'}
          </button>
        </div>
      </form>
    </section>
  );
};

export default AuthForm;