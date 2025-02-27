import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import app from './App.module.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <body>
      <App />
    </body>
  </StrictMode>,
)
