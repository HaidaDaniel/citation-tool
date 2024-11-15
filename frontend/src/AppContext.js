import React, { createContext, useState } from 'react';


export const AppContext = createContext();


export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = (userData) => {
    setUser(userData.user);
    setIsAuthenticated(true);
    localStorage.setItem('token', userData.token);
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('token');
  };

  return (
    <AppContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AppContext.Provider>
  );
};