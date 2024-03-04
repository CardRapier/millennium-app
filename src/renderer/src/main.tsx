import './assets/main.css'

import { NextUIProvider } from '@nextui-org/react'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <NextUIProvider>
      <main className="text-foreground bg-background">
        <App />
      </main>
    </NextUIProvider>
  </React.StrictMode>
)
