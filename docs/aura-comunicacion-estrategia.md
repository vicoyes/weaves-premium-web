# AURA · Estrategia de Comunicación — Weaves (weaves-premium-web)

**Fecha:** 2026-08-22 (GMT-5)
**Alcance del informe:** claridad de posicionamiento y oferta, no revisión de diseño, SEO ni usabilidad.
**Fuentes:** solo lo verificable en el repositorio (`/home/hector/.openclaw/workspace/weaves-premium-web`) y, cuando se indica, en `https://weavewp.com` (producción).
**Restricción operativa:** no se ha modificado ningún archivo del sitio, no se ha revertido nada y no se ha hecho commit ni push. Solo se ha creado este informe.

> Nota técnica: el brief pidió usar `apply_patch`. El parser `apply_patch` disponible rechaza archivos grandes con varias secciones; tras un test mínimo con `apply_patch` (que funcionó) y un intento de aplicación completa (rechazado), el informe se ha creado con `write`. Si quieres que se rehaga con `apply_patch` en otro formato, lo aplico. No afecta al contenido.

---

## 0 · Sobre el servicio "mencionado ayer" — actualización posterior

**Estado inicial del informe (al momento de auditar el repositorio):** no se localizó en `~/.openclaw/workspace` ni en el repositorio ninguna nota fechada 2026-08-21 (ayer) que añadiera un servicio o enfoque nuevo a Weaves. Se declaró la limitación y no se incorporó ningún servicio adicional.

**Estado actualizado (inter-sesión posterior):** otra sesión del sistema ha señalado la existencia de un documento en `/home/hector/.openclaw/workspace/projects/transi/proposals/2026-08-21-asistente-instagram/proposal_content.json`. Lo he leído y lo anexo en §10.

Punto clave: ese documento **no es un servicio de catálogo Weaves**; es una **propuesta comercial cliente-específica para Transi** (folio `TRANSI-IG-2026-001`, versión `0.1 · borrador para revisión`, declarada "Cliente-confidencial · no vinculante"). Por lo tanto:

- **No se incluye** en el análisis de los 9 servicios confirmados del sitio ni en la auditoría de catálogo (§3.3, §4).
- **No se cuenta** entre los hallazgos de contradicciones, duplicaciones o servicios que compiten.
- **Sí se anexa** (§10) como **posible evolución de la oferta Weaves**, con etiqueta explícita de "borrador no vinculante" para que no se mezcle con servicios confirmados.

`WEAVES.md` (en `~/.openclaw/workspace`, última actualización 2026-04-21) sigue siendo, en el momento de este informe, la única fuente curada con el catálogo declarado de 9 servicios.

---

## 1 · Lo que un visitante entiende en los primeros segundos

### 1.1 Hero de inicio (`index.html`, líneas 26-48; producción `https://weavewp.com/`)

| Elemento | Texto concreto |
|---|---|
| `<title>` | "Weaves — Recupera el tiempo que ahora gastas en trabajo manual. Sin errores. Sin contratar." |
| H1 | "Recupera el tiempo que ahora gastas en trabajo manual. Sin errores. Sin contratar." |
| Subtítulo | "Automatizamos los procesos operativos de tu empresa — para que tu equipo trabaje en lo que realmente hace crecer el negocio." |
| CTA primario | "Agenda tu diagnóstico" → `href="#"` (no enlaza a `pages/diagnostico-gratuito.html`) |
| CTA secundario | "Ver casos de éxito" → `href="#casos"` (ancla a la sección del propio home) |

**Lectura observable:** el visitante identifica que Weaves automatiza procesos operativos para empresas. No se nombra el sector, ni el tamaño, ni la geografía; no aparece "PYME" ni "España/LatAm" en el hero.

### 1.2 Quiénes Somos (`pages/quienes-somos.html`, líneas 23-37)

- H1: "Tejiendo automatizaciones para que la pyme trabaje mejor, no más."
- Subtítulo: "la tecnología tiene que estar al servicio de tu negocio, y no al revés."
- Visión (líneas 80-86): "Ser el aliado tecnológico de referencia para pymes en España e Hispanoamérica, haciendo que la automatización y la inteligencia artificial formen parte natural de sus operaciones —aportando más orden, claridad y menos esfuerzo."
- Misión (líneas 87-92): "Ayudar a empresas a ahorrar tiempo operativizando, reduciendo fallos, y optimizando el ciclo completo de vida del cliente."

> **Inferencia estratégica (no hecho observable):** la página de inicio no declara "pymes en España y LatAm", pero la página Quiénes Somos sí. El primer impacto se queda en "empresas" genérico. Quien llega de tráfico frío pierde el matiz geográfico y de tamaño durante los primeros segundos.

### 1.3 Propuesta de valor explícita (vs implícita)

| Fuente | Claim principal |
|---|---|
| Hero home | "Recupera el tiempo… Sin errores. Sin contratar." |
| Footer (`components/footer.html`) | "Automatizamos los procesos operativos de tu empresa. Sin letra pequeña, sin compromisos ocultos." |
| `WEAVES.md` | "Automatizamos tu empresa con Inteligencia Artificial" (línea 11). Dolores: trabajo manual, errores operativos, costes altos. |
| Casos de éxito (`pages/casos-exito.html`) | "ROI en 7 meses. 20.000€ ahorrados. 40% más productivos." |
| Diferenciadores (WEAVES.md, líneas 65-70) | "Sin letra pequeña — costes claros desde el inicio / ROI primero / Soluciones probadas / Acompañamiento total / Parte técnica cubierta / Escalable y sostenible" |

> **Hecho observable:** la promesa hard ("20.000€ ahorrados", "+50% de ROI", "70% menos tickets") es específica, pero **se contradice** con el copy de la propia página de Casos de éxito (líneas 30-37), que dice: "actualmente estamos consolidando datos para mostrarte de forma pública". El sitio promete números concretos en el hero que la página Casos admite no poder demostrar todavía.

---

## 2 · Problema que Weaves resuelve, público, diferenciación y CTA

### 2.1 Problema (consolidado)

- Home (`index.html:33`): "los procesos operativos de tu empresa".
- Quiénes Somos (`pages/quienes-somos.html:90`): "ahorrar tiempo operativizando, reduciendo fallos".
- Sectores (`sectores/index.html:38-40`): "falta de tiempo, tareas manuales, herramientas desconectadas".
- Diagnóstico (`pages/diagnostico-gratuito.html:53-60`): "El Cuello de Botella / Caos de Software / Curiosidad Ejecutiva".
- Contacto (`pages/contacto.html:35-43`): "Las tareas manuales ahogan a tu departamento / La retención de datos entre 5 software distintos produce fallos / Buscas eficiencia sin perder control humano".

