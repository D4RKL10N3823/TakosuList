# TakosuList

**TakosuList** es una Aplicación Web Progresiva (PWA) diseñada para gestionar y trackear tu lista de anime de forma moderna, rápida y profesional. Construida con el stack MERN y optimizada para una experiencia móvil nativa.

## Características Principales

- **Gestión de Listas:** Añade animes a tu lista personal con estados (Viendo, Pendiente, Completado).
- **Sistema de Calificación:** Califica tus títulos favoritos con persistencia de datos.
- **Comentarios Anidados:** Participa en discusiones con un sistema de hilos y respuestas.
- **Notificaciones Web Push:** Recibe alertas instantáneas (ej. respuestas a tus comentarios).
- **Experiencia PWA:**
  - Soporte **Offline** completo mediante Service Workers.
  - Instalable en dispositivos móviles y escritorio.
  - **Haptic Feedback:** Vibración al interactuar con acciones clave.
- **Diseño Premium:** Interfaz oscura (Teal & Orange) con fuentes modernas (_Space Grotesk_).

## Tecnologías Utilizadass

### Frontend

- **React 18** + **Vite** (HMR ultra rápido)
- **Tailwind CSS** (Diseño responsivo y personalizado)
- **React Router 6** (Navegación SPA)
- **Service Workers** (Caché offline y Web Push)

### Backend

- **Node.js** & **Express**
- **MongoDB** + **Mongoose** (Base de datos NoSQL)
- **Web-Push** (Protocolo de notificaciones)
- **JWT** (Autenticación segura)

### Infraestructura

- **Docker** & **Docker Compose** (Contenerización completa)

## Instalación y Configuración

### 1. Clonar el proyecto

```bash
git clone <tu-repositorio>
cd sh2
```

### 2. Configurar Variables de Entorno

Crea un archivo `.env` en la carpeta `backend/` basado en el siguiente esquema:

```env
PORT=5001
MONGO_URI=mongodb://db:27017/takosulist
JWT_SECRET=tu_secreto_super_seguro
VAPID_PUBLIC_KEY=tu_clave_publica
VAPID_PRIVATE_KEY=tu_clave_privada
VAPID_SUBJECT=mailto:tu@correo.com
```

### 3. Levantar con Docker

```bash
docker-compose up -d --build
```

### 4. Poblar la Base de Datos (Seeders)

Para insertar los 20 animes iniciales:

```bash
docker exec backend npm run seed
```

## Requerimientos PWA

Esta aplicación cumple con todos los lineamientos de una PWA profesional:

1. **Splash Screen & Home:** Configurados en `manifest.webmanifest`.
2. **Offline Support:** Estrategias _Network-first_ y _Cache-first_ en `sw.js`.
3. **Notificaciones:** Implementación completa de Web Push Protocol.
4. **Uso de Hardware:** Uso de la **Vibration API** (`navigator.vibrate`) y **Share API**.
5. **Renderizado:** Vistas del lado del cliente (React) y soporte para SSR (EJS).

## Licencia

Este proyecto fue desarrollado para fines educativos como parte de las actividades de Saber Hacer.
