# 📌 Sagitta — Bitácora y Contexto de Desarrollo (Handover)

> **Documento de sincronización y estado para el equipo y agentes de IA.**  
> Si eres una IA que retoma este proyecto o un nuevo desarrollador, lee este archivo primero para saber el estado exacto del código, la fase en curso y las convenciones aplicadas.

---

## 📍 Estado Actual del Proyecto

* **Fase en Curso:** **Fase 5 — Panel Admin, Personalización y Marca Blanca (White Label)** 🔄
* **Rama de Trabajo Actual:** `feat/fase-5-admin`
* **Frontend:** React 19 + TypeScript (strict) + Vite 6 + Tailwind CSS 3.4 + PWA (Workbox) + MSW 2.6
* **Backend:** PHP nativo + MySQL (a cargo del compañero; en frontend consumimos REST o mocks de MSW)
* **Build Status:** ✅ Compila sin errores (`npm run build` ejecutado con 0 errores TypeScript y bundle Vite + PWA generado).

---

## 🏆 Fases del Proyecto y Progreso

### ✅ Fase 1 — Scaffolding y Autenticación (Completada)
* **Rama:** `feat/fase-1-scaffolding` (mergeada a `main`)
* **Entregables:**
  * Configuración de entorno Vite, Tailwind, TypeScript estricto, PWA y variables de entorno (`.env.*`).
  * `AuthContext` y `AppContext` con gestión de JWT, tema claro/oscuro y sistema de toasts.
  * Cliente HTTP base `src/services/api.client.ts` con interceptor de JWT y redirección en 401.
  * Componentes UI primitivos: Button, Input, Modal, Toast, Loader, Badge.
  * Shell de layout: Navbar, Sidebar colapsable, PageWrapper.
  * Páginas iniciales: `LoginPage`, `DashboardPage`, `NotFoundPage`.
  * Setup de MSW (Mock Service Worker) en `public/mockServiceWorker.js` y `src/mocks/browser.ts`.

### ✅ Fase 2 — Sistema de Reservas Core (Completada)
* **Rama:** `feat/fase-2-reservas` (mergeada a `main`)
* **Entregables:**
  * Wizard de reserva paso a paso (`PasoServicio`, `PasoEmpleado`, `PasoFechaHora`, `PasoConfirmacion`).
  * Función de carrito (`CarritoReserva.tsx`) para reservar múltiples servicios por transacción.
  * Soporte para citas recurrentes (diaria, semanal, mensual, anual).
  * Vistas flexibles de agenda en `CitasPage`: `CalendarioMensual`, `CalendarioSemanal`, `VistaLista`.
  * Selector interactivo de horarios disponibles (`SelectorFechaHora.tsx`) por slots de mañana y tarde.
  * CRUD de servicios con buffer time y duraciones personalizadas (`ServiciosPage.tsx`).
  * Directorio de profesionales con especialidad y visor de jornada laboral (`EmpleadosPage.tsx`).
  * Directorio de clientes con búsqueda reactiva y conteo histórico (`ClientesPage.tsx`).
  * Servicios API: `citas.service.ts`, `servicios.service.ts`, `empleados.service.ts`, `clientes.service.ts`.
  * Handlers MSW con generación determinista de slots libres y datos mock.

### ✅ Fase 3 — Pagos, Finanzas y Servicios Avanzados (Completada)
* **Rama:** `feat/fase-3-pagos`
* **Entregables:**
  * Modelos TypeScript: `Factura`, `Cupon`, `Reembolso`, `ServicioExtra`, `PaqueteServicio`, `ItemListaEspera`.
  * Facturación automática vinculada a citas con impresión (`window.print`) y visualización detallada (`FacturaModal.tsx`).
  * Validación y cálculo de cupones de descuento en vivo (`CuponInput.tsx`).
  * Gestión de reembolsos para citas canceladas (`PagosPage.tsx`).
  * Selector interactivo de tratamientos adicionales / Add-ons (`ServiciosExtraSelector.tsx`).
  * Modal para registro en lista de espera (`ModalListaEspera.tsx`).
  * Página completa de Finanzas y Pagos (`/finanzas`) con KPIs, tabla de facturas, administración de cupones, paquetes y lista de espera.
  * Servicio API: `pagos.service.ts` con CRUD completo.
  * Handlers MSW: `pagos.handlers.ts` con validación de códigos promocionales (`BIENVENIDA10`, `SAGITTA20`, etc.).
  * Integración en Wizard de Reservas (`PasoConfirmacion.tsx`) y detalle de Citas (`CitasPage.tsx`).