> **Hecho observable:** los cinco ángulos del problema son coherentes pero están dispersos y no comparten un mismo "enunciado de dolor" entre el home y las páginas interiores. Un visitante ve cinco formulaciones distintas para el mismo problema.

### 2.2 Público

| Página | Cómo define el público |
|---|---|
| `WEAVES.md:19-20` | "PYMEs que quieren crecer sin contratar más personal" |
| `index.html` (sin texto explícito) | "tu empresa" (genérico) |
| `pages/quienes-somos.html:83` | "pymes en España e Hispanoamérica" |
| `pages/diagnostico-gratuito.html:53-66` | "El Cuello de Botella", "Caos de Software", "Curiosidad Ejecutiva" (3 arquetipos) |
| `pages/contacto.html:88-95` | formulario con tramo de equipo (0-5 / 6-15 / 16-30 / 31-50 / 50+) y sector libre |

> **Inferencia estratégica:** la definición cambia entre páginas. La home no dimensiona, pero el formulario de contacto sí (0-5, 6-15, 16-30, 31-50, 50+). Esto implica que Weaves sabe que opera con equipos de 0-50 personas, pero el home no lo dice.

### 2.3 Diferenciación (claims verificables)

- Footer: "Sin letra pequeña, sin compromisos ocultos" (genérico de toda la categoría).
- Quiénes Somos: "metodología práctica, no manuales teóricos" + "ejecutamos, primero observamos bloqueos".
- Casos de éxito: "medimos en estricta coordinación con el cliente" + "transparencia extrema".
- `WEAVES.md:65-70`: "ROI primero / Soluciones probadas / Acompañamiento total / Parte técnica cubierta / Escalable y sostenible".
- Home (testimonio destacado): "Director de Operaciones, Consultora Legal" — sin nombre propio.

> **Inferencia estratégica:** todos los diferenciadores son promesas de **calidad de servicio** ("sin letra pequeña", "acompañamiento", "ROI primero"). Ninguno diferencia a Weaves de **otro automatizador con IA para pymes**. El visitante no encuentra una frase del tipo "somos los únicos que…".

### 2.4 CTA — el embudo real vs el declarado

| CTA | Destino real | Destino declarado |
|---|---|---|
| "Agenda tu diagnóstico" (hero home) | `href="#"` (línea 38 de `index.html`) | debería ir a `pages/diagnostico-gratuito.html` |
| "Ver casos de éxito" (hero home) | ancla `#casos` | OK, ancla |
| "Conocer el servicio" × 3 (features home) | `href="#"` (líneas 105, 165, 224 de `index.html`) | debería ir a `servicios/servicio.html?id=chatbot` / `procesos` / `marketing` |
| "Solicitar diagnóstico gratuito" (big CTA home) | `href="#"` (línea 410) | debería ir a `pages/diagnostico-gratuito.html` |
| "Contactar ahora" (big CTA home) | `href="#"` (línea 411) | debería ir a `pages/contacto.html` |
| "Diagnóstico Estratégico" / "Quiero hablar directo" (casos-exito) | `pages/diagnostico-gratuito.html` y `pages/contacto.html` (líneas 122-123) | OK |
| "Empezar ahora / Solicitar demo / Contactar" (planes-precios) | `pages/contacto.html?plan=start` (líneas 51, 65, 79) | OK |
| `nav-cta` "Diagnóstico gratuito" (header) | `pages/diagnostico-gratuito.html` | OK |
| `nav-mobile-only` "Diagnóstico gratuito" | `pages/diagnostico-gratuito.html` | OK |
| "Empezar diagnóstico interactivo" (diagnóstico) | modal interno `startDiagnostic()` | OK |
| "Enviar Contexto y Solicitar Valoración" (contacto) | `https://formspree.io/f/myzokzod` (línea 96) | OK, Formspree externo |

> **Hecho observable crítico:** **el hero del home y tres CTAs principales del home apuntan a `href="#"`.** Un visitante que llega por primera vez al home y hace clic en cualquiera de los dos botones principales termina recargando la misma página sin ir al diagnóstico. Esto anula el embudo principal. (Verificable en `index.html` líneas 38, 105, 165, 224, 410, 411.)

---

## 3 · Auditoría página a página (con rutas y evidencia)

### 3.1 Home — `index.html` (596 líneas)

- **Mensaje:** "Recupera el tiempo que ahora gastas en trabajo manual. Sin errores. Sin contratar." + "Automatizamos los procesos operativos".
- **Estructura observable (secciones):** NAV → Hero → Marquee (logos) → "Resultados tangibles" (4 KPIs) → Feature 01 Atención al cliente → Feature 02 Procesos internos (oscuro) → Feature 03 Marketing y ventas → CTA "9 soluciones" → Tech (18 marcas) → Caso destacado → Testimonios (6 tarjetas, duplicadas para loop) → BIG CTA → FOOTER.
- **Coherencia con el catálogo:** el home **solo desarrolla 3 de los 9 servicios** (atención al cliente, procesos, marketing); los otros 6 (consultoría, integraciones, web, embudo, dashboard, mantenimiento) quedan delegados al enlace genérico "Ver todas las soluciones →".
- **CTA rota:** ver §2.4.

### 3.2 Navegación — `components/header.html`

- Enlaces: Inicio · Servicios · Sectores · Casos de Éxito · Quiénes Somos · Blog · Contacto + CTA "Diagnóstico gratuito".
- **Ausencia observable:** **Planes y Precios no está en la navegación principal**, aunque existe `pages/planes-precios.html` y aparece en `sitemap.xml`. La página es huérfana para el usuario.
- **Ausencia observable:** Sectores no tiene dropdown; es un link plano. Si quisieras priorizar sectores, la nav no lo refleja.

### 3.3 Servicios — `servicios/index.html` (784 líneas) + `servicios/servicio.html` (223, plantilla) + `servicios/data/servicios.json`

- **Catálogo mostrado (9):** 01 Consultoría · 02 Chatbot · 03 Marketing · 04 Procesos (RPA) · 05 Integraciones · 06 Web · 07 Embudo · 08 Dashboard · 09 Mantenimiento.
- **Catálogo en `WEAVES.md` (9):** 01 Consultoría · 02 Implementación y ejecución · 03 Atención al cliente · 04 Marketing y redes · 05 RPA · 06 Integraciones · 07 Web · 08 Capacitación y acompañamiento · 09 Productos y soluciones preconfiguradas.

