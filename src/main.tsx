import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import AppStable from './AppStable.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppStable />
  </StrictMode>,
)
