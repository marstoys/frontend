import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { LanguageProvider } from './hook/useLanguage'
import { BasketProvider } from './Context/Context'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <LanguageProvider>
        <BasketProvider>
          <App />
        </BasketProvider>
      </LanguageProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