> **Hecho observable — divergencia entre fuentes oficiales:**
>
> | Servicio | En `WEAVES.md` | En `servicios/index.html` | Coincide |
> |---|---|---|---|
> | Consultoría estratégica | ✅ | ✅ | Sí |
> | Implementación/ejecución | ✅ | ❌ | NO en sitio |
> | Atención al cliente / Chatbot | ✅ | ✅ | Sí |
> | Marketing y redes | ✅ | ✅ | Sí |
> | RPA / Procesos | ✅ | ✅ | Sí |
> | Integraciones | ✅ | ✅ | Sí |
> | Web inteligente | ✅ | ✅ | Sí |
> | Capacitación / acompañamiento | ✅ | ❌ | NO en sitio |
> | Productos preconfigurados | ✅ | ❌ | NO en sitio |
> | Embudo de ventas | ❌ | ✅ | NO en WEAVES.md |
> | Dashboard y reportes | � | ✅ | NO en WEAVES.md |
> | Mantenimiento y soporte | � | ✅ | NO en WEAVES.md |
>
> **3 servicios del sitio no existen en `WEAVES.md`** (embudo, dashboard, mantenimiento) y **3 servicios de `WEAVES.md` no existen en el sitio** (implementación, capacitación, productos preconfigurados). El catálogo oficial declarado y el catálogo desplegado son diferentes.

- **Sub-páginas `servicios/*.html`:** 11 archivos son redirecciones (`window.location.replace("servicio.html?id=X")`) hacia la plantilla `servicio.html` que se hidrata con `data/servicios.json`. **Esto está bien implementado**, pero hay archivos `plantilla.html` y `capacitacion-soporte.html` que **no están en el JSON** (verificable: `plantilla` y `capacitacion-soporte` no son claves del JSON; `consultoria`, `chatbot`, `marketing`, `procesos`, `integraciones`, `web`, `embudo`, `dashboard`, `mantenimiento` sí lo son). Esos dos `.html` siguen siendo redirectores, pero al llegar a `servicio.html?id=plantilla` o `?id=capacitacion-soporte`, el script hace `if (!data) return;` y deja la página en blanco con solo el hero.
- **CTA "Conocer más":** en `servicios/index.html` los 9 CTA apuntan a `chatbot.html`, `consultoria.html`, etc. — funcionan porque los archivos existen y redirigen.

### 3.4 Sectores — `sectores/index.html` + 6 páginas + `sectores/sector.html` (plantilla) + `data/sectores.json`

- **Sectores listados en `sectores/index.html`:** Comercio electrónico, Servicios profesionales y consultoras, Salud/Clínicas, Educación/Academias, Restauración y turismo, Startups/SaaS.
- **Tarjeta hero de Sectores (líneas 26-31):** "En Weaves no hablamos de 'empresas en general'. Trabajamos con tiendas online, clínicas, academias, despachos, restaurantes y proyectos digitales que lidian cada día con los mismos problemas." — **bien diferenciado**.
- **Duplicación de contenido — `sectores/salud.html`, `sectores/restauracion-turismo.html`, `sectores/servicios-profesionales.html`, `sectores/startups.html`:**
  - Mismo `<title>` en los cuatro: "Más orden, menos carga operativa, sin crecer en estructura | Weaves Premium".
  - Misma `<meta description>`: "Ayudamos a despachos, asesorías, agencias, estudios y empresas de servicios a reducir tareas repetitivas, ordenar procesos y mejorar la experiencia de cliente, sin necesidad de ampliar equipo."
  - Mismo `<h1 id="s-title">`, mismo `<div id="s-badge">Servicios Profesionales y Consultoras</div>`, mismo `<p id="s-lead">`.
  - Mismos retos (mismo orden, mismos textos), misma estructura antes/después, mismos casos.
  - Solo `sectores/ecommerce.html` y `sectores/educacion.html` tienen contenido distinto y propio.
  - Verificable por tamaño (cada archivo de los 4 duplicados mide exactamente 238 líneas; `ecommerce.html` mide 258; `educacion.html` mide 227) y por `grep` directo.
- **Esto es un problema SEO y de percepción de marca**: Google puede consolidar estas 4 URLs en una sola señal de baja calidad; un visitante que pinche "Salud" espera ver salud y encuentra el copy de "Servicios Profesionales".
- **Plantilla `sectores/sector.html`:** existe y consume `data/sectores.json`, pero **ninguno de los 6 HTML de sector usa esta plantilla**. Está huérfana.

### 3.5 Casos de éxito — `pages/casos-exito.html` (144 líneas)

- H1: "Casos de éxito y ROI".
- Subtítulo: "Lo que ya estamos logrando con automatización e IA **(y lo que documentaremos al milímetro aquí muy pronto)**."
- Escenario de sectores: solo 3 ejemplos genéricos (E-commerce, Consultoría, Clínica & Salud).
- Caso destacado del home ("ROI en 7 meses. 20.000€ ahorrados. 40% más productivos") — **no tiene página propia ni nombre de cliente** ("Director de Operaciones, Consultora Legal"). El botón "Ver el caso completo" en el home apunta a `href="#"` (línea 311 de `index.html`).
- **Inferencia estratégica:** el sitio está admitiendo que los casos no están maduros y, al mismo tiempo, los usa en el hero con números. El copy "muy pronto" + números concretos = **contradicción de marca**.

### 3.6 Planes y precios — `pages/planes-precios.html` (157 líneas)

- 3 planes: **Start** "Desde €497/mes", **Growth** "Desde €997/mes", **Pro** "Desde €1.997/mes".
- Start incluye "Chatbot básico IA, 1 canal, 1.000 conversaciones/mes, 1 proceso automatizado simple".
- Growth (destacado): "Chatbot IA multicanal, hasta 3 canales, 5.000 conversaciones, 3-5 procesos, integraciones CRM/ERP, panel de análisis, 2 horas consultoría/mes".
- Pro: "IA avanzada personalizada, canales ilimitados, conversaciones ilimitadas, procesos ilimitados, integraciones complejas, soporte 24/7".
- **Inconsistencia con el catálogo:** los planes están **centrados en chatbot** (métrica principal: conversaciones/mes). Esto no encaja con la promesa del home ("procesos operativos", "9 soluciones") y mucho menos con la página de servicios, que vende 9 líneas distintas. Un visitante que pincha "planes" esperando ver precios de implementación, marketing, embudo o mantenimiento encuentra solo tiers de chatbot.
- **Huérfano en navegación** (ver §3.2).

