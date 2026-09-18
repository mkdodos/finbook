import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import App from './App.jsx'

import "semantic-ui-css/semantic.min.css";
// import 'fomantic-ui-css/semantic.min.css';
import { Container } from 'semantic-ui-react';

if (import.meta.env.DEV) {
  const sysWarn = console.warn;
  console.warn = (...args) => {
    if (typeof args[0] === 'string' && args[0].includes('defaultProps')) return;
    sysWarn(...args);
  };
}


createRoot(document.getElementById('root')).render(
  // <StrictMode>
  <Container>
      <App />
  </Container>
  
  // </StrictMode>,
)
