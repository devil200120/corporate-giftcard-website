import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { BrowserRouter } from 'react-router-dom';
import 'react-image-gallery/styles/css/image-gallery.css';

import App from './App';
import store, { persistor } from './store/store';
import ErrorBoundary from './components/common/ErrorBoundary';
import Loading from './components/common/Loading';

import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <Provider store={store}>
        <PersistGate loading={<Loading />} persistor={persistor}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </PersistGate>
      </Provider>
    </ErrorBoundary>
  </React.StrictMode>
);
