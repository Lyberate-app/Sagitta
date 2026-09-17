import { useState, useEffect } from 'react'
import { Download, Share, X, Smartphone, PlusSquare } from 'lucide-react'
import { getDeviceInfo } from '@/utils/device'
import { Button, Modal } from '@/components/ui'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [mostrarBanner, setMostrarBanner] = useState(false)
  const [mostrarGuiaIos, setMostrarGuiaIos] = useState(false)
  const { isIOS, isStandalone } = getDeviceInfo()

  useEffect(() => {
    // Si ya está instalada o fue descartada en esta sesión, no molestar
    if (isStandalone || sessionStorage.getItem('pwa_banner_dismissed') === 'true') {
      return
    }

    // Evento de instalación en Android / Chrome
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      setMostrarBanner(true)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstall)

    // En iOS Safari no existe beforeinstallprompt, mostramos el banner tras 3 segundos
    let iosTimer: NodeJS.Timeout
    if (isIOS) {
      iosTimer = setTimeout(() => {
        setMostrarBanner(true)
      }, 3000)
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall)
      if (iosTimer) clearTimeout(iosTimer)
    }
  }, [isIOS, isStandalone])

  const handleInstalarAndroid = async () => {
    if (!deferredPrompt) return
    deferredPrompt.prompt()
    const choice = await deferredPrompt.userChoice
    if (choice.outcome === 'accepted') {
      setMostrarBanner(false)
    }
    setDeferredPrompt(null)
  }

  const handleCerrarBanner = () => {
    setMostrarBanner(false)
    sessionStorage.setItem('pwa_banner_dismissed', 'true')
  }

  if (isStandalone || !mostrarBanner) return null

  return (
    <>
      {/* Banner flotante nativo de instalación */}
      <div className="fixed top-2 left-3 right-3 sm:left-auto sm:right-4 sm:w-96 z-50 animate-in slide-in-from-top-4 duration-300">
        <div className="p-3.5 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-indigo-200 dark:border-indigo-900/50 shadow-xl flex items-center justify-between gap-3 text-left">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-md">
            {isIOS ? <Smartphone className="w-5 h-5" /> : <Download className="w-5 h-5" />}
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
              {isIOS ? 'Instalar en tu iPhone' : 'Instalar como App en tu móvil'}
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
              {isIOS
                ? 'Agrega la app a tu pantalla de inicio'
                : 'Acceso rápido y sin conexión'}
            </p>
          </div>

          <div className="flex items-center gap-1">
            {isIOS ? (
              <Button
                size="sm"
                onClick={() => setMostrarGuiaIos(true)}
                className="rounded-xl text-[11px] py-1.5 px-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold shrink-0"
              >
                Ver cómo
              </Button>
            ) : (
              <Button
                size="sm"
                onClick={handleInstalarAndroid}
                className="rounded-xl text-[11px] py-1.5 px-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold shrink-0"
              >
                Instalar
              </Button>
            )}

            <button
              onClick={handleCerrarBanner}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              aria-label="Cerrar aviso"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Modal Guía para iPhone / Safari */}
      {mostrarGuiaIos && (
        <Modal
          isOpen={true}
          onClose={() => setMostrarGuiaIos(false)}
          title="Cómo instalar en tu iPhone"
        >
          <div className="space-y-4 text-slate-800 dark:text-slate-200 text-xs">
            <p className="text-slate-500 dark:text-slate-400">
              Sigue estos 2 sencillos pasos en Safari para tener la aplicación en tu pantalla principal como cualquier app de la App Store:
            </p>

            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-sm shrink-0">
                  1
                </div>
                <div>
                  <p className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    Toca el botón Compartir
                    <Share className="w-4 h-4 text-blue-500 inline" />
                  </p>
                  <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">
                    En la barra inferior de Safari, pulsa el icono del cuadro con flecha hacia arriba.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <div className="w-8 h-8 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-sm shrink-0">
                  2
                </div>
                <div>
                  <p className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    Selecciona &quot;Añadir a pantalla de inicio&quot;
                    <PlusSquare className="w-4 h-4 text-indigo-500 inline" />
                  </p>
                  <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">
                    Baja en las opciones y toca Añadir. ¡Listo! La tendrás con su propio icono sin barras de navegación.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <Button onClick={() => setMostrarGuiaIos(false)} className="rounded-xl w-full font-bold">
                Entendido
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </>
  )
}
