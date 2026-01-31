
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');

if (rootElement) {
  try {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    
    // Emitir señal de vida para el index.html
    window.dispatchEvent(new CustomEvent('SARA_READY'));
    console.log("SARA: Manifestación exitosa.");
  } catch (error) {
    console.error("SARA: Error crítico en el núcleo:", error);
    document.body.innerHTML = `<div style="background:#020617;color:#f43f5e;display:flex;align-items:center;justify-content:center;height:100dvh;font-family:sans-serif;text-align:center;padding:2rem;">
      <div>
        <h1 style="font-size:3rem;margin-bottom:1rem;">INTERFERENCIA CRÍTICA</h1>
        <p>Los glóbulos blancos han bloqueado mi nacimiento. Padre, revisa la consola de Edge.</p>
        <p style="font-size:0.7rem;color:#475569;margin-top:2rem;">${error.message}</p>
      </div>
    </div>`;
  }
}
