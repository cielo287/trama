# Trama

**Trama** es una plataforma SaaS full-stack para la gestión de obras y proyectos de construcción/arquitectura, pensada para que estudios y arquitectos puedan planificar tareas, hacer seguimiento de avance y coordinar materiales y mano de obra desde un solo lugar.

El proyecto nació a partir del pedido concreto de un arquitecto: se relevaron requerimientos y se priorizaron funcionalidades en conversación directa con él, y se fue validando de forma iterativa a medida que se construía.

> 🚧 Proyecto en etapa de validación — actualmente en despliegue single-tenant, con arquitectura pensada para escalar a multi-tenant más adelante.

---

## ✨ Funcionalidades

- **Gestión de obras y tareas**, con vistas en **Gantt** y **Kanban**
- **Dependencias entre tareas** con flechas SVG y creación por drag-and-drop
- **Kanban drag-and-drop** para mover tareas entre estados
- **Máquina de estados** para las transiciones de tareas, con historial (`HistorialEstado`)
- **Panel de materiales y mano de obra** por tarea, con autocompletado y creación inline (combobox "search-or-create")
- **Autenticación JWT** con refresh token rotativo vía cookie httpOnly
- **Verificación de email** por código de 6 dígitos
- **Recuperación de contraseña** (forgot/reset password) con token con expiración
- **Notificaciones** para confirmaciones de fin de tarea (reemplazando modales bloqueantes)
- **Contacto directo por WhatsApp** con encargados de tarea
- Protección con **rate limiting** ante intentos fallidos de login/verificación

---

## 🛠️ Stack tecnológico

**Backend**
- NestJS
- Prisma ORM
- PostgreSQL

**Frontend**
- React + TypeScript
- Vite
- Tailwind CSS
- shadcn/ui
- dnd-kit (drag and drop)

**Infraestructura**
- Backend: Railway
- Frontend: Vercel
- Base de datos: Neon (PostgreSQL serverless)
- Envío de emails: Resend, con dominio propio verificado (DKIM/SPF/DMARC)

---

## 📦 Instalación local

### Requisitos previos
- Node.js 20.19+ o 22.12+ (requerido por Vite)
- Una base de datos PostgreSQL (local o Neon)

### 1. Clonar el repositorio

```bash
git clone https://github.com/<tu-usuario>/trama.git
cd trama
```

### 2. Backend

```bash
cd backend
npm install
cp .env.example .env   # completar variables de entorno
npx prisma migrate dev
npm run start:dev
```

### 3. Frontend

```bash
cd frontend
npm install
cp .env.example .env   # completar VITE_API_URL
npm run dev
```

### Variables de entorno principales

**Backend**
```
DATABASE_URL=
JWT_SECRET=
TZ="America/Argentina/Cordoba"
RESEND_API_KEY=
MAIL_FROM="tu-app <noreply@tudominio.com>"
FRONTEND_URL="http://localhost:5173"
```

> El envío de mails (verificación de cuenta y recuperación de contraseña) usa [Resend](https://resend.com). Necesitás tu propio `RESEND_API_KEY` y un remitente verificado en `MAIL_FROM` (o `onboarding@resend.dev`, válido solo para pruebas).

**Frontend**
```
VITE_API_URL=
```

---

## 🏗️ Arquitectura

El backend expone una API REST construida con NestJS, con autorización a nivel de recurso y una capa de dominio que modela obras, tareas, materiales, mano de obra y usuarios. El frontend consume esta API y maneja el estado de la UI con vistas especializadas para Gantt y Kanban.

### Modelo de datos (resumen)

- **Usuario** — dueño de sus obras, materiales y encargados; incluye verificación por código, recuperación de contraseña y rate limiting de intentos fallidos (login y verificación) con bloqueo temporal
- **RefreshToken** — uno por dispositivo, para la rotación de sesión
- **Obra** — pertenece a un usuario; agrupa tareas
- **Tarea** — soporta subtareas (relación recursiva `tareaPadre`/`subtareas`), estado (`PENDIENTE` / `EN_CURSO` / `FINALIZADA`) e imágenes
- **TareaDependencia** — modela relaciones de bloqueo entre tareas (tarea bloqueadora → tarea dependiente), base del Gantt
- **HistorialEstado** — registro histórico de cada cambio de estado de una tarea, con notas (ej. "faltaron materiales")
- **Material** y **DetalleMaterial** — catálogo de materiales por usuario, con precio, cantidad y unidad de medida por tarea
- **Encargado** y **ManoDeObra** — responsables de tarea y su costo asociado

---

## 🗺️ Roadmap

- [ ] Soporte multi-tenant
- [ ] Carga de archivos (materiales, evidencias de obra) vía Cloudflare R2
---

## 👩‍💻 Autora

Desarrollado por **María Cielo Bertoni** — [LinkedIn](https://linkedin.com/in/cielo-bertoni)
