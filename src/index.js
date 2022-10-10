// import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { HelmetProvider } from 'react-helmet-async'

import store from './store';
import App from './components/app/App';

import './style/style.scss';

const root = createRoot(document.getElementById('root'))

root.render(
  <Provider store={store}>
    <HelmetProvider>
      <Router>
        <App />
      </Router>
    </HelmetProvider>
  </Provider>
)