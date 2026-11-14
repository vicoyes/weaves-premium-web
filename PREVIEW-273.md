# PREVIEW-273 — Weaves Website

## Alcance y correcciones

- `servicios/servicio.html`: «Ver casos de éxito» apunta a `../pages/casos-exito.html` y el CTA final a `../pages/diagnostico-gratuito.html`. El CTA del hero conserva su ancla funcional `#cta`; el JS actualiza el texto sin sobrescribir el destino del CTA final.
- `components/footer.html` y las copias incrustadas: se retiran los enlaces vacíos de carreras, documentación, RGPD y redes. Los textos se conservan sin `href`; los iconos de redes se conservan como elementos decorativos sin interacción ni URL inventada.
- `sitemap.xml`: se eliminan las 10 rutas 404 identificadas y se añade la política de cookies. También se retiran las tres páginas de sectores con `noindex` y la ficha de capacitación sin contenido, para no solicitar su indexación.
- `sectores/salud.html`, `sectores/restauracion-turismo.html` y `sectores/startups.html`: `noindex,follow`. Se retiran sus tarjetas/enlaces del índice de sectores, sin borrar las páginas ni modificar su copy. No se encontraron otros enlaces de navegación a esas rutas.
- `servicios/plantilla.html` y `servicios/capacitacion-soporte.html`: se eliminan las redirecciones JavaScript a claves inexistentes; se muestra un aviso neutro de ficha no disponible y se añade `noindex,follow`. No se inventa una equivalencia ni se enlazan desde navegación.
- `pages/blog.html`: formulario existente conservado con `hidden`, sin `display:flex` que anule el ocultamiento; se muestra «La suscripción está en preparación» y se documenta el motivo en un comentario.

## Archivos cambiados

- `components/footer.html`
- `index.html`
- `legal/aviso-legal.html`
- `legal/politica-cookies.html`
- `legal/politica-privacidad.html`
- `pages/blog.html`
- `pages/casos-exito.html`
- `pages/contacto.html`
- `pages/diagnostico-gratuito.html`
- `pages/planes-precios.html`
- `pages/quienes-somos.html`
- `sectores/ecommerce.html`
- `sectores/educacion.html`
- `sectores/index.html`
- `sectores/restauracion-turismo.html`
- `sectores/salud.html`
- `sectores/sector.html`
- `sectores/servicios-profesionales.html`
- `sectores/startups.html`
- `servicios/capacitacion-soporte.html`
- `servicios/index.html`
- `servicios/plantilla.html`
- `servicios/servicio.html`
- `sitemap.xml`
- `PREVIEW-273.md` (este informe)

## Fuera de alcance

No se cambiaron copy comercial, precios, casos, testimonios, promesas, inglés ni diseño de la home; únicamente el pie de la home elimina interacciones vacías conservando su presentación. No se han creado redirecciones ni URLs sociales, conectado newsletter, publicado, hecho push ni modificado `main`. Los sectores y fichas retirados necesitan una revisión de contenido o una equivalencia validada antes de reincorporarlos; `noindex` no impide el acceso directo.

## Verificación

- `git grep -n 'href="#"' -- '*.html'`: sin coincidencias en los HTML versionados (exit 1 de grep por cero resultados). Se conserva la ancla funcional `#cta`.
- XML parseado correctamente; comprobación de las diez rutas 404 retiradas, cookies incluida y ausencia de las páginas `noindex` en el sitemap. Las **15 URLs restantes** se solicitaron mediante `python3 -m http.server` ligado a `127.0.0.1` desde este worktree: **15/15 HTTP 200**, sin consultar ni alterar producción.
- En el mismo servidor temporal se probaron **23 rutas distintas** (las 15 del sitemap más detalle de servicio, las tres páginas de sectores retiradas, las dos fichas sin redirección, footer y sitemap): **23/23 HTTP 200**. Las fichas sin contenido devuelven el aviso neutro, no una ficha funcional.
- Ejecución del JS real de la ficha en Node con un DOM simulado para las **9 claves válidas**: cada CTA final conserva el destino correcto y se rellena el texto; el hero conserva `#cta`. Esto no es una prueba de navegador completo.
- Comprobaciones estáticas: sin `href="#"` en los pies; las tres páginas tienen `noindex,follow` y no aparecen en el índice; las dos claves inexistentes ya no se usan en redirecciones; formulario oculto con aviso; `git diff --check` sin errores.

Servidor de prueba detenido tras la comprobación. No se ha verificado el aspecto visual ni se han enviado formularios reales.
