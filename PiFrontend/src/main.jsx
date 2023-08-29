import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { PropertiesProvider } from './context/propertiesConstext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <PropertiesProvider>
      <App />
    </PropertiesProvider>
  </React.StrictMode>,
)
