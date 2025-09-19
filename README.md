# Portal Inverland - Plataforma Digital

<div align="center">
<img width="1200" alt="Inverland Portal" src="https://github.com/halvarez22/inverland-new-portal/raw/main/images/logo.png" />
</div>

## Descripción

Portal digital para la gestión de propiedades y clientes de Grupo Inverland. Esta plataforma permite a los agentes inmobiliarios gestionar propiedades, clientes y realizar seguimientos de manera eficiente.

## Características Principales

- Gestión de propiedades
- Seguimiento de clientes
- Panel de administración
- Herramientas de análisis
- Integración con IA para recomendaciones

## Requisitos Previos

- Node.js 16.x o superior
- npm 8.x o superior
- Clave API de Gemini (para funcionalidades de IA)

## Instalación

1. Clona el repositorio:
   ```bash
   git clone https://github.com/halvarez22/inverland-new-portal.git
   cd inverland-new-portal
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Configura las variables de entorno:
   - Copia el archivo `.env.example` a `.env.local`
   - Configura tu `GEMINI_API_KEY` en el archivo `.env.local`

## Desarrollo

Para iniciar el servidor de desarrollo:

```bash
npm run dev
```

## Construcción para Producción

Para crear una versión optimizada para producción:

```bash
npm run build
```

## Despliegue

Este proyecto está configurado para desplegarse en Vercel. Simplemente haz push a la rama `main` y Vercel se encargará del despliegue automático.

## Estructura del Proyecto

- `/components` - Componentes reutilizables de React
- `/services` - Servicios y lógica de negocio
- `/modules` - Módulos específicos de la aplicación
- `/images` - Recursos gráficos
- `/types` - Definiciones de TypeScript

## Licencia

Este proyecto es propiedad de Grupo Inverland. Todos los derechos reservados.
