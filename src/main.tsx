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
      await Promise.race([
        worker.start({
          onUnhandledRequest: 'bypass', // no lanza error para assets
        }),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('MSW timeout (arranque seguro)')), 1200)
        ),
      ])
      console.info('[MSW] Mocks activos — API interceptada')
    } catch (err) {
      console.warn('[MSW] Fallback local activo (worker no iniciado o excedió tiempo):', err)
    }
  }

  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  )
}

bootstrap()

