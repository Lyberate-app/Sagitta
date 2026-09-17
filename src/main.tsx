import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

async function bootstrap() {
  // Activar MSW por defecto (para Cloudflare Pages y desarrollo) a menos que se declare explícitamente VITE_USE_MOCKS=false
  const enableMocks = import.meta.env.VITE_USE_MOCKS !== 'false'
  if (enableMocks) {
    try {
      const { worker } = await import('./mocks/browser')
      await worker.start({
        onUnhandledRequest: 'bypass', // no lanza error para assets
      })
      console.info('[MSW] Mocks activos — API interceptada')
    } catch (err) {
      console.warn('[MSW] No se pudo iniciar el worker de MSW:', err)
    }
  }

  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  )
}

bootstrap()

