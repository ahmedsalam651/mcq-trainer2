import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register(new URL('/service-worker.js', import.meta.url));
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
