# 📌 Sagitta — Bitácora y Contexto de Desarrollo (Handover)

> **Documento de sincronización y estado para el equipo y agentes de IA.**  
> Si eres una IA que retoma este proyecto o un nuevo desarrollador, lee este archivo primero para saber el estado exacto del código, la fase en curso y las convenciones aplicadas.

---

## 📍 Estado Actual del Proyecto

* **Fase en Curso:** **Fase 3 — Pagos, Finanzas y Servicios Avanzados** 🔄
* **Rama de Trabajo Activa:** `feat/fase-3-pagos`
* **Frontend:** React 19 + TypeScript (strict) + Vite 6 + Tailwind CSS 3.4 + PWA (Workbox) + MSW 2.6
* **Backend:** PHP nativo + MySQL (a cargo del compañero; en frontend consumimos REST o mocks de MSW)
* **Build Status:** ✅ Compila sin errores (`npm run build` ejecutado exitosamente con Vite y TypeScript).

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

### 🔄 Fase 4 — Integraciones y Notificaciones (Próxima a Desarrollar)
* **Rama Planificada:** `feat/fase-4-integraciones`
* **Objetivos:**
  * Sincronización con Google Calendar (OAuth2 / exportación `.ics`).
  * Generación de enlaces para teleconsultas / videollamadas (Google Meet / Zoom).
  * Recordatorios por WhatsApp y Email transaccional.
  * Notificaciones Web Push vía Service Worker.
  * Historial de notificaciones y configuración de alertas.

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
