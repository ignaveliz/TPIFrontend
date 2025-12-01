import { createContext, useState } from 'react';
import { login } from '../services/login';
import { register } from '../services/register';

const AuthContext = createContext();

function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const token = localStorage.getItem('token');

    return Boolean(token);
  });

  const [role, setRole] = useState(() => {
    return localStorage.getItem('role');
  });

  const [userID, setUserID] = useState(() => {
    return localStorage.getItem('userID');
  });

  const singout = () => {
    localStorage.clear();
    setRole(null);
    setIsAuthenticated(false);
    setUserID(null);
  };

  const singin = async (username, password) => {
    const { data, role, userID, error } = await login(username, password);

    if (error) {
      return { error };
    }

    localStorage.setItem('token', data);
    localStorage.setItem('role', role);
    localStorage.setItem('userID', userID);
    setIsAuthenticated(true);
    setRole(role);
    setUserID(userID);

    return { error: null, role, userID };
  };

  const signup = async (username, email, role, password) => {
    const { data, userID, error } = await register(username, email, role, password);

    if (error) {
      return { error };
    }

    localStorage.setItem('token', data);
    localStorage.setItem('role', role);
    localStorage.setItem('userID', userID);
    setIsAuthenticated(true);
    setRole(role);
    setUserID(userID);

    return { error: null, role, userID };
  };

  return (
    <AuthContext.Provider
      value={ {
        isAuthenticated,
        role,
        userID,
        signup,
        singin,
        singout,
      } }
    >
      {children}
    </AuthContext.Provider>
  );
};

export {
  AuthProvider,
  AuthContext,
};
