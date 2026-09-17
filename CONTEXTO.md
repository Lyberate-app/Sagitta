# 📌 Sagitta — Bitácora y Contexto de Desarrollo (Handover)

> **Documento de sincronización y estado para el equipo y agentes de IA.**  
> Si eres una IA que retoma este proyecto o un nuevo desarrollador, lee este archivo primero para saber el estado exacto del código, la fase en curso y las convenciones aplicadas.

---

## 📍 Estado Actual del Proyecto

* **Fase en Curso:** **Fase 6 — Escalabilidad, Multi-Tenant, i18n y CRM** ✅ (Completada)
* **Rama de Trabajo Actual:** `feat/fase-6-crm`
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

### ✅ Fase 5 — Panel Admin, Personalización y Marca Blanca (Completada)
* **Rama:** `feat/fase-5-admin`
* **Entregables Implementados:**
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

### ✅ Fase 6 — Escalabilidad, Multi-Tenant, i18n y CRM (Completada)
* **Rama:** `feat/fase-6-crm`
* **Entregables:**
  * Tipos en `src/types.ts`: `Tenant`, `TenantPlan`, `Idioma`, `CrmProvider`, `CrmConfig`, `ApiKey`, `AuditLog`.
  * Sistema Multi-Sucursal / Multi-Tenant (`src/context/TenantContext.tsx` & `src/hooks/useTenant.ts`):
    * Gestión de sedes/franquicias activas con persistencia en `localStorage`.
    * Distinción de planes por sucursal (`free`, `pro`, `enterprise`) y badges visuales.
  * Motor de Internacionalización Reactivo i18n (`src/context/I18nContext.tsx` & `src/hooks/useI18n.ts`):
    * Sin dependencias externas pesadas, 100% tipado con soporte de interpolación `t('key', { name })`.
    * 4 idiomas con banderas y formatos de fecha: Español 🇪🇸 (`es`), English 🇺🇸 (`en`), Português 🇧🇷 (`pt`), Français 🇫🇷 (`fr`).
  * Componentes UI (`src/components/crm/`):
    * `TenantSelector.tsx`: Dropdown en el Navbar para conmutar sede con indicador de estado y plan.
    * `I18nSelector.tsx`: Selector de idioma con bandera y cambio instantáneo en caliente.
    * `ModalApiKey.tsx`: Modal para generar tokens de desarrollador con selección de permisos (`read:citas`, `write:citas`, `read:clientes`, `write:pagos`, `admin`) y copia segura de token único.
    * `VisorOpenApi.tsx`: Consola interactiva OpenAPI v3.0 / Swagger embebida para probar endpoints, headers de autenticación, payloads y generar comandos `cURL` listos para terminal.
  * Hub de Gestión `/crm` (`src/pages/CrmDesarrolladoresPage.tsx`):
    * **Pestaña Conectores CRM:** Sincronización bidireccional con HubSpot, Salesforce, Zoho CRM, ActiveCampaign y Mailchimp. Mapeo de campos, estado de sync y botón de sincronización forzada en vivo.
    * **Pestaña API Keys & Desarrolladores:** Listado de claves, estado activo/revocado, último uso, fecha de expiración y revocación inmediata.
    * **Pestaña Documentación API:** Playground interactivo con especificación OpenAPI v3.0 descargable en formato `.json`.
    * **Pestaña Auditoría & Seguridad:** Tabla de eventos de auditoría (login, updates, export, deletions) con filtros por acción/usuario, severidad y exportación directa a `.csv`.
  * Mocks MSW y Servicio API:
    * `src/services/crm.service.ts`: Métodos para tenants, conectores CRM, API keys, logs de auditoría y swagger spec.
    * `src/mocks/handlers/crm.handlers.ts`: Mocks completos para todos los endpoints con generación de tokens mock (`sk_live_...`).
  * Integración en Navegación y Shell:
    * Enlace en `Sidebar.tsx` con icono `Network` hacia `/crm`.
    * Integración de `TenantSelector` e `I18nSelector` en `Navbar.tsx`.
    * Envoltorio global con `TenantProvider` e `I18nProvider` en `src/App.tsx`.
  * Documentación para Backend:
    * Esquema MySQL para tablas `tenants`, `crm_configs`, `api_keys` y `audit_logs` documentado en `README.md`.
    * Endpoints REST para API keys y webhook/sincronización CRM detallados en `README.md`.

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
