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

  const singout = () => {
    localStorage.clear();
    setRole(null);
    setIsAuthenticated(false);
  };

  const singin = async (username, password) => {
    const { data, role, error } = await login(username, password);

    if (error) {
      return { error };
    }

    localStorage.setItem('token', data);
    localStorage.setItem('role', role);
    setIsAuthenticated(true);
    setRole(role);

    return { error: null, role };
  };

  const signup = async (username, email, role, password) => {
    const { data, error } = await register(username, email, role, password);

    if (error) {
      return { error };
    }

    localStorage.setItem('token', data);
    localStorage.setItem('role', role);
    setIsAuthenticated(true);
    setRole(role);

    return { error: null, role };
  };

  return (
    <AuthContext.Provider
      value={ {
        isAuthenticated,
        role,
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