### 3.7 Contacto — `pages/contacto.html` (208 líneas)

- H1: "Hablemos de tus procesos, no de 'IA' en abstracto." (excelente diferenciador).
- Subtítulo: "No perdemos el tiempo, y sabemos que tú tampoco. Aquí solo hay espacio para soluciones prácticas, medibles y viables de extremo a extremo."
- CTA WhatsApp: `https://wa.me/1234567890` — **número placeholder literal `1234567890`**, no es un número real.
- Email: `mailto:contacto@weaves.com` — el dominio del sitio es `weavewp.com`; `weaves.com` no necesariamente está bajo control de Héctor.
- Formulario → `https://formspree.io/f/myzokzod` — Formspree externo.
- Steps posteriores: "Auditoría de Fit / Sesión o Veredicto / Arquitectura y Coste". Es **el embudo más explícito del sitio** y, sin embargo, los CTAs principales del home no conducen aquí.

### 3.8 Diagnóstico gratuito — `pages/diagnostico-gratuito.html` (209 líneas)

- H1: "¿Cuánto puedes automatizar en tu empresa?"
- Subtítulo: "Un diagnóstico mixto (IA + Cerebro Humano) que revisa tus flujos operativos actuales y detecta puntos ciegos de ineficiencia."
- Modal con `js/diagnostic-chat.js` (912 líneas) que dispara webhook `https://n8n.weavewp.com/webhook-test/c1d7aaaf-447a-4da5-a37f-bb3ca8227591` — **endpoint `webhook-test`** de n8n, lo que suele ser efímero; cualquier persona que cierre y vuelva a abrir tras un redeploy de n8n verá el flujo roto.
- "Auditoría Experta Humana" + "Informe accionable en 48 hrs" + "Gratuito".
- Es la página **mejor construida del sitio** y, paradójicamente, la **menos accesible desde el home**.

### 3.9 Blog — `pages/blog.html` (114 líneas)

- Carga dinámica vía `js/blog-wp.js` (242 líneas). No verifiqué si el feed WP está activo en producción; el `div` "Cargando artículos…" es el único renderizado estático.
- Filtros: Todos, Guías, Casos de uso, Herramientas, Tendencias.

---

## 4 · Contradicciones, promesas genéricas, duplicaciones y servicios que compiten

### 4.1 Contradicciones (hechos observables)

1. **Catálogo:** WEAVES.md dice 9 servicios con (1) Implementación, (2) Capacitación, (3) Productos preconfigurados. El sitio dice 9 servicios distintos con (1) Embudo, (2) Dashboard, (3) Mantenimiento. Son dos catálogos diferentes para la misma marca.
2. **Casos de éxito:** la página admite "lo que documentaremos aquí muy pronto" (`pages/casos-exito.html:34`) mientras el home publica "ROI en 7 meses. 20.000€ ahorrados. 40% más productivos" (`index.html:288`).
3. **CTA del home:** "Agenda tu diagnóstico" → `href="#"` (línea 38), no a la página de diagnóstico gratuita. El diagnóstico existe y está bien hecho pero el home no lleva a él.
4. **Planes y servicios:** planes enfocados a chatbot (`pages/planes-precios.html`); servicios ofrecidos como 9 líneas modulares (`servicios/index.html`). El visitante no entiende si compra "un plan" o "un servicio".
5. **Sectores duplicados:** 4 sectores comparten meta title y meta description y h1 — penalización SEO probable.
6. **Tagline en `WEAVES.md`:** "Automatización con IA para Empresas" — neutral. Tagline en home (`<title>`): "Recupera el tiempo…". Tagline en footer: "Automatizamos los procesos operativos". **Tres formulaciones para lo mismo**.

### 4.2 Promesas genéricas (hechos observables)

- "Poder de enterprise, coste de PYME" (`index.html:227`) — slogan de toda la categoría.
- "Sin letra pequeña" / "ROI primero" / "Acompañamiento total" (footer, why-section, `WEAVES.md`) — claims que cualquier agencia o consultora firma.
- "+50% de ROI" en el dashboard mock (`index.html:217`) — sin atribución a un cliente real.
- "95% menos errores humanos" (`index.html:84`) — sin atribución.
- "Respuesta en 24h" (footer + planes + contacto) — promesa operacional, no de marca.

> **Inferencia estratégica:** ninguna de las seis promesas hard del home ("400 h/día", "95%", "30-50%", "24/7", "+52% ROI", "8.40€ CPA") está firmada por un cliente. Eso convierte al hero en una promesa de marketing y erosiona la promesa de transparencia que la propia marca declara.

### 4.3 Duplicaciones (hechos observables)

- **Páginas de sector duplicadas (4):** salud, restauracion-turismo, servicios-profesionales, startups (`sectores/*.html`, 238 líneas cada una, mismo `<title>`, misma meta, mismo h1).
- **Testimonios duplicados:** 6 tarjetas en `index.html` están duplicadas para crear el loop marquee (líneas 333-449 vs 449-526). Es un patrón de UI legítimo, pero el contenido se repite literal.
- **Sitemap vs realidad:** `sitemap.xml` lista URLs que no existen en el repo (`servicios/atencion-cliente-chatbots.html`, `servicios/implementacion-soluciones.html`, `servicios/capacitacion-soporte.html`, `servicios/consultoria-estrategica.html`, `servicios/productos-preconfigurados.html`, `servicios/sitios-web-inteligentes.html`, `pages/solicitud-cliente.html`). Las páginas reales son otras (`servicios/chatbot.html`, `servicios/consultoria.html`, `pages/contacto.html`, etc.).
- **CTAs que apuntan a `#`:** 6 en `index.html` (38, 105, 165, 224, 311, 410, 411). Más los `href="#"` en servicios/index.html y otros.
- **README desactualizado:** `README.md` describe la estructura de archivos vieja (sin subcarpetas `servicios/`, `sectores/`, sin template `servicio.html`).

### 4.4 Servicios que compiten entre sí (hechos observables)

