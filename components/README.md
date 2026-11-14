# Componentes Weaves

Biblioteca HTML + CSS sin framework. `../design-system.html` muestra los tokens y los patrones; la referencia visual es `../DESIGN.md`. Estos archivos son independientes de las páginas publicadas.

## Uso

1. Sirve el repositorio por HTTP: `python3 -m http.server 8000` desde la raíz. Abre `/design-system.html`.
2. Incluye `components/weaves.css` y carga las familias Space Grotesk, Inter y JetBrains Mono (como en la página de muestra). Ajusta la ruta relativa según la página; si no cargan, hay fuentes de respaldo.
3. Envuelve los componentes en un contenedor con `class="wv-scope"` y copia el marcado del fragmento que corresponda. Los fragmentos no se cargan solos: no son web components ni plantillas parametrizadas. Adapta textos, destinos y IDs a cada instancia.

| Fragmento | Uso |
| --- | --- |
| `buttons.html` | `.wv-btn--primary`, `--secondary` o `--ghost`; `<a>` para navegar, `<button>` para acciones. Usa `disabled` en botones deshabilitados. |
| `cards.html` | `wv-card--service` para un servicio; `wv-card--case` para un caso. Cambia textos, enlaces y resultado; no publiques cifras sin verificar. |
| `forms.html` | Campos con `<label>`, ayudas vinculadas y consentimiento. El ejemplo **no envía datos**: conecta el backend y sustituye el botón por `type="submit"` al implementar. Usa IDs únicos en cada copia. |
| `badges.html` | Etiquetas de contexto; variantes base, `--amber` y `--neutral`. No comuniques un estado solo con color. |
| `alerts.html` | Mensajes de información, advertencia y error. Para errores dinámicos, aplica `role="alert"` al contenedor actualizado; evita anunciar alertas estáticas innecesariamente. |
| `navigation.html` | Patrón autónomo, fluido y envolvente, con enlaces reales. Ajusta destinos y `aria-current` según la página. |
| `footer-pattern.html` | Pie autónomo de ejemplo. Actualiza el contenido y los destinos antes de usarlo. |

Las clases `is-hover` e `is-focus` son **solo para muestras**: los estados reales funcionan con `:hover` y `:focus-visible`. Evita `aria-disabled` en enlaces navegables: para una acción no disponible usa un botón con `disabled` o elimina el enlace.

## Cabecera y pie existentes

`header.html` y `footer.html` son los componentes históricos del sitio. El cargador `js/components-loader.js` los inserta en `#header-placeholder` y `#footer-placeholder`; dependen de CSS y JS del sitio. No se sustituyeron ni modificaron: `navigation.html` y `footer-pattern.html` son ejemplos alternativos aislados.

## Accesibilidad

Mantén foco visible y orden lógico; vincula cada error al campo con `aria-describedby` y `aria-invalid`; comprueba contraste sobre el fondo final, especialmente en glassmorphism; conserva la adaptación móvil y `prefers-reduced-motion`. Prueba formularios, navegación por teclado y tecnologías de asistencia en cada integración. El contraste de los colores de marca depende de su combinación, no se garantiza por token.
