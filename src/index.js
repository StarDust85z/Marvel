import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { HelmetProvider } from 'react-helmet-async'

import store from './store';
import App from './components/app/App';

import './style/style.scss';

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <HelmetProvider>
        <Router>
          <App />
        </Router>
      </HelmetProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);