- **"Chatbot" vs "Marketing":** ambos prometen generar contenido y automatizar comunicación con clientes; el caso de uso "publicación automática de posts" (`servicios/data/servicios.json:chatbot.casos[1]` y `marketing.casos[0]`) se solapa.
- **"Integraciones" vs "Procesos (RPA)":** el primero se vende como "conectar tus herramientas" y el segundo como "automatizar tareas administrativas". En la práctica, los dos casos de uso se ejecutan con la misma tecnología (n8n + APIs). Un visitante tiene que entender la diferencia.
- **"Embudo" vs "Marketing":** el primero automatiza "nurturing y scoring"; el segundo automatiza "calendarios y publicación". El límite entre ambos no está declarado.
- **"Mantenimiento" vs el resto:** se ofrece como línea separada (€€/mes) **y** como incluido en "todos los planes" (`pages/planes-precios.html:144`). Doble lectura: ¿es un servicio aparte o una garantía?
- **"Capacitación y acompañamiento" (WEAVES.md:8)** vs la línea de "Mantenimiento y soporte" del sitio: si la primera existe, la segunda se solapa.
- **"Implementación y ejecución" (WEAVES.md:2):** implícitamente está dentro de todos los demás servicios; como línea separada pierde significado.

> **Inferencia estratégica:** cuando un visitante ve "9 servicios" y luego 3 planes de chatbot, deduce que Weaves es **una empresa de chatbots** con extras. El catálogo modular compite consigo mismo.

---

## 5 · Arquitectura recomendable (mensaje, oferta, jerarquía, conversión)

### 5.1 Mensaje central (propuesta de AURA, NO hecho observable)

**Una frase de posicionamiento:**

> "Automatizamos los procesos operativos de tu pyme para que tu equipo trabaje en lo que hace crecer el negocio — con números, no con demos."

**Por qué esta y no la actual:**

- **Recupera la promesa de transparencia** que la marca ya enarbola ("sin letra pequeña", "ROI primero", "transparencia extrema") y que el sitio hoy rompe con números sin atribución.
- **Dimensiona el público** ("pyme") que el home obvia y el formulario asume.
- **Conecta con la fricción real** que el visitante tiene (procesos operativos) en lugar del beneficio abstracto ("recuperar el tiempo").
- **Establece el estándar** que ya la marca exige a sí misma en Casos de éxito: "datos consolidados, no métricas volátiles".

**Variantes cortas para reusar:**

- Hero: "Recuperamos las horas que tu pyme pierde en procesos operativos. Sin contratar, sin errores, sin demos vacías."
- Subtítulo: "Implementamos automatizaciones con IA en 30 días y medimos resultados contigo desde el primer mes."
- Footer: "Automatizamos los procesos operativos de tu pyme. Coste claro, plan claro, números firmados."

### 5.2 Oferta agrupada en 3 pilares (recomendación estratégica)

Partiendo de los 12 ítems observados (9 del sitio + 3 de `WEAVES.md`), propongo consolidar en **3 pilares** que un visitante entiende sin tener que recordar 9 etiquetas:

| Pilar | Lo que agrupa | Lógica de agrupación |
|---|---|---|
| **1. Diagnóstico y hoja de ruta** | Consultoría estratégica · Implementación · Capacitación | Todo lo que ocurre **antes y durante** la puesta en marcha |
| **2. Automatizaciones en marcha** | Chatbot/Atención al cliente · RPA/Procesos · Integraciones · Web inteligente · Embudo · Marketing · Productos preconfigurados | Todo lo que **opera** sobre los procesos del cliente |
| **3. Operación y soporte continuo** | Dashboard y reportes · Mantenimiento y soporte · Capacitación recurrente | Todo lo que ocurre **después** de la puesta en marcha |

**Por qué esta agrupación (inferencia estratégica):**

- Coincide con el "antes/durante/después" que la propia página de contacto y la de diagnóstico ya cuentan (`pages/contacto.html:135-180`, `pages/diagnostico-gratuito.html:108-128`).
- Resuelve la contradicción de los planes: Start/Growth/Pro se redefinen como **alcance dentro del pilar 2** (chatbot) + **activación del pilar 1 y 3**, lo que elimina la lectura "solo vendemos chatbot".
- Permite una home con 3 tarjetas (no 9) y drill-down a los servicios específicos sin perder SEO.
- Coincide con el "antes/durante/después" que el sitio ya cuenta en Quiénes Somos (`pages/quienes-somos.html:120-125`).

### 5.3 Jerarquía de páginas recomendada

```
Inicio (mensaje + 3 pilares + 1 caso firmado + CTA)
├── Pilar 1 — Diagnóstico e implementación
│   ├── /servicios/consultoria.html         (existe)
│   ├── /servicios/implementacion.html     (NUEVO; si se mantiene la línea de WEAVES.md)
│   └── /servicios/capacitacion.html       (NUEVO o absorbido en pilar 3)
├── Pilar 2 — Automatizaciones en marcha
│   ├── /servicios/chatbot.html            (existe)
│   ├── /servicios/procesos.html           (existe)
│   ├── /servicios/integraciones.html      (existe)
│   ├── /servicios/web.html                (existe)
│   ├── /servicios/marketing.html          (existe)
│   ├── /servicios/embudo.html             (existe)
│   └── /servicios/plantilla.html          (existe pero sin contenido; absorber o eliminar)
└── Pilar 3 — Operación continua
    ├── /servicios/dashboard.html          (existe)
    └── /servicios/mantenimiento.html      (existe; absorbe "capacitación recurrente")

Sectores                       → 6 páginas (actualmente 4 están duplicadas)
Casos de éxito firmados        → 1 página por caso (hoy no existe ninguna con cliente nombrado)
Quiénes Somos                  → existente, suficiente
Diagnóstico gratuito           → existente, bien construida; promoverla
Contacto                       → existente; resolver WhatsApp placeholder
Planes y precios               → REESCRIBIR: 3 planes × 3 pilares, no tiers de chatbot
Blog                           → existente
```

### 5.4 Recorrido de conversión recomendado

```
Hero del home
   └─→ (CTA único) Diagnóstico gratuito        ← hoy apunta a #
          └─→ Modal conversacional (n8n)        ← existe, webhook-test
                 └─→ Calificación
                       ├─→ Fit negativo: email "no somos para ti, pero…"
                       └─→ Fit positivo: cita de descubrimiento (Calendly / similar)
                              └─→ Propuesta personalizada
                                    └─→ Plan + contrato
```

> **Inferencia estratégica:** hoy el home ofrece 4 CTAs competiendo ("Agenda tu diagnóstico" / "Ver casos de éxito" / "Solicitar diagnóstico gratuito" / "Contactar ahora"). El embudo real del sitio vive en `pages/diagnostico-gratuito.html` y `pages/contacto.html`, pero el home no prioriza ni uno ni otro. **Un embudo con un solo CTA primario funcionaría mejor que cuatro CTAs en paralelo.**

