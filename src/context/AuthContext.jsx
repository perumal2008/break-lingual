import React, { createContext, useState, useContext } from 'react';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = (userData) => {
    if (typeof userData === 'string') {
      setUser({ email: userData, name: userData.split('@')[0] });
    } else {
      setUser({ email: userData.email, name: userData.name || userData.email.split('@')[0] });
    }
  };
  
  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
