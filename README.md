# ProFix - Plumbing & Electrical PWA

Sistema profesional de gestión para empresas de plomería y electricidad. PWA completa con offline support, conectada a Supabase (Auth, PostgreSQL, Realtime, Storage).

## 🚀 Demo

**URL:** https://rtxtmol6ldxuk.kimi.show

**Demo Admin:**
- Email: `admin@profix.com`
- Password: `admin123`

## 📱 Características

- **PWA**: Manifest, Service Worker, Offline Support, Responsive Mobile-First
- **Dashboard**: KPIs, gráficos (Recharts), citas próximas, presupuestos urgentes
- **Presupuestos (Quotes)**: CRUD, line items editor, envío por Email/WhatsApp, aprobación pública vía token UUID
- **Trabajos (Jobs)**: Kanban board, cambio de estado, conversión desde quote
- **Citas (Appointments)**: Calendario semanal, drag & drop visual, recordatorios
- **Empleados**: Perfiles, roles, GPS tracking
- **Clientes (CRM)**: Historial de quotes y jobs
- **Inventario**: Stock tracking, alertas de stock bajo, ajuste manual
- **Finanzas**: Pagos, gastos, gráfico P&L
- **GPS Tracking**: Mapa con Leaflet, ubicación de empleados y trabajos
- **Configuración**: Company info, WhatsApp templates, pipeline stages
- **Roles**: Admin, Supervisor, Técnico (Plumber/Electrician), Cliente

## 🛠 Stack Tecnológico

- React 19 + TypeScript + Vite
- Tailwind CSS + shadcn/ui
- Supabase (Auth, PostgreSQL, Realtime, Storage)
- React Router DOM v7
- Recharts (charts)
- Leaflet (maps)
- date-fns (fechas)
- react-hook-form + zod (forms)
- react-qr-code, html2canvas, jspdf (PDF/QR)
- Lucide React (icons)

## ⚙️ Setup Local

### 1. Clonar y instalar

```bash
git clone https://github.com/tu-usuario/profix-plumbing-electrical.git
cd profix-plumbing-electrical
npm install
```

### 2. Configurar Supabase

1. Crea un proyecto en [Supabase](https://supabase.com)
2. Ve al SQL Editor y ejecuta el archivo `supabase_schema.sql`
3. Luego ejecuta `seed_data.sql` para poblar datos de demo
4. Activa **Email Auth** en Authentication > Providers > Email (desactiva Confirm email para demo)
5. Crea un usuario manualmente en Authentication > Users:
   - Email: `admin@profix.com`
   - Password: `admin123`
   - User metadata: `{"full_name": "Admin ProFix", "role": "admin"}`

### 3. Variables de entorno

Copia `.env` y rellena tus credenciales de Supabase:

```env
VITE_SUPABASE_URL=https://tu-projecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key
```

### 4. Storage Bucket (opcional)

Para uploads de fotos/logos:
1. Ve a Storage en Supabase
2. Crea un bucket público llamado `profix-uploads`
3. Setea policies para INSERT/SELECT authenticated

### 5. Ejecutar

```bash
npm run dev
```

La app corre en `http://localhost:3000`

### 6. Build producción

```bash
npm run build
```

## 📂 Estructura del Proyecto

```
src/
  components/       # UI components (Sidebar, MobileNav, AppLayout)
  contexts/         # AuthContext (Supabase auth + profiles)
  hooks/            # Custom hooks (useSupabase realtime)
  lib/              # Supabase client + types
  pages/            # Rutas principales
    Dashboard.tsx
    QuotesPage.tsx
    JobsPage.tsx
    AppointmentsPage.tsx
    EmployeesPage.tsx
    CustomersPage.tsx
    InventoryPage.tsx
    FinancesPage.tsx
    SettingsPage.tsx
    GpsTrackingPage.tsx
    QuoteApprovalPage.tsx  # Página pública de aprobación
  App.tsx           # Router principal
  main.tsx          # Entry point
public/
  manifest.json     # PWA manifest
  sw.js             # Service Worker
  icons/            # App icons
supabase_schema.sql # Schema completo
seed_data.sql       # Datos demo
```

## 🔐 Roles y Permisos

| Rol | Permisos |
|-----|----------|
| Admin | Acceso total, configuración, reportes, finanzas |
| Supervisor | Jobs, appointments, empleados, inventario, quotes |
| Plumber/Electrician | Ver jobs asignados, clock in/out, actualizar status, subir fotos |
| Cliente | Ver quotes pendientes, aprobar/rechazar vía link público |

## 📊 Módulos Principales

### Quotes / Presupuestos
- Editor de line items con auto-cálculo
- Descuentos, tax, notas
- Envío por Email/WhatsApp (simulado con toast)
- Link público de aprobación: `/quote-approval/:token`
- Conversión a Job al aprobar

### Jobs / Trabajos
- Kanban board por status
- Cambio de estado con timestamps automáticos
- Asignación de técnicos

### Appointments
- Vista semanal tipo Google Calendar
- Crear citas con duración

### GPS Tracking
- Mapa con Leaflet
- Marcadores de empleados (GPS) y jobs

## 🔔 PWA Features

- Installable en iOS/Android
- Offline support básico (service worker cachea assets estáticos)
- Theme color: `#1e3a5f`
- Icons: 192x192 y 512x512

## 📄 Schema SQL

Incluido en `supabase_schema.sql`:
- 20 tablas con relaciones
- Row Level Security (RLS) policies
- Trigger para crear profile automático en signup
- Tipos y constraints

## 🌱 Seed Data

Incluido en `seed_data.sql`:
- 15 clientes
- 30 parts en inventario
- 3 suppliers
- Company settings
- WhatsApp templates
- Pipeline stages

## 📝 Notas

- La app usa Supabase Realtime para actualizaciones en vivo en notificaciones
- WhatsApp integration es simulada (toast + logs) pero lista para conectar API real
- Para producción, configurar Supabase Storage para uploads de fotos y receipts
- El link de aprobación de quotes es público (no requiere login)

## 📞 Contacto

ProFix Plumbing & Electrical
- Email: info@profix.com
- Phone: +1 (305) 555-0123
