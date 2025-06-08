import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './integrated.css'
import CyberMDApp from './CyberMDApp.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CyberMDApp />
  </StrictMode>,
)
