# Portfolio · Pablo Rojo Hernández

Web personal estática (Vite + React + TypeScript) pensada para publicarse en
`https://rojohernandezpablo.com` como Cloudflare Worker con assets estáticos.
No tiene backend, base de datos, analítica ni trackers.

## Arrancar en local

```bash
npm install
npm run dev          # http://localhost:5173
npm run build        # comprueba tipos (tsc -b) y genera dist/
npm run preview      # sirve dist/ para revisar la versión final
```

Desde la carpeta `Proyectitos` también existe la configuración `portfolio-dev`
(puerto 5190) en `.claude/launch.json`.

## Editar el contenido

Todo el texto está en **`src/content.ts`**, con un objeto `es` y otro `en` de la
misma forma (TypeScript avisa si a uno le falta algo). Ahí están el resumen,
experiencia, proyectos, habilidades, formación, idiomas y los enlaces de contacto
(`contact.email`, `contact.linkedin`).

- **Foto:** `public/foto.jpg` (cuadrada, ~600 px). Para cambiarla, sustituye el
  archivo. Si se borra, la web muestra automáticamente un avatar con las iniciales «PR».
- **Imagen para redes (Open Graph):** `public/og-image.png` (1200×630).
- **Favicon:** `public/favicon.svg`.
- **Textos SEO del HTML inicial** (title, description, og:*) están en `index.html`;
  el título y la descripción se actualizan solos al cambiar de idioma.
- Colores y tipografía: variables CSS al principio de `src/styles.css`.

Por privacidad, **no se publica el teléfono** ni el PDF del CV (que lo incluye).
Si quieres un botón «Descargar CV», genera un PDF sin teléfono, guárdalo en
`public/` y añade el enlace en el hero de `src/App.tsx`.

## Publicar en Cloudflare

La configuración está en `wrangler.jsonc` (Worker `portfolio`, assets en `./dist`,
página 404 propia y dominios `rojohernandezpablo.com` + `www.rojohernandezpablo.com`).

1. Autentícate una vez: `npx wrangler login`
   (o exporta un token: `export CLOUDFLARE_API_TOKEN=...`, con permiso para
   Workers y para el DNS de la zona `rojohernandezpablo.com`).
2. Publica:

   ```bash
   npm run deploy     # = npm run build && wrangler deploy
   ```

Los dominios personalizados se crean en el primer despliegue; la zona
`rojohernandezpablo.com` tiene que estar en la misma cuenta de Cloudflare (ya lo
está, porque `dashboard.rojohernandezpablo.com` vive ahí).
