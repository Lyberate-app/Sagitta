export function getDeviceInfo() {
  if (typeof window === 'undefined') {
    return { isIOS: false, isAndroid: false, isMobile: false, isStandalone: false }
  }

  const ua = window.navigator.userAgent || ''
  const isIOS =
    /iPad|iPhone|iPod/.test(ua) ||
    (window.navigator.platform === 'MacIntel' && window.navigator.maxTouchPoints > 1)

  const isAndroid = /Android/i.test(ua)
  const isMobile = isIOS || isAndroid || /Mobi|Tablet/i.test(ua)

  // Detectar si ya está corriendo como app instalada (PWA standalone)
  const isStandalone =
    window.matchMedia('(display-mode: standalone)').matches ||
    Boolean((window.navigator as unknown as { standalone?: boolean }).standalone)

  return { isIOS, isAndroid, isMobile, isStandalone }
}

