
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { UserDataProvider } from './context/userData'
import { LanguageProvider } from './context/LanguageContext'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <LanguageProvider>
        <UserDataProvider>
          <App />
        </UserDataProvider>
      </LanguageProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
