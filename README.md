# Portfolio · Pablo Rojo Hernández

Web personal estática (Vite + React + TypeScript) publicada en
`https://rojohernandezpablo.com` con GitHub Pages
(repositorio `MrAseituna/rojohernandezpablo.com`).
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

## Publicar

Se publica sola con GitHub Pages: cada `git push` a `main` lanza el flujo
`.github/workflows/pages.yml`, que compila y sube `dist/`.

```bash
git add -A && git commit -m "Describe el cambio" && git push
```

El dominio lo fija `public/CNAME`. En Cloudflare, `rojohernandezpablo.com` (registros
A/AAAA de GitHub Pages) y `www` (CNAME a `mraseituna.github.io`) están **sin proxy**
(nube gris) a propósito: así no pasan por las IPs de Cloudflare que las operadoras
españolas bloquean durante los partidos de LaLiga. No actives el proxy en esos registros.
