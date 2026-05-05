import { useState } from 'react';
import classes from './AuthForm.module.css';
import { useAuth } from '../../store/auth-context';

const AuthForm = () => {
  const { login } = useAuth();
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

    let url;

    if (isLogin) {
      url =
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.REACT_APP_FIREBASE_API_KEY}`;
    } else {
      url =
        `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${process.env.REACT_APP_FIREBASE_API_KEY}`;
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: enteredEmail,
          password: enteredPassword,
          returnSecureToken: true,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error.message || 'Authentication failed!');
      }

      console.log("ID TOKEN:", data.idToken);

      console.log("ID TOKEN:", data.idToken);

// store token
localStorage.setItem('token', data.idToken);

// VERY IMPORTANT (THIS FIXES YOUR TASK)
login(data.idToken, data.localId);

alert("Authentication Successful!");

    } catch (err) {
      alert(err.message);
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