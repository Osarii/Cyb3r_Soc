import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './styles/global.css';
import './styles/reference-polish.css';
import './styles/official-assets.css';
import './styles/ui-layer.css';
import logoLoop from './assets/branding/cybersoc-logo-loop.webm';
import aiIdle from './assets/ai/cyberai-idle.webm';

for (const href of [logoLoop, aiIdle]) {
  if (!document.head.querySelector(`link[rel="preload"][href="${href}"]`)) {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'video';
    link.type = 'video/webm';
    link.href = href;
    document.head.appendChild(link);
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode><BrowserRouter><App/></BrowserRouter></React.StrictMode>,
);
