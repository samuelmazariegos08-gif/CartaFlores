# Flores amarillas 🌻

Recreación programada del sobre animado del video de referencia. HTML, CSS y JavaScript puro, sin dependencias de ejecución ni proceso de compilación. Las ilustraciones son SVG creados con código; no son recortes del video. La tipografía se incluye localmente para funcionar sin conexión.

## Ver la página

Abre `index.html` en tu navegador. El sobre gira, se abre, muestra la carta y repite la secuencia. Puedes tocarlo o usar Enter/Espacio para abrirlo y cerrarlo manualmente. «Pausar» detiene la repetición automática al finalizar el movimiento actual; «Repetir» vuelve a mostrar la apertura. Se respeta la preferencia del sistema de reducir movimiento.

## Publicar en GitHub Pages

1. Crea un repositorio en GitHub, por ejemplo `flores-amarillas` (público si usas GitHub Free).
2. Sube **el contenido de esta carpeta** a la raíz del repositorio. `index.html` debe quedar directamente en la raíz, junto con `styles.css`, `script.js`, `.nojekyll` y la carpeta `assets`. No subas solamente el ZIP.
3. En el repositorio, abre **Settings → Pages**.
4. En **Build and deployment → Source**, selecciona **Deploy from a branch**.
5. Selecciona la rama **main**, carpeta **/(root)**, y pulsa **Save**.
6. Cuando GitHub termine el despliegue, encontrarás la dirección en esa misma pantalla. Normalmente tendrá la forma `https://TU-USUARIO.github.io/flores-amarillas/`.

Documentación oficial: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site

## Personalizar

Edita el objeto `CONFIG` al principio de `script.js`:

- `destinataria` y `remitente`: nombres del sobre.
- `introduccion` y `mensaje`: contenido de la carta. `\n` introduce un salto de línea. Conserva una extensión similar para que quepa en el papel.
- `automatico`: `true` para repetir automáticamente; `false` para abrir únicamente al tocar el sobre.
- `tiempoAbierta` y `tiempoCerrada`: duración de cada pausa en milisegundos.

Colores, dimensiones y transiciones están en `styles.css`. El corazón y el sobre están dibujados con SVG y CSS; los girasoles se encuentran en `assets/`.

## Archivos

```text
index.html
styles.css
script.js
.nojekyll
assets/
  girasol.svg
  ramo.svg
  IndieFlower-Regular.ttf
  OFL.txt
```

Indie Flower se distribuye bajo la licencia SIL Open Font License incluida en `assets/OFL.txt`. No se necesita el video original para ejecutar la página. No incluye audio.