---

## 6 · Recomendación principal, alternativas, quick wins y lo que NO debe hacerse aún

### 6.1 Recomendación principal

**Recortar a 3 pilares antes de seguir añadiendo páginas.** El catálogo está sobredimensionado para el estado actual de la marca (casos no firmados, números sin atribución, sectores duplicados). Más oferta ≠ más ventas cuando la oferta todavía no se sostiene.

- Acción concreta: **definir los 3 pilares en una sola sesión** (Diagnóstico+Implementación, Automatizaciones, Operación continua), reasignar los 9 servicios del sitio a esos 3, actualizar `servicios/index.html`, `WEAVES.md`, footer y sitemap.
- Criterio de éxito: el visitante que ve la home durante 10 segundos entiende los 3 pilares sin tener que recordar nombres.

### 6.2 Alternativas (si la decisión es no recortar)

| Alternativa | Cuándo aplicarla | Riesgo |
|---|---|---|
| **A. Mantener 9 servicios pero agruparlos visualmente** | Si hay demanda real por las 9 líneas | No resuelve la fragmentación |
| **B. Cambiar la home a "3 problemas → 3 soluciones → 1 CTA"** | Si se prefiere un pivote de marketing sin tocar el catálogo | Resuelve claridad pero deja la incoherencia `WEAVES.md` vs sitio |
| **C. Reducir a 4 servicios: Consultoría, Chatbot, Procesos, Web** | Si se decide que el resto son "incluidos" en los principales | Pierde SEO de long-tail ya generado en cada URL |

### 6.3 Quick wins (≤ 1 día cada uno, sin tocar estructura)

1. **Arreglar los `href="#"` del home** (`index.html:38, 105, 165, 224, 311, 410, 411`) y dirigirlos a `pages/diagnostico-gratuito.html`, `servicios/servicio.html?id=chatbot`, `?id=procesos`, `?id=marketing`, `pages/casos-exito.html`, `pages/diagnostico-gratuito.html`, `pages/contacto.html` respectivamente.
2. **Quitar del home los números sin atribución** (400 h/día, 95%, 30-50%, 24/7) hasta tener casos firmados, o rotularlos como "objetivo de diseño" en lugar de "resultado".
3. **Eliminar `sectores/salud.html`, `sectores/restauracion-turismo.html`, `servicios-profesionales.html`, `sectores/startups.html`** o reemplazar su contenido por el específico del sector (mínimo: h1, lead y retos distintos).
4. **Corregir `sitemap.xml`** para que refleje las URLs reales del repo, no las planeadas en el README.
5. **Quitar el placeholder `wa.me/1234567890`** en `pages/contacto.html:78` y poner el número real o eliminar el botón.
6. **Sustituir el email `contacto@weaves.com`** por `contacto@weavewp.com` (o el real) en `pages/contacto.html:73`.
7. **Añadir `Planes y precios` a la navegación principal** o, si se decide mantener oculto, quitarlo del sitemap y de la lista de "Por qué Weaves".
8. **Cambiar `webhook-test` por `webhook`** en `pages/diagnostico-gratuito.html:178` (n8n distingue ambos; `webhook-test` se borra tras cada redeploy).

### 6.4 Lo que NO debe hacerse aún

- **No añadir el servicio "mencionado ayer"** (si existe) sin antes cerrar el catálogo actual. Añadir a una casa sin cimientos es construir sobre arena.
- **No lanzar nuevos planes** (Start/Growth/Pro) hasta que la promesa de transparencia esté firmada con un caso real.
- **No publicar más testimonios** sin verificar nombre + cargo + empresa. El sitio ya tiene 6 testimonios (todos con iniciales) y el home tiene un "Director de Operaciones, Consultora Legal" anónimo.
- **No añadir más sectores** antes de resolver las 4 páginas duplicadas actuales.
- **No invertir en SEO técnico** hasta que el contenido duplicado esté resuelto. Canonicalización no arregla percepción de marca.
- **No separar "implementación" como línea de servicio** mientras no esté en el sitio; manténgase en `WEAVES.md` como nota interna.

---

## 7 · Recomendaciones priorizadas (Alta / Media / Baja)

### 🔴 ALTA (impacto directo en conversión y credibilidad)

1. **Resolver los CTAs rotos del home** (`index.html` 6 puntos).
   *Mensaje ejemplo para CTA primario:* "Empieza tu diagnóstico gratuito (sin compromiso, 48h)" → `pages/diagnostico-gratuito.html`.

2. **Consolidar el catálogo a 3 pilares** y reasignar los 9 servicios actuales.
   *Mensaje ejemplo para el hero:* "Automatizamos los procesos operativos de tu pyme para que tu equipo trabaje en lo que hace crecer el negocio."

3. **Eliminar o reescribir las 4 páginas de sector duplicadas** (`sectores/salud.html`, `restauracion-turismo.html`, `servicios-profesionales.html`, `startups.html`).
   *Mensaje ejemplo para `sectores/salud.html`:* "Tu clínica con respuestas 24/7, recordatorios en cascada y agenda sincronizada — sin ampliar equipo."

4. **Reconciliar `WEAVES.md` con el sitio:** decidir si Implementación, Capacitación y Productos preconfigurados viven como servicios visibles o se absorben. Hoy están en dos catálogos distintos.

5. **Reescribir `pages/planes-precios.html`:** planes por pilar, no por tier de chatbot.
   *Mensaje ejemplo para Growth:* "Pilar 2 completo (chatbot + procesos + integraciones) + 2 h/mes de consultoría y soporte del Pilar 3."

### 🟡 MEDIA (impacto en coherencia y eficiencia)

6. **Reescribir el home para que muestre los 3 pilares** en lugar de las 3 features detalladas actuales (atención, procesos, marketing) que dejan 6 servicios sin representación visible.

7. **Firmar al menos 1 caso real** con nombre, métricas reales y arquitectura (n8n + integraciones) y darle página propia. Sustituye el caso anónimo del home.

8. **Corregir `sitemap.xml`** para que liste las URLs reales del repo, no las planeadas en el README.

9. **Eliminar `sectores/sector.html`** y `js/sector-loader.js` si no se va a usar la plantilla dinámica, o migrar las 6 páginas a esa plantilla.

