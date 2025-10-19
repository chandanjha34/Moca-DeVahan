import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { NFTProvider } from './contracts/DeVahanContext.tsx';
import { LanguageProvider } from './context/LanguageContext';
import { store } from './Redux/store.ts';
import { Provider } from 'react-redux';


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LanguageProvider>
      <Provider store={store}>
        <NFTProvider>
            <App />
        </NFTProvider>
      </Provider>
    </LanguageProvider>
  </StrictMode>
);
