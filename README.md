# Todo Frontend

Este proyecto es el frontend de una aplicación de tareas (Todo) construida con **React**, **TypeScript** y **Vite**.

## Instalación

1. Clona el repositorio (si aún no lo has hecho):

   ```bash
   git clone <url-del-repo>
   cd todo-frontend
   ```

2. Instala las dependencias:

   ```bash
   bun install
   # o con npm:
   # npm install
   ```

## Ejecución en desarrollo

Para iniciar el servidor de desarrollo:

```bash
bun run dev
# o con npm:
# npm run dev
```

Esto abrirá la aplicación en [http://localhost:3000](http://localhost:3000).

## Build para producción

Para construir la aplicación:

```bash
bun run build
# o con npm:
# npm run build
```

## Lint

Para ejecutar el linter:

```bash
bun run lint
# o con npm:
# npm run lint
```

## ¿Cómo funciona el frontend?

- El frontend muestra una lista de tareas, permite añadir, editar, completar y eliminar tareas.
- Usa **React** para la interfaz y una librería HTTP (como axios o fetch) para comunicarse con el backend.
- El estado de las tareas se mantiene sincronizado con el backend.

## ¿A qué URL hace peticiones el frontend?

El frontend realiza todas las peticiones al backend en la siguiente URL base:

```
http://localhost:4000/api/todos
```

- **GET** `/api/todos` — Obtiene todas las tareas.
- **POST** `/api/todos` — Crea una nueva tarea.
- **PUT** `/api/todos/:id` — Actualiza una tarea.
- **DELETE** `/api/todos/:id` — Elimina una tarea.

> **Nota:** Asegúrate de que el backend esté corriendo en `http://localhost:4000` antes de usar el frontend.

## Estructura de archivos principal

- `src/Todos.tsx`: Componente principal de la lista de tareas.
- `src/main.tsx`: Punto de entrada de la aplicación.
- `src/index.css`: Estilos globales.

---

Para más detalles sobre la configuración de React, TypeScript y Vite, consulta la documentación oficial de cada tecnología.
