import React, { useEffect } from 'react';
import { Provider, useDispatch } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import store from './app/store.js';
import AppRoutes from './routes/AppRoutes.jsx';
import { checkAuthSession } from './features/auth/authThunks.js';
import { resetAuthState } from './features/auth/authSlice.js';
import './styles/globals.css';

const AppContent = () => {
  const dispatch = useDispatch();

  // Check auth session validity on app mount only if companion cookie is present
  useEffect(() => {
    const hasCookie = document.cookie.split(';').some(c => c.trim().startsWith('logged_in='));
    if (hasCookie) {
      dispatch(checkAuthSession());
    } else {
      dispatch(resetAuthState());
    }
  }, [dispatch]);

  return <AppRoutes />;
};

export const App = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </Provider>
  );
};

export default App;
