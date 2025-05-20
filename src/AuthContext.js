import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [role, setRole] = useState(null);

  // login function checks a provided code against our hard-coded values
  const login = (code) => {
    if (code === 'EDIT123') {
      setRole('editor');
      return true;
    } else if (code === 'VIEW456') {
      setRole('viewer');
      return true;
    } else {
      return false;
    }
  };

  const logout = () => setRole(null);
  

  return (
    <AuthContext.Provider value={{ role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