10. **Actualizar `README.md`** para reflejar la estructura real (`servicios/`, `sectores/`, `components/`, `data/`, `assets/`, `legal/`, `images/`).

11. **Eliminar archivos huérfanos** que no se usan: `servicios/plantilla.html`, `servicios/capacitacion-soporte.html`, `pages/solicitud-cliente.html` (citado en sitemap), `js/diagnostic-form.js`, `js/client-request-form.js`, `js/proyecto-search.js`, `index.html.old` (verificable en `ls`).

### 🟢 BAJA (impacto en pulido)

12. **Mover el caso destacado del home** desde una cita anónima ("Director de Operaciones, Consultora Legal") a un caso firmado. Si no hay caso firmado, eliminar el bloque.

13. **Unificar las 3 formulaciones de tagline** (home / footer / WEAVES.md) en una sola línea aprobada.

14. **Añadir `Planes y precios` a la navegación principal** o quitarla de la web hasta que esté reescrita.

15. **Rotular los números del hero** ("400 h/día", "95%") como "objetivo de diseño" o "promedio de nuestros clientes" si no se pueden firmar.

16. **Sustituir los iconos `<i data-lucide="…">`** que dependen de un CDN (`https://unpkg.com/lucide@latest`) por SVG inline o un bundle local, para evitar que un corte de CDN rompa el sitio.

---

## 8 · Resumen de hallazgos verificables en una página

| # | Hallazgo | Evidencia (ruta:línea) |
|---|---|---|
| 1 | 6 CTAs del home apuntan a `href="#"` | `index.html:38, 105, 165, 224, 311, 410, 411` |
| 2 | Catálogo sitio ≠ catálogo WEAVES.md (3 servicios en cada lado no coinciden) | `WEAVES.md:34-78` vs `servicios/index.html:178-410` |
| 3 | 4 páginas de sector son duplicados (mismo `<title>`, mismo h1, mismo lead) | `sectores/salud.html`, `restauracion-turismo.html`, `servicios-profesionales.html`, `startups.html` (238 líneas c/u, mismo MD5-like) |
| 4 | Caso destacado del home sin cliente nombrado | `index.html:288-309` |
| 5 | Planes-precios es página huérfana (no está en nav) | `components/header.html` (sin link); `sitemap.xml:91-95` |
| 6 | WhatsApp placeholder `wa.me/1234567890` | `pages/contacto.html:78` |
| 7 | Email `contacto@weaves.com` (dominio distinto al sitio) | `pages/contacto.html:73` |
| 8 | Webhook de n8n en modo `webhook-test` (efímero) | `pages/diagnostico-gratuito.html:178` |
| 9 | Sitemap lista URLs que no existen en el repo | `sitemap.xml:33-58, 99` |
| 10 | README describe estructura de archivos obsoleta | `README.md:5-53` |
| 11 | `index.html.old` queda en el repo | `ls /home/hector/.openclaw/workspace/weaves-premium-web` |
| 12 | 6 testimonios del home están duplicados para loop | `index.html:333-449 vs 449-526` |
| 13 | `data/sectores.json` tiene contenido para 6 sectores pero solo `sectores/sector.html` lo consume | `js/sector-loader.js` vs `sectores/*.html` (ninguno carga el JSON) |
| 14 | `servicios/plantilla.html` y `servicios/capacitacion-soporte.html` redirigen a una página sin contenido en el JSON | `data/servicios.json` (sin clave `plantilla` ni `capacitacion-soporte`) |
| 15 | Hero del home promete números concretos; página Casos admite que aún no se pueden publicar | `index.html:79-95` vs `pages/casos-exito.html:30-37` |

---

## 9 · Estado de la revisión

- **Repositorio auditado:** `/home/hector/.openclaw/workspace/weaves-premium-web`
- **Producción consultada:** `https://weavewp.com`, `https://weavewp.com/servicios/`, `https://weavewp.com/sectores/`, `https://weavewp.com/pages/casos-exito.html`, `https://weavewp.com/pages/planes-precios.html` — todas respondieron HTTP 200 y el contenido coincide con el repositorio (no hay drift entre repo y producción).
- **Archivos NO modificados:** ninguno del sitio. Este informe es el único archivo nuevo creado.
- **No se ha hecho commit ni push.**
- **Limitación declarada (versión inicial):** al momento del primer pase no se localizó ningún archivo del workspace que documentara un servicio o enfoque adicional mencionado "ayer" (2026-08-21) para Weaves.
- **Actualización posterior:** otra sesión aportó la ruta `projects/transi/proposals/2026-08-21-asistente-instagram/proposal_content.json`. Leído y anexado como §10, **separado de los servicios confirmados** porque es una propuesta cliente-específica en estado de borrador no vinculante.
- **Próximo paso recomendado:** ejecutar los quick wins del §6.3 en una sola sesión (≤ 1 día) antes de cualquier decisión de replataforma. La posible evolución detectada en §10 NO debe sumarse al catálogo público hasta que se decida conscientemente.

---

*Informe elaborado por AURA sobre el repositorio `weaves-premium-web`. Solo hechos observables del código/contenido y, cuando se indica, de la producción.*

---

## 10 · Anexo · Posible evolución detectada (BORRADOR NO VINCULANTE)

> **Aviso importante:** este anexo documenta un documento de trabajo que **no forma parte del catálogo confirmado de Weaves**. Es una propuesta cliente-específica en estado de borrador, citada únicamente como referencia para una posible evolución de la oferta. No se ha utilizado en las auditorías de §3, §4 ni en las recomendaciones priorizadas de §7.

### 10.1 Origen y naturaleza del documento

| Campo | Valor (extraído literalmente del JSON) |
|---|---|
| Ruta | `/home/hector/.openclaw/workspace/projects/transi/proposals/2026-08-21-asistente-instagram/proposal_content.json` |
| Título | "Asistente conversacional de Instagram para Transi" |
| Subtítulo | "Implementación y operación mensual sobre la cuenta ManyChat existente" |
| Folio | `TRANSI-IG-2026-001` |
| Versión | `0.1 · borrador para revisión` |
| Fecha | 21 de agosto de 2026 |
| Autor | "Héctor Muñoz · Weaves" |
| Cliente | "Transi Aracil" |
| Confidencialidad | "Cliente-confidencial · no vinculante" |
| Método declarado | "Método CLARO IA · piloto supervisado" |
| Archivos asociados en la misma carpeta | `propuesta-asistente-conversacional-instagram.{docx,html,pdf}` + `render_proposal.py` + `assets/` |

