# 📅 Sagitta — Sistema de Reservas y Citas

> Plataforma web para gestionar reservas, citas, empleados y clientes de forma profesional.  
> Diseño premium con modo oscuro, PWA instalable y conexión a API REST externa.

---

## 🧭 Índice

- [¿Qué es Sagitta?](#-qué-es-sagitta)
- [Stack tecnológico](#-stack-tecnológico)
- [Arquitectura del proyecto](#-arquitectura-del-proyecto)
- [Estructura de archivos](#-estructura-de-archivos)
- [Variables de entorno](#-variables-de-entorno)
- [Cómo correr el proyecto](#-cómo-correr-el-proyecto)
- [Sistema de mocks (MSW)](#-sistema-de-mocks-msw)
- [Plan de fases](#-plan-de-fases)
- [Flujo de trabajo Git](#-flujo-de-trabajo-git)
- [Convenciones de código](#-convenciones-de-código)
- [Equipo](#-equipo)

---

## 🚀 ¿Qué es Sagitta?

Sagitta es un sistema de reservas y citas online diseñado para negocios de servicios (salones, clínicas, consultorios, centros de bienestar, etc.). Permite:

- Reservar citas en pocos pasos seleccionando servicio, empleado y horario
- Gestionar múltiples empleados, ubicaciones y servicios
- Cobrar en línea, emitir facturas y aplicar cupones
- Sincronizar con Google Calendar y enviar recordatorios por WhatsApp
- Ver métricas del negocio en un dashboard en tiempo real

### División de responsabilidades

| Área | Responsable | Tecnología |
|------|-------------|------------|
| **Frontend** | Silvio | React 19 + TypeScript + Vite |
| **Backend** | Compañero | PHP nativo REST API + MySQL |

El frontend consume la API REST del backend mediante `fetch` con autenticación JWT. En desarrollo, los endpoints se simulan con **MSW (Mock Service Worker)** para trabajar de forma independiente.

---

## 🛠 Stack Tecnológico

### Frontend
| Tecnología | Versión | Propósito |
|-----------|---------|----------|
| React | 19 | UI reactiva con componentes |
| TypeScript | 5.6 | Tipado estricto, sin `any` implícitos |
| Vite | 6 | Bundler y servidor de desarrollo |
| Tailwind CSS | 3.4 | Estilos utilitarios + dark mode |
| react-router-dom | v6 | Enrutamiento SPA con guards |
| lucide-react | 0.460 | Iconografía consistente y ligera |
| vite-plugin-pwa | 0.21 | PWA: Service Worker + manifest |
| MSW | 2.6 | Mock de API para desarrollo offline |

### Backend (compañero)
| Tecnología | Propósito |
|-----------|----------|
| PHP nativo | REST API modular |
| MySQL | Base de datos relacional |
| JWT | Autenticación stateless |
| PDO | Conexión segura a base de datos |

---

## 🏗 Arquitectura del Proyecto

```
┌─────────────────────────┐         API REST (JSON + JWT)         ┌──────────────────────┐
│   FRONTEND (Silvio)     │  ──────────────────────────────────▶  │  BACKEND (compañero) │
│                         │                                        │                      │
│  React 19 + TypeScript  │  ◀──────────────────────────────────  │  PHP + MySQL         │
│  Vite + Tailwind + PWA  │         Respuestas JSON                │                      │
│  localhost:5173         │                                        │  localhost:8000      │
└─────────────────────────┘                                        └──────────────────────┘
           │
           │  En desarrollo (VITE_USE_MOCKS=true)
           ▼
┌─────────────────────────┐
│   MSW Service Worker    │  ← Intercepta llamadas y devuelve datos mock
│   (sin backend real)    │
└─────────────────────────┘
```

### Flujo de autenticación
```
Login → POST /api/auth/login → JWT token → localStorage
Cada request → Authorization: Bearer <token>
Token expirado → Redirige a /login automáticamente
```

---

## 📁 Estructura de Archivos

```
sagitta/
│
├── 📄 index.html                   # Entry point HTML con Inter font y meta PWA
├── 📦 package.json                 # Dependencias y scripts
├── ⚙️  vite.config.ts               # Vite: plugin React + PWA + proxy /api
├── 🎨 tailwind.config.ts           # Paleta, dark mode, animaciones
├── 🔧 tsconfig.app.json            # TypeScript strict para src/
├── 🔧 tsconfig.node.json           # TypeScript para vite.config.ts
│
├── 🌍 .env.development             # API local + mocks activados
├── 🌍 .env.production              # API real del backend
├── 📋 .env.example                 # Template para el equipo
│
├── public/
│   ├── manifest.json               # PWA: nombre, colores, iconos
│   └── mockServiceWorker.js        # Service Worker de MSW (auto-generado)
│
└── src/
    │
    ├── main.tsx                    # Bootstrap: activa MSW si VITE_USE_MOCKS=true
    ├── App.tsx                     # Router + Providers + rutas privadas/públicas
    ├── types.ts                    # Todas las interfaces TypeScript del proyecto
    ├── vite-env.d.ts               # Tipos de import.meta.env
    ├── index.css                   # Tailwind base + componentes globales + scrollbar
    │
    ├── context/
    │   ├── AuthContext.tsx         # Estado de autenticación: user, isAuthenticated, login/logout
    │   └── AppContext.tsx          # Estado global: tema (dark/light), sidebar, sistema de toasts
    │
    ├── hooks/
    │   ├── useAuth.ts              # Acceso rápido al AuthContext
    │   ├── useApi.ts               # Hook genérico con estados: data, isLoading, error
    │   └── useToast.ts             # Acceso al sistema de notificaciones toast
    │
    ├── services/
    │   └── api.client.ts           # Cliente HTTP: JWT automático, manejo 401, authService
    │
    ├── components/
    │   ├── ui/
    │   │   ├── Button.tsx          # Botón con variantes primary/secondary/ghost/danger + loading
    │   │   ├── Input.tsx           # Input con label, error, hint, iconos laterales
    │   │   ├── Modal.tsx           # Modal con backdrop blur, cierre Escape, animación
    │   │   ├── Toast.tsx           # Notificaciones success/error/warning/info
    │   │   ├── Loader.tsx          # Spinner con variante fullScreen + backdrop
    │   │   ├── Badge.tsx           # Etiquetas con colores y punto indicador
    │   │   └── index.ts            # Barrel export de todos los UI
    │   │
    │   └── layout/
    │       ├── Navbar.tsx          # Barra superior: logo, toggle sidebar, tema, usuario
    │       ├── Sidebar.tsx         # Menú lateral colapsable con NavLinks activos
    │       ├── PageWrapper.tsx     # Composición: Navbar + Sidebar + main + ToastContainer
    │       └── index.ts            # Barrel export
    │
    ├── pages/
    │   ├── LoginPage.tsx           # Login split: branding izq + formulario der
    │   ├── DashboardPage.tsx       # Dashboard con KPI cards + placeholders de fases futuras
    │   └── NotFoundPage.tsx        # Página 404 con botón de regreso
    │
    └── mocks/
        ├── browser.ts              # Setup MSW Service Worker
        └── handlers/
            ├── auth.handlers.ts    # Mock: POST /login, GET /me, POST /logout
            └── index.ts            # Agrupa todos los handlers (crece con cada fase)
```

---

## 🌍 Variables de Entorno

Copia `.env.example` y renómbralo según el entorno:

```bash
# Desarrollo — con mocks (no necesitas el backend corriendo)
VITE_API_BASE_URL=http://localhost:8000/api
VITE_USE_MOCKS=true
VITE_APP_NAME=Sagitta

# Producción — apunta a la API real del backend
VITE_API_BASE_URL=https://api.sagitta.com/api
VITE_USE_MOCKS=false
VITE_APP_NAME=Sagitta
```

> ⚠️ Los archivos `.env.development` y `.env.production` están en `.gitignore`. Nunca subas credenciales reales.

---

## 💻 Cómo Correr el Proyecto

### Requisitos
- Node.js 18+
- npm 9+

### Instalación

```bash
# 1. Clonar el repo
git clone https://github.com/Lyberate-app/Sagitta.git
cd Sagitta

# 2. Instalar dependencias
npm install

# 3. Crear archivo de entorno (copiar el ejemplo)
cp .env.example .env.development

# 4. Correr en modo desarrollo (con mocks, sin necesitar el backend)
npm run dev
# → http://localhost:5173

# Credenciales mock para probar:
# Email: admin@sagitta.com  /  Password: cualquiera
```

### Scripts disponibles

| Comando | Descripción |
|---------|------------|
| `npm run dev` | Servidor de desarrollo con HMR |
| `npm run build` | Build de producción (TypeScript + Vite) |
| `npm run preview` | Previsualizar el build de producción |
| `npm run lint` | Verificar errores de estilo |

---

## 🎭 Sistema de Mocks (MSW)

**MSW (Mock Service Worker)** intercepta las llamadas HTTP en el browser y devuelve datos simulados cuando `VITE_USE_MOCKS=true`.

### Cómo funciona
```
Frontend hace fetch("/api/auth/login")
        ↓
Service Worker intercepta la petición
        ↓
Handler en src/mocks/handlers/auth.handlers.ts responde con JSON mock
        ↓
Frontend recibe respuesta como si fuera el backend real
```

### Agregar un nuevo mock (Fase 2+)
```typescript
// src/mocks/handlers/citas.handlers.ts
import { http, HttpResponse } from 'msw'

export const citasHandlers = [
  http.get('/api/citas', () => {
    return HttpResponse.json({ success: true, data: [...] })
  }),
]

// src/mocks/handlers/index.ts
import { citasHandlers } from './citas.handlers'
export const handlers = [...authHandlers, ...citasHandlers]
```

### Desactivar mocks (conectar al backend real)
```bash
# .env.development
VITE_USE_MOCKS=false
```

---

## 🗺 Plan de Fases

### Fase 1 — Scaffolding y Autenticación ✅ `COMPLETADA`
**Rama:** `feat/fase-1-scaffolding`  
**Descripción:** Base técnica completa del proyecto. Todo lo que se crea aquí es la columna vertebral que usarán todas las fases siguientes.

**Lo que incluye:**
- Configuración de Vite, TypeScript, Tailwind y PWA
- Sistema de autenticación JWT completo (login, logout, restauración de sesión)
- Roles de usuario: Admin, Gerente, Empleado, Cliente
- Sistema de toasts, dark mode y sidebar colapsable
- Componentes UI reutilizables (Button, Input, Modal, Toast, Loader, Badge)
- Cliente HTTP con interceptores automáticos de JWT
- MSW configurado para trabajar sin backend
- Páginas: Login, Dashboard base, 404

**Lo que puede ver el compañero backend en el PR:**
- Contrato de autenticación esperado (endpoints, formato JSON)
- Cómo el frontend guarda y envía el JWT

---

### Fase 2 — Sistema de Reservas Core 🔄 `PRÓXIMA`
**Rama:** `feat/fase-2-reservas`  
**Descripción:** El corazón del sistema. Implementa el flujo completo de reservas de punta a punta.

**Lo que incluye:**
- **Asistente paso a paso:** Servicio → Empleado → Fecha/Hora → Confirmar
- **Carrito de servicios:** múltiples servicios por transacción
- **Calendario de disponibilidad:** vista de slots libres por empleado y fecha
- **Citas recurrentes:** diaria, semanal, mensual, anual
- **Campos personalizados:** checkbox, textarea, select en el formulario
- **Gestión de empleados:** perfiles, horarios, buffer time, días libres
- **Gestión de servicios:** CRUD con duración personalizable y precios múltiples
- **Múltiples ubicaciones:** gestión de varias sedes
- **Zonas horarias:** detección automática del cliente
- **Panel de empleados:** gestión propia de horarios
- **Panel de clientes:** ver, reprogramar y cancelar citas propias
- **Vistas del backend:** calendario mensual/semanal/diario/lista

**Mocks nuevos:** `citas.handlers.ts`, `servicios.handlers.ts`, `empleados.handlers.ts`

**Endpoints que el compañero debe tener listos:**
- `GET /api/citas`, `POST /api/citas`, `PUT /api/citas/{id}`
- `GET /api/servicios`, `GET /api/empleados`
- `GET /api/empleados/{id}/disponibilidad?fecha=YYYY-MM-DD`

---

### Fase 3 — Pagos y Servicios Avanzados 💸 `PLANIFICADA`
**Rama:** `feat/fase-3-pagos`  
**Descripción:** Monetización del sistema y funcionalidades avanzadas de reservas.

**Lo que incluye:**
- **Facturación automática:** PDF generado tras cada reserva
- **Cupones de descuento:** fijos o porcentuales con fechas de vigencia
- **Reembolsos:** gestión desde el panel admin
- **Paquetes de servicios:** bundle con precio especial
- **Servicios extra (add-ons):** opcionales que suman al precio
- **Reservas grupales:** capacidad mínima y máxima
- **Lista de espera:** inscripción automática + notificación de slot libre
- **Límites de reservas:** máximo de citas por cliente
- **Límites de tiempo:** tiempo mínimo para reservar o cancelar

**Endpoints que el compañero debe tener listos:**
- `POST /api/pagos`, `GET /api/facturas/{id}/pdf`
- `POST /api/cupones/validar`, `POST /api/reembolsos`
- `GET /api/lista-espera`, `POST /api/lista-espera`

---

### Fase 4 — Integraciones y Notificaciones 🔗 `PLANIFICADA`
**Rama:** `feat/fase-4-integraciones`  
**Descripción:** Conectar Sagitta con el ecosistema de herramientas del negocio.

**Lo que incluye:**
- **Google Calendar:** sincronización bidireccional (OAuth2)
- **Apple Calendar:** exportar/importar vía `.ics`
- **Google Meet:** link automático al reservar cita virtual
- **Zoom:** creación automática de reunión vía API
- **WhatsApp:** recordatorios y confirmaciones (WhatsApp Business API)
- **Notificaciones push:** Web Push API via Service Worker
- **Email transaccional:** confirmación, recordatorio, cancelación
- **Webhooks:** triggers en eventos (cita creada, cancelada, pagada)
- **Google Analytics:** tracking de conversiones de reserva
- **Base de datos de clientes:** perfiles completos + importación masiva CSV

---

### Fase 5 — Panel Admin y Personalización 🎨 `PLANIFICADA`
**Rama:** `feat/fase-5-admin`  
**Descripción:** Dashboard completo para el negocio y herramientas de personalización visual.

**Lo que incluye:**
- **Dashboard de métricas (KPIs):** ingresos, ocupación, tasa de cancelación, conversiones
- **Gráficos interactivos:** líneas, barras, donut (Recharts o Chart.js)
- **Diseño personalizable:** colores, fuentes, logo desde el panel sin código
- **Popup integrado:** formulario de reservas embebible en cualquier web
- **Formulario tipo catálogo:** búsqueda por categorías
- **Galerías de fotos:** imágenes por servicio
- **Permisos granulares por rol:** qué puede ver y hacer cada rol
- **GDPR:** panel para que el cliente elimine sus propios datos
- **Vistas flexibles:** calendar drag & drop, exportar a Excel/PDF

---

### Fase 6 — Escalabilidad y CRM 🚀 `ROADMAP`
**Rama:** `feat/fase-6-crm`  
**Descripción:** Preparar el sistema para crecer y conectarse a CRMs externos.

**Lo que incluye:**
- Integración con HubSpot / Salesforce vía Webhook
- API pública documentada (Swagger/OpenAPI)
- Multi-idioma (i18n)
- Multi-tenant (varios negocios bajo la misma plataforma)

---

## 🌿 Flujo de Trabajo Git

### Estrategia de ramas
```
main          ← Producción estable. Solo merges aprobados.
  └── dev     ← Integración continua. Base para crear features.
        ├── feat/fase-1-scaffolding   ✅
        ├── feat/fase-2-reservas      🔄 (próxima)
        └── feat/...
```

### Convención de commits
```bash
feat: nueva funcionalidad
fix: corrección de bug
chore: mantenimiento, dependencias, configuración
style: cambios de estilos sin lógica
refactor: refactorización sin cambio de comportamiento
docs: documentación
test: pruebas
```

### Proceso para colaborar
```bash
# 1. Crear rama desde dev (nunca desde main)
git checkout dev
git pull origin dev
git checkout -b feat/nombre-feature

# 2. Desarrollar y commitear
git add .
git commit -m "feat: descripción clara"

# 3. Push y abrir Pull Request
git push origin feat/nombre-feature
# PR hacia `dev`, no hacia `main`

# 4. Code review y merge
# Después del merge, `dev` → `main` para releases
```

---

## 📐 Convenciones de Código

### TypeScript
- **Strict mode activado** — no `any` implícitos
- Todas las interfaces en `src/types.ts`
- Componentes nombrados con PascalCase
- Hooks con prefijo `use`
- Servicios con sufijo `.service.ts`

### Componentes React
```tsx
// ✅ Correcto — funcional con tipos explícitos
interface Props {
  title: string
  onClose: () => void
}
export function MyComponent({ title, onClose }: Props) { ... }

// ❌ Evitar — default exports anónimos sin tipos
export default ({ title }) => <div>{title}</div>
```

### Llamadas a la API
```typescript
// ✅ Usar siempre los servicios, nunca fetch directo en componentes
import { citasService } from '@/services/citas.service'
const citas = await citasService.getAll()

// ❌ Evitar
const res = await fetch('/api/citas', { headers: ... })
```

### Estilos
```tsx
// ✅ Clases de CSS global definidas en index.css
<div className="card">...</div>
<button className="btn-primary">...</button>

// ✅ Tailwind para casos específicos
<div className="flex items-center gap-4 p-6">...</div>
```

---

## 👥 Equipo

| Rol | Responsable | Área |
|-----|-------------|------|
| Frontend Developer | Silvio | React, TypeScript, UI/UX |
| Backend Developer | TBD | PHP, MySQL, REST API |

---

## 📞 Contrato de API

> Para el compañero backend: el frontend espera este formato en **todos** los endpoints.

```json
// ✅ Respuesta exitosa
{
  "success": true,
  "data": { ... },
  "message": "OK"
}

// ❌ Error
{
  "success": false,
  "message": "Descripción del error",
  "errors": { "campo": ["El campo es requerido"] }
}
```

**Headers requeridos en todas las respuestas:**
```
Content-Type: application/json
Access-Control-Allow-Origin: http://localhost:5173
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
```

**Autenticación:**  
Todos los endpoints protegidos leen el header: `Authorization: Bearer <jwt_token>`

---

*Sagitta © 2026 — Lyberate App*
