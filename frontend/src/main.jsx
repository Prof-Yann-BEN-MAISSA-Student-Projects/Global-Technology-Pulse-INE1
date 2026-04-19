import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import EspaceVisualisation from './EspaceVisualisation.jsx'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}></Route>
        <Route path="/espace-visualisation/:nomProjet" element={<EspaceVisualisation />}></Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
