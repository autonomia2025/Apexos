import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import './styles/globals.css';

console.log('App mounting started...');

window.onerror = (msg, _url, _lineNo, _columnNo, error) => {
  console.error('GLOBAL ERROR:', msg, error);
  document.body.innerHTML = `<div style="background:red; color:white; padding:20px;">ERROR: ${msg}</div>`;
  return false;
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