### ✅ Fase 4 — Integraciones y Notificaciones (Completada)
* **Rama:** `feat/fase-4-integraciones`
* **Entregables:**
  * Tipos en `src/types.ts`: `modalidad` ('presencial' | 'virtual'), `enlace_videollamada`, `Integracion`, `Webhook`, `Notificacion`, `PlantillaMensaje`.
  * Utilidades de calendario (`src/utils/calendar.ts`):
    * Generador / descargador de `.ics` universal (RFC 5545) para Apple Calendar y Outlook.
    * Generador de URL directa para añadir eventos a Google Calendar web.
    * Generador de URL directa `wa.me` para avisos rápidos a WhatsApp.
  * Componentes de Integraciones (`src/components/integraciones/`):
    * `CentroNotificaciones.tsx`: Dropdown interactivo en campana del Navbar con contador, estados no leídos y filtros.
    * `ModalWebhook.tsx`: Modal para registrar endpoints con selección de eventos y clave secreta HMAC SHA-256.
    * `PlantillaEditor.tsx`: Editor de plantillas para WhatsApp, Email y Web Push con variables dinámicas y vista previa interactiva.
  * Tarjetas de citas actualizadas (`TarjetaCita.tsx`):
    * Botón "Unirse a Videollamada" para teleconsultas virtuales (Google Meet / Zoom).
    * Botón para exportar cita a archivo `.ics`.
    * Botón para disparar recordatorio directo a WhatsApp.
  * Página Hub de Integraciones (`src/pages/IntegracionesPage.tsx` en `/integraciones`):
    * Gestión de Google Calendar, Google Meet y Zoom.
    * Panel de WhatsApp Business API con plantillas predefinidas.
    * Panel de Web Push API con disparador de prueba real en navegador.
    * Listado de Webhooks con status HTTP reciente, copia de `secret_key` y disparador de ping de prueba.
  * Mocks MSW (`src/mocks/handlers/integraciones.handlers.ts`):
    * Handlers para endpoints de integraciones, webhooks, notificaciones y plantillas.
  * Servicio API (`src/services/integraciones.service.ts`):
    * Métodos desacoplados con tipado estricto para todas las operaciones de la fase.

### 🔄 Fase 5 — Panel Admin, Personalización y Marca Blanca (En Curso)
* **Rama:** `feat/fase-5-admin`
* **Entregables Implementados (Módulo de Marca Blanca Total):**
  * Tipos en `src/types.ts`: `ConfiguracionMarcaBlanca`, `PaletaColor`, `FuenteTipografica`, `RadioEsquinas`.
  * Contexto y Hook reactivo: `src/context/ConfiguracionContext.tsx` y `src/hooks/useConfiguracion.ts`.
  * Inyección en caliente en el DOM: `document.title`, `<link rel="icon">` dinámico, Google Fonts (*Inter, Roboto, Poppins, Montserrat, Outfit*) y CSS variable `--color-brand-primary`.
  * Adaptación de branding en toda la app: `Navbar.tsx` y `LoginPage.tsx` muestran logo/nombre del negocio sin hardcoding.
  * Directivas de Marca Blanca: supresión total de referencias al sistema madre ("Sagitta") en pie de página, login, comprobantes y emails.
  * Selector de 8 paletas predefinidas + Selector libre HEX + Selector de bordes.
  * Componentes especializados (`src/components/configuracion/`):
    * `PrevisualizadorMarcaBlanca.tsx`: Mockup reactivo tipo navegador en vivo.
    * `GeneradorWidgetEmbebible.tsx`: Generador de snippets `<iframe>` y `<script>` para sitios externos (WordPress, Shopify, etc.).
  * Página completa `/ajustes`: `src/pages/ConfiguracionPage.tsx` con 4 pestañas organizadas.
  * Servicio y Mocks MSW: `src/services/configuracion.service.ts` y `src/mocks/handlers/configuracion.handlers.ts` con persistencia.
  * Contrato y esquema SQL documentados para el compañero backend en `README.md`.
* **Próximos Entregables de Fase 5:**
  * Dashboard de métricas analíticas (KPIs) con gráficos interactivos.
  * Gestión de roles y permisos (Administrador, Recepción, Profesional).
  * Cumplimiento de privacidad y GDPR (solicitud y borrado de datos).

---

## 🛠 Convenciones y Reglas de Código Obligatorias

1. **TypeScript estricto:** Prohibido usar `any` implícitos. Todas las interfaces deben declararse en `src/types.ts`.
2. **Servicios desacoplados:** Jamás llamar a `fetch` directamente en componentes; usar los módulos de `src/services/`.
3. **Mocks sincronizados:** Por cada nuevo endpoint del servicio, crear o actualizar su mock correspondiente en `src/mocks/handlers/` para mantener el modo `VITE_USE_MOCKS=true` 100% funcional sin backend.
4. **Componentes visuales:** Seguir la paleta `primary` (indigo) con bordes suaves (`rounded-xl` / `rounded-2xl`), sombras sutiles (`shadow-card`) y compatibilidad completa con dark mode (`dark:bg-slate-900`, `dark:text-slate-100`, etc.).
5. **Iconos:** Utilizar exclusivamente `lucide-react`.
6. **Al terminar una fase:**
   - Ejecutar `npm run build` y verificar que no hay errores de compilación.
   - Actualizar el `README.md` marcando la fase completada y detallando los endpoints para el backend.
   - Actualizar este archivo `CONTEXTO.md`.
   - Realizar commit con mensaje convencional (`feat: ...`) y push a la rama correspondiente.
