import React from 'react';
import AppRoutes from './routes/AppRoutes';
import { AuthProvider } from './context/AuthContext';
import TimeTracker from './components/common/TimeTracker';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <TimeTracker />
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
