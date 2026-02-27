import { createContext, useContext, useReducer } from 'react';

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

  const login = (token, userId) => {
    localStorage.setItem('token', token);
    localStorage.setItem('userId', userId);
    dispatch({ type: 'LOGIN', payload: { token, userId } });
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    dispatch({ type: 'LOGOUT' });
  };

  const setLoading = (isLoading) => {
    dispatch({ type: 'SET_LOADING', payload: isLoading });
  };

  const setError = (error) => {
    dispatch({ type: 'SET_ERROR', payload: error });
  };

  // Check if user is already logged in on app start
  const checkAuthStatus = () => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    if (token && userId) {
      dispatch({ type: 'LOGIN', payload: { token, userId } });
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

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};