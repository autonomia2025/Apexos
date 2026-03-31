import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './styles/globals.css';
import FontFaceObserver from 'fontfaceobserver';

// Wait for fonts to load before rendering the app to avoid CLS and FOUT,
// especially with Playfair Display layout shifts.
const loadFonts = async () => {
  const dmSans = new FontFaceObserver('DM Sans');
  const playfair = new FontFaceObserver('Playfair Display');

  try {
    await Promise.all([dmSans.load(), playfair.load()]);
  } catch (e) {
    console.warn('Fonts failed to load', e);
  }
};

loadFonts().finally(() => {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
});