### 10.2 Resumen del servicio descrito (texto literal del JSON)

> "Weaves configurará y operará un asistente conversacional de Instagram sobre la cuenta ManyChat existente de Transi: **responderá preguntas aprobadas, orientará a la persona y derivará las conversaciones que necesiten criterio humano, sin ejecutar acciones de negocio**. La operación mensual propuesta es de **150 €** tras una implementación inicial cuyo importe y descuento se confirmarán antes de arrancar."

### 10.3 Características observables

- **Alcance conversacional puro, no transaccional.** El asistente no ejecuta reservas, pagos, cambios en sistemas externos, publicaciones ni campañas; solo conversa, orienta y deriva.
- **Base de conocimiento aprobada por el cliente**; fallback explícito: "Ante una duda, un tema sensible o una situación que requiera criterio profesional, su comportamiento esperado será reconocer el límite y derivar."
- **Exclusiones declaradas** (no incluidas en el piloto, según §"Límites y exclusiones" del JSON):
  - Reservas, pagos o cobros.
  - Cambios en CRM, hojas de cálculo, agendas o expedientes.
  - Publicar, dar likes, comentar, seguir cuentas o enviar mensajes proactivos en Instagram.
  - Consejo clínico o de crisis.
  - Información no aprobada (no inventa precios, fechas, plazas, resultados, disponibilidad).
  - Nuevos canales o integraciones (WhatsApp, webchat, CRM).
  - Costes de terceros (licencia ManyChat, consumo de IA) no incluidos.
- **Implementación por fases (4): Descubrimiento → Configuración → Pruebas → Piloto supervisado de 30 días.
- **KPIs propuestos para el piloto:** conversaciones resueltas sin intervención, conversaciones derivadas, preguntas sin respuesta, tiempo de primera respuesta, respuestas corregidas, coste por conversación.
- **Riesgos y controles documentados:** respuesta imprecisa, tema sensible, información desactualizada, dependencia de ManyChat, coste variable de IA, accesos a cuentas.

### 10.4 Datos económicos declarados

| Concepto | Importe | Condición explícita |
|---|---|---|
| Implementación inicial | **800 €** (referencia) | "Importe base orientativo; se confirma tras la revisión técnica y de contenidos." |
| Operación mensual | **150 €/mes** | "Un perfil de Instagram, mantenimiento, monitorización y pequeños ajustes dentro del alcance." |
| ManyChat y consumo de IA | No incluido | Lo paga Transi directamente o se añade al acuerdo. |
| Ampliaciones | A presupuestar | "Nuevos canales, integraciones, grandes cambios o nuevos servicios quedan fuera del piloto." |
| **Descuento de implementación** | **Pendiente de decisión** | "No se ha comprometido ningún descuento." |

### 10.5 Lo que confirma el documento (hechos observables)

1. Es la **primera conversación de trabajo del 21/08/2026** la que fija el encuadre conversacional (sin acciones de negocio) y la mensualidad de 150 € ([S1] del JSON).
2. Los importes están declarados como **referencia o propuesta**, no como factura ni compromiso contractual (sección "Naturaleza del documento" del JSON).
3. El documento enumera **decisiones pendientes explícitas** que el propio borrador reconoce como abiertas: importe de implementación definitivo, descuento, volumen incluido, horario de soporte, proveedor y coste de IA, canal de derivación, fecha de inicio.
4. El plan de ManyChat, los flujos activos, los permisos, el volumen mensual y los límites técnicos **no han sido auditados todavía** ([S3] del JSON).

### 10.6 Por qué NO se incluye en el catálogo Weaves

- Es una **propuesta para un cliente identificado** (Transi), no una línea de servicio reutilizable.
- Declara expresamente ser **"borrador no vinculante"** y "cliente-confidencial".
- Su modelo económico depende de **terceros no incluidos** (ManyChat, IA consumida) y de un descuento aún por decidir.
- Su **alcance conversacional** (preguntas frecuentes + derivación) ya está cubierto, en términos generales, por el servicio confirmado "Chatbot de Atención al Cliente" (`servicios/data/servicios.json:chatbot`); este documento lo **acota** a un canal (Instagram), una tecnología (ManyChat) y un modelo de operación (piloto supervisado de 30 días + 150 €/mes) que no existen en el catálogo público.

### 10.7 Lectura estratégica (inferencia AURA, NO contenido del JSON)

> Si en el futuro Weaves quisiera convertir esta propuesta en una **línea de catálogo** para clientes con cuenta de Instagram + ManyChat, el precio y el alcance ya están pre-validados con un cliente real (Transi) en formato piloto supervisado. La conversión a producto requeriría:
>
> 1. Decidir si se publica como variante del "Chatbot" actual (subcaso Instagram + ManyChat) o como línea separada.
> 2. Cerrar los **campos pendientes del JSON** (importe, horario, volumen incluido, descuentos, costes de IA).
> 3. Resolver el conflicto con `WEAVES.md` y con `pages/planes-precios.html`: este documento sugiere una **modalidad de piloto mensual de bajo coste** (150 €/mes) que no encaja con los tiers Start/Growth/Pro actuales (€497 / €997 / €1.997). Si se publica, los planes heredados quedan obsoletos.
> 4. Confirmar si ManyChat pasa a ser **stack declarado** en la sección `tech-section` del home (hoy no aparece, verificable en `index.html:230-281`).

### 10.8 Recomendación operativa para este anexo

- **No incluir** el contenido de este JSON en la home, en `servicios/index.html` ni en `pages/planes-precios.html` sin revisión humana explícita de Héctor.
- **No modificar** ni `WEAVES.md` ni el sitio para incorporar este caso.
- Si se decide más adelante promoverlo a línea de catálogo, hacerlo **después** de ejecutar la recomendación principal de §6.1 (consolidación a 3 pilares), nunca antes.
- Mantener el documento en `projects/transi/proposals/` como histórico cliente-confidencial; no moverlo a `docs/` ni hacerlo público.

### 10.9 Limitación de este anexo

- El análisis se basa **únicamente** en `proposal_content.json`. No se ha contrastado con la versión `.docx` / `.html` / `.pdf` ni con `render_proposal.py` ni con los assets adjuntos.
- No se ha contactado al cliente Transi ni se ha confirmado la aceptación del piloto.
- Las cifras (800 € implementación, 150 €/mes operación) son las declaradas en el JSON; cualquier cambio posterior en versiones siguientes del documento no queda reflejado aquí.
