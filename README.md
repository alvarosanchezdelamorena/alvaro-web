# Web de Álvaro Sánchez de la Morena del Olmo — Abogado Penalista

Sitio estático (HTML/CSS puro, sin frameworks, sin coste de hosting). Listo para publicar en Cloudflare Pages o GitHub Pages, 100% gratis salvo el dominio.

## Antes de publicar — 3 cosas que hay que rellenar

Busca estos marcadores en los archivos y sustitúyelos por los datos reales:

1. **Teléfono / WhatsApp** — en `contacto/index.html`, sustituye `34XXXXXXXXX` (aparece 3 veces: WhatsApp, tel:, y el número de teléfono visible) por el número real de Álvaro con prefijo de país sin espacios (ej. `34612345678`).
2. **Formulario de contacto** — en `contacto/index.html`, sustituye `https://formspree.io/f/SUSTITUIR_POR_TU_ID` por tu endpoint real:
   - Ve a [formspree.io](https://formspree.io), crea una cuenta gratis (50 envíos/mes gratis, de sobra para empezar).
   - Crea un formulario nuevo, copia el ID que te da, y pégalo en la URL de acción.
3. ~~**Foto real**~~ — hecho. Foto profesional de Álvaro en `assets/img/brand/alvaro-sanchez-de-la-morena-del-olmo-abogado-penalista-madrid.jpg`, referenciada en el schema de la home y visible en "Sobre mí".

## Cómo publicarla — paso a paso (Cloudflare Pages, recomendado)

1. Crea una cuenta gratis en [github.com](https://github.com) si no tienes una.
2. Crea un repositorio nuevo (puede ser privado), por ejemplo `alvaro-web`.
3. Sube el contenido de esta carpeta a ese repositorio (arrastrando los archivos desde la web de GitHub, o con `git push` si prefieres terminal).
4. Ve a [pages.cloudflare.com](https://pages.cloudflare.com), crea una cuenta gratis, y conecta tu cuenta de GitHub.
5. Elige "Crear un proyecto" → selecciona el repositorio `alvaro-web` → en "Framework preset" elige "None" (es HTML puro, no necesita build) → Deploy.
6. En unos segundos tendrás una URL tipo `alvaro-web.pages.dev` ya funcionando — pruébala.
7. En "Custom domains" dentro de Cloudflare Pages, añade tu dominio comprado (ej. `alvarosanchezdelamorena.com`) y sigue las instrucciones para apuntar los DNS — si el dominio también lo compras en Cloudflare, este paso es prácticamente automático.

**Coste total de este método: 0€/mes.** Solo pagas el dominio (10-15€/año, según dónde lo compres).

## Estructura

```
/index.html                                          → Home
/sobre-mi/                                            → Trayectoria
/derecho-penal/narcotrafico/                          → Página de servicio
/derecho-penal/blanqueo-de-capitales/                 → Página de servicio
/derecho-penal/penalista-getafe-alcala-de-henares/    → Página local
/contacto/                                            → Formulario + WhatsApp
/blog/                                                → Índice del blog (vacío, listo para artículos)
/assets/css/style.css                                 → Todos los estilos
/assets/img/                                          → Fotos (subir aquí)
/robots.txt, /sitemap.xml                             → SEO técnico básico
```

## Siguiente paso

Una vez esté publicada y confirmes el dominio funcionando, montamos:
1. El panel para publicar artículos de blog sin tocar código (Decap CMS, también gratis).
2. La tarea automática que revisa el BOE cada día y prepara borradores de artículos para que Álvaro los revise antes de publicar.
