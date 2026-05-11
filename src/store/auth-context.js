import { createContext, useContext, useReducer, useEffect } from 'react';

const AuthContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        isLoggedIn: true,
        token: action.payload.token,
        userId: action.payload.userId,
      };

    case 'LOGOUT':
      return {
        ...state,
        isLoggedIn: false,
        token: null,
        userId: null,
      };

    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };

    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const initialState = {
    isLoggedIn: false,
    token: null,
    userId: null,
    isLoading: false,
    error: null,
  };

  const [authState, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  // const login = (token, userId) => {
  //   localStorage.setItem('token', token);
  //   localStorage.setItem('userId', userId);

  //   dispatch({
  //     type: 'LOGIN',
  //     payload: { token, userId },
  //   });
  // };

const login = (token, userId) => {

  const currentTime = new Date().getTime();

  const expirationTime = currentTime + 5 * 60 * 1000;

  localStorage.setItem('token', token);
  localStorage.setItem('userId', userId);
  localStorage.setItem('expirationTime', expirationTime);

  dispatch({
    type: 'LOGIN',
    payload: { token, userId },
  });

  setTimeout(() => {
    logout();
  }, 5 * 60 * 1000);
};

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('expirationTime');

    dispatch({ type: 'LOGOUT' });
  };

  const setLoading = (isLoading) => {
    dispatch({
      type: 'SET_LOADING',
      payload: isLoading,
    });
  };

  const setError = (error) => {
    dispatch({
      type: 'SET_ERROR',
      payload: error,
    });
  };

const checkAuthStatus = async () => {

  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');
  const expirationTime = localStorage.getItem('expirationTime');

  const currentTime = new Date().getTime();

  if (currentTime > expirationTime) {

    logout();

    return;
  }

  if (!token) {
    return;
  }

  try {

    const response = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${process.env.REACT_APP_FIREBASE_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idToken: token,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error.message || 'Authentication failed!');
    }

    dispatch({
      type: 'LOGIN',
      payload: { token, userId },
    });

  } catch (error) {

    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('expirationTime');

    dispatch({ type: 'LOGOUT' });
  }
};

  const value = {
    ...authState,
    login,
    logout,
    setLoading,
    setError,
    checkAuthStatus,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};