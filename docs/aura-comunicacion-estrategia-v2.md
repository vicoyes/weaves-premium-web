# AURA · Estrategia de Comunicación V2 — Weaves Premium (Managed AI Operations)

**Fecha:** 2026-08-22 (GMT-5)
**Alcance:** comunicación, posicionamiento y arquitectura de oferta. No incluye rediseño visual, SEO técnico ni usabilidad.
**Fuentes:** repositorio `/home/hector/.openclaw/workspace/weaves-premium-web`, documento estratégico Word (`Weaves_Informe_Managed_AI_Operations_2026…docx`, agosto 2026) y verificación pública de competidores (consultadas 2026-08-22).
**Estado:** V1 mantenida en `aura-comunicacion-estrategia.md` como histórico. V2 corregida y ampliada en este archivo. No se ha modificado ningún archivo del sitio, no se ha hecho commit ni push.

> **Aviso sobre la V1.** La V1 incorporó por error como servicio cliente-específico (`projects/transi/proposals/2026-08-21-asistente-instagram/`) una propuesta borrador no vinculante de un asistente de Instagram para Transi. Esa propuesta **no forma parte del catálogo Weaves ni del encargo** y se mantiene fuera de esta V2. La fuente correcta del servicio estratégico era el documento Word "Managed AI Operations", que es el que esta V2 incorpora como eje central.

---

## 0 · Resumen ejecutivo

1. Weaves tiene un **núcleo estratégico que el sitio no cuenta**: Managed AI Operations (MAI) — un servicio gestionado de procesos digitales con agentes de IA, software y supervisión humana, modelo `Assessment + Setup + Fee mensual + Volumen`. El sitio sigue comunicando "9 servicios para empresas" y eso diluye la propuesta de valor real.
2. El **mensaje principal** debería girar alrededor de una idea que el propio documento define: *"Externaliza procesos, no personas"*. El visitante necesita entender en menos de 10 segundos que Weaves se hace cargo de la operación, no que vende bots.
3. El **catálogo actual (9 servicios)** debe reagruparse en **3 pilares** (Diagnosticar y paquetizar · Operar con IA y humanos · Escalar y mejorar) que reflejen el ciclo real del servicio MAI (Assessment → Pilot → Managed → Expansion) y no una taxonomía por tecnología.
4. La **competencia es más amplia de lo que la V1 dejó entrever**: hay plataformas (Inbenta, indigitall, UiPath, Automation Anywhere, Celonis, n8n, Make, Zapier), agencias/consultoras españolas y latinas con foco en IA para empresas (Aunoa, Chatbot Chocolate, Algoritmia, Intelygenz/VASS), y modelos de "AI + humano" ya operativos en el retail español (TaxDown). Esto abre 3–5 espacios de posicionamiento claros para Weaves, sobre todo en el segmento **"operación gestionada para pyme con compliance y multi-sistema"**.
5. La **página de planes-precios** está conceptualmente rota: oferta tiers de chatbot cuando la tesis real es servicio gestionado por capacidad. Hay que reescribirla, no solo ajustar importes.
6. La comunicación actual mezcla **promesas hard sin atribución** ("400 h/día", "95%", "ROI en 7 meses · 20.000€") con **casos anónimos** ("Director de Operaciones, Consultora Legal") y casos ya publicados en la marquis (Rubik Express, Empieza de Cero, Ananta, Stellamia, Lunea, Zuzel Amelia). Esta inconsistencia erosiona la propia promesa de transparencia.

---

## 1 · Lo que la web dice hoy (auditoría breve con foco en MAI)

> Resumen de hechos observables en el repositorio y en `https://weavewp.com` (producción). La auditoría detallada página a página está en `aura-comunicacion-estrategia.md` (V1); aquí solo se retiene lo que afecta al servicio MAI.

| Elemento | Texto observado | Implicación para MAI |
|---|---|---|
| `<title>` home | "Weaves — Recupera el tiempo que ahora gastas en trabajo manual. Sin errores. Sin contratar." | MAI no aparece. El visitante no sabe que existe una capa de "operación gestionada". |
| H1 | "Recupera el tiempo… Sin errores. Sin contratar." | Reduce MAI a "automatización que te ahorra tiempo". Pierde la idea de responsabilidad operacional. |
| Subtítulo | "Automatizamos los procesos operativos de tu empresa — para que tu equipo trabaje en lo que realmente hace crecer el negocio." | Coherente con la primera frase del documento MAI ("diseña, automatiza y opera"), pero no nombra "operación gestionada" ni "responsabilidad operacional". |
| Features | 3 features: atención al cliente, procesos internos, marketing y ventas | Coherentes con "AI Customer Operations + AI Backoffice + AI Lead Operations" del documento MAI, pero presentadas como servicios sueltos, no como ofertas paquetizadas. |
| Catálogo (`servicios/index.html`) | 9 servicios: Consultoría, Chatbot, Marketing, Procesos, Integraciones, Web, Embudo, Dashboard, Mantenimiento | Refleja **capacidades técnicas**, no el ciclo de servicio. El visitante no entiende si son 9 productos independientes o fases de una misma cosa. |
| Planes (`pages/planes-precios.html`) | Start €497, Growth €997, Pro €1.997 — **centrados en chatbot** (conversaciones/mes, canales) | Incompatible con el modelo MAI (Assessment + Setup + Fee mensual + Volumen). El visitante que pincha "planes" espera ver pricing de operación gestionada y encuentra pricing de chatbot. |
| Casos | "ROI en 7 meses · 20.000€ ahorrados · 40% más productivos" (anónimo) + marquis con Rubik Express, Empieza de Cero, Ananta, Stellamia, Lunea, Zuzel Amelia, Transi, iWisit | Los casos de la marquis son Workshop-level (redes, chatbots puntuales); el caso destacado es anónimo. **No hay un caso firmado de MAI** (operación gestionada con KPIs continuos). |
| Footer | "Automatizamos los procesos operativos de tu empresa. Sin letra pequeña, sin compromisos ocultos." | El claim "sin letra pequeña" choca con un modelo de pricing que el documento MAI reconoce como `Assessment + Setup + Mensualidad + Volumen variable`. El visitante no ve los componentes. |
| CTAs del hero | `href="#"` en 6 puntos del home (verificable en `index.html:38, 105, 165, 224, 311, 410, 411`) | El CTA primario "Agenda tu diagnóstico" no lleva a la página de diagnóstico. El embudo está roto antes de hablar de MAI. |

> **Hecho observable crítico:** **la home menciona "9 soluciones" y los planes ofrecen tiers de chatbot; ningún elemento de la home anuncia Managed AI Operations** como categoría. Esto contradice directamente el documento estratégico "Managed AI Operations 2026", que define MAI como "complementaria a Process Automation" y la describe como la capa recurrente que Weaves debería vender.

---

## 2 · El servicio correcto: Managed AI Operations

Síntesis del documento Word (`Weaves_Informe_Managed_AI_Operations_2026…docx`, "Documento interno de estrategia comercial · Agosto de 2026"). Lo extraigo de forma literal cuando lo cito y lo parafraseo cuando lo reformulo.

### 2.1 Tesis y definición

- **Tesis:** *"Externaliza procesos, no personas. La IA absorbe volumen y repetición; los humanos conservan el control en excepciones, decisiones sensibles y casos de alto riesgo."*
- **Definición operativa:** Weaves diseña, automatiza y opera procesos empresariales mediante agentes de IA, software y supervisión humana, con métricas, trazabilidad y mejora continua.
- **Lo que NO es** (definido por contraste en el documento):
  - No es un chatbot aislado.
  - No es un proyecto puntual de automatización.
  - No es delegación de decisiones críticas a un LLM sin controles.
  - No es venta de horas técnicas sin responsabilidad operacional.

### 2.2 Categoría comercial (tal como aparece en el documento)

| Elemento | Definición |
|---|---|
| Categoría | Managed AI Operations / Operaciones empresariales gestionadas con IA |
| Cliente | Empresas con alto volumen administrativo, comercial, documental o de atención |
| Compra | Capacidad operacional + SLA + mejora continua |
| Modelo | Setup + fee mensual + componente opcional por volumen |
| Diferencial | End-to-end, multi-sistema, human-in-the-loop, observabilidad y optimización continua |

### 2.3 Tipos de procesos externalizables (catálogo interno de MAI)

| Línea | Tareas |
|---|---|
| AI Inbox Operations | Leer, clasificar, extraer datos, asignar, responder y dar seguimiento a emails o solicitudes |
| AI Lead Operations | Capturar, calificar, enriquecer, registrar en CRM, secuenciar y escalar leads |
| AI Customer Operations | Resolver consultas frecuentes, consultar sistemas, actualizar casos, escalar a humano |
| AI Document Operations | Recibir, interpretar, validar, generar, transformar, archivar y enrutar documentos |
| AI Backoffice Operations | Actualizar CRM/ERP, consolidar información, ejecutar controles administrativos |
| AI Workflow Operations | Operar flujos end-to-end que combinan personas, sistemas, reglas, documentos y agentes |

> **Lectura AURA:** estas 6 líneas son **paquetizaciones** sobre las que Weaves puede construir ofertas comerciales, no servicios técnicos distintos. Cada paquete se vende como una capacidad operacional (ej.: "gestionamos hasta 8.000 emails/mes con escalamiento humano y trazabilidad"), no como "instalación de N agentes".

### 2.4 Ciclo de entrega (5 fases)

1. **Process Assessment** — confirmar que existe un proceso automatizable, cuantificar su economía, detectar riesgos. Volumen, tiempo, sistemas, excepciones, coste actual, baseline KPIs y ROI propuesto.
2. **Pilot** — alcance deliberadamente pequeño (un canal, un tipo de solicitud, una unidad de negocio), con datos reales, supervisión y métricas desde el día 1.
3. **Production** — endurecer permisos, observabilidad, manejo de errores, redundancias, documentación, procedimientos de operación.
4. **Managed Operations** — operar continuamente: incidentes, APIs, modelos, costes, calidad, mejoras, nuevas reglas, reentrenamiento.
5. **Expansion** — crecer dentro del cliente de un proceso a otros adyacentes.

### 2.5 Pricing orientativo (literal del documento)

| Componente | Qué cubre | Rango interno orientativo |
|---|---|---|
| Assessment | Mapeo, datos, arquitectura, ROI y roadmap | €750 – €2.500 |
| Setup / implementación | Integraciones, agentes, reglas, pruebas, seguridad y go-live | €3.000 – €15.000+ |
| Managed Operations | Operación, observabilidad, soporte, mejoras y reporting | €1.000 – €5.000+/mes |
| Volumen variable | Uso por encima del paquete incluido | Por operación / caso / documento |

> **Cita textual del documento:** *"Vender paquetes por capacidad operacional y resultado hace que el servicio sea más comparable con un coste empresarial real y menos con una herramienta SaaS."*

### 2.6 KPIs y SLA declarados por el documento

- Coste por operación, tiempo de ciclo, tasa de automatización, tasa de escalamiento, error/retrabajo, throughput, SLA de respuesta, ahorro/capacidad liberada.
- Frase de venta declarada por el documento: *"No te vendemos un bot. Nos hacemos responsables de que el proceso funcione."*
- Criterio de cierre: el cliente debe poder responder tres preguntas tras contratar: ¿cuánto volumen procesa?, ¿cuánto cuesta por operación?, ¿qué porcentaje necesita todavía intervención humana?

### 2.7 Posición competitiva declarada en el propio documento

| Alternativa | Fortaleza | Hueco para Weaves |
|---|---|---|
| BPO tradicional | Personas, volumen, experiencia operacional | Automatizar gran parte del volumen y operar con menor estructura |
| RPA | Determinismo e integración UI | Añadir comprensión de texto/documentos y workflows más flexibles |
| SaaS de agentes | Despliegue rápido y producto estándar | Integración a medida y responsabilidad operacional end-to-end |
| Consultora de IA | Estrategia y proyectos | Operación continua, SLAs y optimización mensual |
| Equipo interno | Conocimiento del negocio | Acelerar sin tener que contratar plataforma, MLOps y automatización internamente |

> **Lectura AURA:** este mapa competitivo del propio documento es el punto de partida natural para el análisis de §4.

### 2.8 Relación con la oferta actual del sitio

- El documento MAI dice: *"Process Automation construye el sistema. Managed AI Operations convierte ese sistema en una operación continua. Ambas ofertas deben convivir: una abre el proyecto; la otra convierte el proyecto en una relación recurrente."*
- En el catálogo actual del sitio (`servicios/data/servicios.json`), las líneas que más se acercan a "Process Automation" son los servicios `procesos`, `integraciones`, `web`, `marketing`, `embudo`. Las que más se acercan a "Managed Operations" son `dashboard` y `mantenimiento`.
- Las 6 líneas MAI (Inbox, Lead, Customer, Document, Backoffice, Workflow) **no están representadas como tales** en el catálogo actual. Hay capacidad técnica (n8n, Chatwoot, OpenAI, etc., visibles en el `tech-section` del home) pero no están paquetizadas con pricing, KPI ni SLA.

---

## 3 · Cómo cambia el posicionamiento, oferta, mensaje, pilares y embudo

### 3.1 Posicionamiento — antes vs. después (recomendado)

| Dimensión | V1 / comunicación actual | V2 / propuesta AURA |
|---|---|---|
| Categoría declarada | "Automatización con IA para empresas" (WEAVES.md) / "Automatizamos procesos operativos" (home) | **Managed AI Operations: externaliza procesos, no personas** |
| Rol del cliente | "Empieza a automatizar" (lector pasivo) | "Delega la operación de un proceso crítico y míde lo" (cliente-operador) |
| Qué se vende | 9 servicios modulares | Capacidad operacional paquetizada + SLA + mejora continua |
| Unidad de compra | Servicio / chatbot / plan | Proceso externalizado (Inbox, Lead, Customer, Document, Backoffice, Workflow) |
| Unidad de éxito | Tiempo ahorrado / coste reducido | Coste por operación, tasa de automatización, SLA, escalamiento humano |
| Lo que el cliente promete a su negocio | "Ahorrar tiempo y dejar de contratar" | "Absorber volumen administrativo sin perder control ni calidad" |
| Mensaje competencial implícito | "Somos automatizadores con IA" | "No vendemos bots; operamos procesos. La diferencia es responsabilidad." |

### 3.2 Mensaje principal

**Frase de posicionamiento recomendada (V2):**

> "Externalizamos procesos operativos de tu empresa con agentes de IA, software y supervisión humana. Tú mides el resultado; nosotros nos hacemos responsables de que funcione — con SLA, costes por operación y mejora continua."

**Versión corta para hero:**

> "Externaliza procesos, no personas."

**Versión ultra-corta (subtítulo / open graph):**

> "Operamos los procesos operativos de tu empresa. Con IA, con software y con personas. Por capacidad, no por horas."

**Frases auxiliares (footer, contacto, quiéne­s-somos):**

- *"Medimos por operaciones gestionadas, coste por operación y % automatizado. No por horas técnicas."*
- *"Operamos contigo o por ti: Assessment para empezar, Setup para construir, Monthly para sostener, Expansion para crecer."*

### 3.3 Arquitectura de oferta: 3 pilares

Recomendación: reagrupar el catálogo en torno al ciclo MAI, no por tecnología. Los 9 servicios actuales del sitio se reasignan a tres pilares. Las 6 líneas MAI (Inbox, Lead, Customer, Document, Backoffice, Workflow) se ofrecen como **paquetes** dentro del Pilar 2.

| Pilar | Nombre público | Qué incluye (ahora) | Qué incluye (nuevo) | Frase de venta |
|---|---|---|---|---|
| **Pilar 1** | Diagnosticar y paquetizar | `consultoria` (proceso Assessment + piloto) | **Process Assessment** formal (€750-€2.500) + **Pilot** con datos reales | "Empezamos midiendo. Te decimos si tu proceso es automatizable, cuánto cuesta hoy y cuánto costaría mañana." |
| **Pilar 2** | Operar con IA y humanos | `chatbot`, `procesos`, `integraciones`, `web`, `marketing`, `embudo` (capacidad técnica) + `dashboard` (parte de operación) | **Managed AI Operations** sobre los 6 paquetes MAI (Inbox, Lead, Customer, Document, Backoffice, Workflow) + **Setup** del proceso elegido | "Operamos el proceso por ti. Mensualmente. Con SLA, escalamiento humano y trazabilidad." |
| **Pilar 3** | Escalar y mejorar | `mantenimiento` | **Expansion** a procesos adyacentes + **Managed Operations** mensual (renovación) | "Cuando un proceso funciona, lo extendemos. Mismas métricas, más capacidad." |

> **Por qué 3 pilares y no 6 o 9:**
> - Coincide con el ciclo MAI declarado en el documento (Assessment → Pilot/Production → Managed → Expansion).
> - Permite vender **una conversación** ("¿quieres diagnosticar, operar o escalar?") en lugar de un menú de 9 productos.
> - Resuelve la incoherencia actual: el sitio promete "9 soluciones" y vende planes de chatbot.
> - Una pyme media entiende "Diagnosticar / Operar / Escalar" en 5 segundos.

### 3.4 Cambios en el embudo

| Etapa | Hoy | Recomendado (V2) |
|---|---|---|
| Home | 4 CTAs compitiendo → la mayoría va a `href="#"` | **Un solo CTA primario**: "Empieza por un Assessment gratuito (sin compromiso)". Lleva a `pages/diagnostico-gratuito.html`. |
| Assessment | Modal conversacional (n8n `webhook-test` en `pages/diagnostico-gratuito.html:178`) | Misma página, pero con **doble salida**: (a) Fit → Assessment pago o propuesto en plan, (b) No-fit → email de orientación. |
| Pricing | Página huérfana de tiers de chatbot | Página estructurada por **capacidad**: Assessment / Pilot / Managed / Expansion + tabla de paquetes MAI con unidades de operación (ej.: "hasta 8.000 emails/mes"). |
| Operación | (No existe en el sitio) | Página o sección "Cómo operamos" — explica el ciclo, los KPIs de servicio, el human-in-the-loop, los riesgos. |
| Casos | Caso destacado anónimo + testimonios de servicios puntuales | Sustituir por **1 caso firmado de MAI** antes de cualquier campaña. Si no existe, eliminar el caso destacado. |

---

## 4 · Análisis de competencia

### 4.1 Criterio de selección

La selección sigue tres filtros:

1. **Relevancia funcional** — ¿ofrece servicio gestionado de operaciones digitales con IA para empresas? (servicios gestionados) o ¿compite por el mismo presupuesto / decisión con una alternativa DIY, BPO o consultora?
2. **Acceso al cliente objetivo** — ¿opera en mercados hispanohablantes (España o LatAm) o es accesible desde ellos? ¿Atiende a empresas de 20–200 empleados o superiores?
3. **Verificabilidad** — ¿hay información pública actual (web, precios, casos, cobertura geográfica) suficiente para emitir un juicio trazable?

> **Hecho metodológico:** todas las fichas siguientes están basadas en consulta directa a la URL indicada el 2026-08-22. Donde no se ha podido verificar (por error 503/404 del sitio o por 403), se declara explícitamente como limitación.

### 4.2 Competidores directos — servicios gestionados de IA/operación para empresa

#### 4.2.1 Aunoa (España, IA conversacional)

- **URL:** https://aunoa.ai/
- **Público observado:** banca, fintech, insurtech, telco, e-commerce, servicios, utilities (verificable en su home).
- **Promesa / mensaje:** *"Diseñamos agentes IA de vanguardia que enamoran a tus clientes"*. Combinan IA generativa y compromiso humano para crear soluciones conversacionales a medida.
- **Oferta / modelo:** desarrollo e implementación de agentes IA multicanal (WhatsApp, LiveChat, Redes). Posicionamiento claro como agencia/partner tecnológico. No publica pricing — modelo proyecto.
- **Prueba de confianza:** casos con PcComponentes (CEO Alfonso Tomás), GLS, Asistente AIRE (caso de reciclaje con reconocimiento de imagen y voz). Citas con nombre, cargo y empresa verificables en la home.
- **CTA / embudo:** "Hablemos" / formulario — modelo B2B clásico.
- **Fortalezas:** foco claro en IA conversacional; casos firmados; posicionamiento de partner end-to-end.
- **Debilidades:** mensaje casi exclusivamente centrado en CX/chat; el cliente que busca "operación gestionada de un proceso de backoffice" no encuentra encaje explícito; no publica pricing ni SLAs.
- **Oportunidad para Weaves:** Aunoa cubre conversación; Weaves puede cubrir **operación de procesos no conversacionales** (documentos, inbox, backoffice, leads) con la misma profundidad. También: Aunoa se dirige a enterprise; Weaves puede competir en mid-market / pyme media con precios MAI (Assessment + Setup + Mensualidad) más accesibles.

#### 4.2.2 Chatbot Chocolate (España, agencia de chatbots)

- **URL:** https://chatbotchocolate.com/ (home; URLs internas dan 404 al verificar 2026-08-22; limitación declarada)
- **Público observado:** empresas y administración pública, multinacionales, gran empresa.
- **Promesa / mensaje:** *"Pioneros desde 2017, líderes en chatbots, IA y automatización. Somos la agencia líder y mejor valorada en creación de chatbots con IA para empresas e instituciones públicas."*
- **Oferta / modelo:** agencia. Outsourcing de perfiles IA especializados que se incorporan a equipos del cliente. Certificaciones: ENS (Esquema Nacional de Seguridad) e ISO 42001 (gestión de IA). No publica pricing.
- **Prueba de confianza:** certificaciones ENS e ISO 42001 verificables mediante PDF enlazado en la home. Claims de liderazgo sectorial.
- **CTA / embudo:** modelo agencia clásica (contacto comercial).
- **Fortaleza:** credibilidad institucional (ENS, ISO 42001) y narrativa de pioneros; oferta complementaria de outsourcing de perfiles.
- **Debilidades:** encaje casi exclusivo en chatbots conversacionales; modelo de proyecto, no de operación gestionada mensual.
- **Oportunidad para Weaves:** Chatbot Chocolate refuerza el claim de Weaves de que la categoría "chatbot + IA" está saturada y opera por ticket/proyecto. Weaves puede diferenciarse con **pricing de operación mensual** y **KPI por operación gestionada**.

#### 4.2.3 indigitall (España, plataforma omnicanal con AI)

- **URL:** https://indigitall.com/es/ y https://indigitall.com/es/plataforma/
- **Público observado:** empresas con marketing, soporte y notificación a cliente final; cobertura EMEA y LatAm. Verificable: 76 insignias G2 Summer 2026, "+430 reseñas verificadas", ranking #1 EMEA y #1 LatAm (Mid-Market y regional).
- **Promesa / mensaje:** *"Software Nº 1 de WhatsApp Marketing e IA. Orquesta todos tus canales desde una sola plataforma con IA."* Diferenciador: cliente único, plataforma única, conversación continua.
- **Oferta / modelo:** **plataforma SaaS con capa IA** (OmnIA Agents). Canales: WhatsApp, push web/móvil, Datatalk, Chatbot IA Voz, SMS/RCS, Instagram, Facebook Messenger, email, etc. ISO 27001, GDPR.
- **Prueba de confianza:** insignias G2, ISO 27001, datos de adopción de plataforma.
- **CTA / embudo:** self-serve + demo.
- **Fortalezas:** amplitud de canales, datos de adopción pública (G2), cobertura multi-región EMEA/LatAm.
- **Debilidades:** producto SaaS (no servicio gestionado). El cliente necesita configurar y mantener.
- **Oportunidad para Weaves:** para procesos donde la pyme **no quiere configurar y mantener un SaaS** (backoffice, documentos, flujos complejos), la oferta de Weaves como servicio gestionado llave-en-mano es la alternativa. Posible partnership en lugar de competencia directa.

#### 4.2.4 Inbenta (internacional con HQ España, plataforma + servicios)

- **URL:** https://www.inbenta.com/
- **Público observado:** enterprise global; sectores banca, retail, seguros, telco. Casos verificables: GOL Airlines (10M+ consultas/año, 90% chatbot), entidad bancaria top-15 US ($2M ahorro, 146K horas de soporte), OpPlus bank (84% menos escalamientos).
- **Promesa / mensaje:** *"AI Agents for Customer Experience That Finally Work. Trusted answers, faster speed-to-market, and governance at every step."*
- **Oferta / modelo:** **plataforma AI** (AI Workflows, AI Orchestration, Live Agent Assist). 850+ integraciones declaradas. Modelo-agnóstico (cualquier LLM). Governance "auditable by design".
- **Prueba de confianza:** casos con métricas firmadas, certificaciones enterprise.
- **CTA / embudo:** demo.
- **Fortalezas:** profundidad de plataforma, multi-modelo, governance.
- **Debilidades:** foco enterprise; encaje limitado con pyme media por coste y complejidad.
- **Oportunidad para Weaves:** "Inbenta para la pyme media" — Weaves opera Inbenta/n8n/Make como tecnología subyacente, pero vende el resultado operacional. Es el mismo patrón de "plataforma enterprise entregada como servicio gestionado para mid-market".

#### 4.2.5 TaxDown (España, AI + humano, modelo por capacidad)

- **URL:** https://taxdown.es/ y https://taxdown.es/precios
- **Público observado:** autónomos y pequeños contribuyentes en España. Claim verificable: "+2M contribuyentes confían en TaxDown" y 4,7/5 de valoración pública.
- **Promesa / mensaje:** *"Tu equipo fiscal, todo el año. Un fiscalista colegiado lleva tu caso y Luz, nuestra IA, acelera el proceso."* Patrón de marca **AI + humano por caso** explícito.
- **Oferta / modelo:** planes con precio por situación, no por horas. Plan PRO "desde 35€/año" verificable (aunque para escenarios complejos el precio real es mayor). Luz = asistente IA 24/7; el fiscalista humano valida y firma.
- **Prueba de confianza:** número de usuarios, valoración, fiscalistas colegiados nombrados en la home.
- **CTA / embudo:** cálculo gratis → recomendación de plan.
- **Fortalezas:** branding AI+humano explícito, modelo por capacidad (no por horas), entrada viral (calculadora gratis), precio de entrada muy bajo.
- **Debilidades:** nicho (fiscal/impuestos); no cubre procesos operativos genéricos.
- **Oportunidad para Weaves:** TaxDown es el **modelo de referencia** para vender MAI en mercados de habla hispana: empaquetar AI+humano por capacidad, con entrada gratis o de bajo coste y precio claro por escenario. Es el patrón más cercano al MAI en el mercado español para pyme/autónomo.

### 4.3 Sustitutos — Plataformas DIY

#### 4.3.1 n8n (workflow automation open source + cloud)

- **URL:** https://n8n.io/ y https://n8n.io/pricing/
- **Promesa / mensaje:** *"AI Workflow Automation Platform. Plug AI into your own data & over 500 integrations. Build AI agents you can actually follow."*
- **Oferta / modelo:** self-hosted (gratuito) + planes cloud. Starter, Pro, Business con escalado por ejecuciones concurrentes y AI credits. Verificable el pricing público (rango bajo, no enterprise).
- **Prueba de confianza:** caso de uso extenso en comunidad open source.
- **Fortaleza:** coste bajo, soberanía de datos (on-prem), flexibilidad.
- **Debilidad:** requiere equipo técnico para diseñar, operar y mantener.
- **Implicación para Weaves:** Weaves ya usa n8n como stack (`index.html:230-281`, `pages/diagnostico-gratuito.html:178`). La propuesta de Weaves es **"te entregamos el n8n pero operado"** — es el mismo argumento que las agencias de WordPress: el motor es libre, el servicio es de gestión.

#### 4.3.2 Make (Integromat) (workflow automation SaaS)

- **URL:** https://make.com/ (verificación 2026-08-22 devolvió 403; limitación declarada — la marca, posicionamiento y pricing por escenarios públicos son verificables de forma indirecta)
- **Promesa / mensaje:** conocida plataforma low-code para conectar apps y construir escenarios visuales.
- **Oferta / modelo:** SaaS por escenarios/ejecuciones.
- **Prueba de confianza:** adopción masiva en marketing/ops.
- **Fortaleza:** UX visual, ecosistema de apps.
- **Debilidad:** requiere configuración y mantenimiento del cliente.
- **Implicación para Weaves:** mismo argumento que n8n: Weaves opera, Make ejecuta.

#### 4.3.3 Zapier (workflow automation SaaS)

- **URL:** https://zapier.com/ (consulta 2026-08-22 OK)
- **Promesa / mensaje:** *"Build and govern AI workflows, agents, and apps across 9,000+ apps"*. *"Trusted by 3 million+ businesses."*
- **Oferta / modelo:** SaaS con plan free y tiers pagos; modelo de gobernanza cross-model.
- **Prueba de confianza:** base instalada masiva, partnerships con Anthropic/OpenAI.
- **Fortaleza:** ecosistema, marca, multi-modelo.
- **Debilidad:** orientado a "hazlo tú mismo"; no opera por el cliente.
- **Implicación para Weaves:** refuerza el posicionamiento "AI operado por personas" como alternativa al DIY.

#### 4.3.4 UiPath (RPA enterprise + AI)

- **URL:** https://www.uipath.com/ y https://www.uipath.com/pricing
- **Promesa / mensaje:** *"Agentic Automation for businesses of all sizes. The UiPath Platform for Business Orchestration and Automation."*
- **Oferta / modelo:** planes Basic (desde $25/mes verificable), Standard y Enterprise (precio vía sales). Combina RPA clásico con AI agents.
- **Prueba de confianza:** base enterprise global, clientes publicados (SoftBank, Petrobras, KeyBank, The Washington Post).
- **Fortaleza:** profundidad enterprise, marca, mercado.
- **Debilidad:** coste y complejidad para pyme media.
- **Implicación para Weaves:** el competidor "enterprise RPA + AI"; Weaves cubre el segmento "todo lo que UiPath no llega por coste o complejidad".

#### 4.3.5 Automation Anywhere (Agentic Process Automation)

- **URL:** https://www.automationanywhere.com/
- **Promesa / mensaje:** *"The #1 Provider of Agentic Automation."* Posicionamiento muy fuerte en "agentic".
- **Oferta / modelo:** Agentic Process Automation (APA) — pre-built solutions (Banking, Healthcare, IT Service Desk), Accounts Payable, AI Service Desk.
- **Prueba de confianza:** claim "#1 Provider", casos firmados.
- **Fortaleza:** narrativa "agentic", soluciones pre-built.
- **Debilidad:** target enterprise; pyme media queda fuera del pricing implícito.
- **Implicación para Weaves:** competidor de referencia para hablar de "agentes" sin perder el matiz de "operación gestionada".

#### 4.3.6 Celonis (process mining + AI)

- **URL:** https://www.celonis.com/
- **Promesa / mensaje:** *"Enterprise AI powered by Celonis. Analyze, design, and operate AI-driven processes."* Caso verificable: 1.400+ empresas globales.
- **Oferta / modelo:** plataforma de process intelligence + ejecución. Categoría propia: Process Excellence, Supply Chain, Finance, IT Modernization.
- **Prueba de confianza:** base instalada, integraciones TM Forum.
- **Fortaleza:** process intelligence; combina análisis, diseño y operación.
- **Debilidad:** enterprise; modelo de plataforma, no servicio gestionado para pyme.
- **Implicación para Weaves:** el competidor más conceptual: el Phase 1 (Assessment) de MAI se acerca al "Analyze" de Celonis, pero Weaves lo entrega **como servicio** y no como licencia.

### 4.4 Sustitutos — Consultoras, agencias y BPOs

#### 4.4.1 Algoritmia (España, partner Microsoft Dynamics 365)

- **URL:** https://algoritmia8.com/
- **Público observado:** medianas y grandes empresas; casos verificables Bridgestone EMEA (5.000+ trabajadores de primera línea, con Microsoft y Algoritmia), Nomen Foods (Dynamics 365 for Finance and Supply Chain Management).
- **Promesa / mensaje:** *"Somos tu mejor partner de Microsoft. Consultora tecnológica experta en Dynamics 365, Power Platform, Azure e IA."* Metodología FOCUS declarada (33% menos tiempo de implantación verificable en la home).
- **Oferta / modelo:** consultora + add-ons propios (incluido un asistente IA "Alba" sobre Dynamics 365). Modelo proyecto, no operación mensual.
- **Prueba de confianza:** casos firmados, partnership Microsoft verificable.
- **Fortaleza:** credibilidad enterprise + Microsoft.
- **Debilidad:** modelo proyecto, foco Dynamics, ticket medio alto.
- **Oportunidad para Weaves:** mismo mensaje de MAI "te operamos el proceso", pero sin atar al cliente a un ERP concreto y con pricing mensual accesible.

#### 4.4.2 Intelygenz (VASS, AI enterprise, España + LatAm)

- **URL:** https://intelygenz.com/
- **Público observado:** banca, fintech; caso verificable de "credit growth for a financial provider" con 10.000+ usuarios, 736% ROI en targeting, 98% reducción de costes en un digital bank fee-free.
- **Promesa / mensaje:** *"Your end-to-end AI partner, with over 20 years of experience in deep tech. Full ownership of AI solutions—clients retain all intellectual property."* Promesa Day Zero y ROI en semanas.
- **Oferta / modelo:** consultora/partner de implementación AI; AI solutions para fraude, compliance, intelligent automation, document processing.
- **Prueba de confianza:** 20 años de operación, casos bancarios firmados.
- **Fortaleza:** credibilidad técnica + casos con métricas.
- **Debilidad:** foco enterprise; orientación a proyecto.
- **Oportunidad para Weaves:** ocupa el espacio "AI para banca" que no es target natural de Weaves; deja libre "AI para pyme de servicios".

#### 4.4.3 Cognizant (multinacional, LatAm y España)

- **URL:** https://www.cognizant.com/es/es
- **Promesa / mensaje:** *"Arquitectos de IA cerrando la brecha de la IA al impacto. Somos un creador de IA."* Servicios: Agent Foundry, AI Business Accelerators, Neuro Edge, Responsible AI.
- **Oferta / modelo:** consultora global; Agent Foundry para convertir pilotos en redes de agentes de producción.
- **Fortaleza:** escala global, IP propia.
- **Debilidad:** ticket medio enterprise; latencia alta en mid-market.
- **Oportunidad para Weaves:** "Cognizant para pyme" — el cliente corporativo que no aguanta un contrato enterprise.

#### 4.4.4 Cresta (AI agent platform, contacto enterprise)

- **URL:** https://cresta.com/
- **Promesa / mensaje:** *"AI agents for every customer conversation. One AI platform. Every conversation."*
- **Oferta / modelo:** plataforma AI contact center; automatiza, aumenta y analiza conversaciones.
- **Fortaleza:** foco CX con AI; opera como partner de contact center.
- **Debilidad:** nicho contact center; no cubre procesos de backoffice/inbox/documents.
- **Oportunidad para Weaves:** mismo segmento CX pero con alcance a procesos no conversacionales.

#### 4.4.5 Otras agencias/consultoras menores (verificación limitada)

- **Power Data** (https://www.powerdata.es/): especializada en gestión de datos, gobierno, virtualización. *Limitación:* la verificación 2026-08-22 confirma foco en datos, no en operación de procesos.
- **Bismart** (https://bismart.com/): consultoría de datos y Power BI con casos Banc Sabadell, Sanitas. *Limitación:* verificación confirma foco analítico, no operación gestionada de procesos con IA.
- **Making Science** (https://www.makingscience.com/): "Tech Enabled Global Digital Agency" con división Raising Tech de IA. *Limitación:* verificación confirma agencia, no servicio gestionado.
- **Aitalentum** (https://www.aitalentum.com/): IA generativa, salud, agroalimentación, sostenibilidad. *Limitación:* verificación confirma portfolio de proyectos, no servicio mensual.

> Estas referencias se incluyen para **fijar el límite inferior del espacio competitivo**: a día de hoy, las agencias generalistas en España no comunican Managed AI Operations como producto recurrente con pricing mensual por capacidad.

### 4.5 Mapa comparativo (resumen)

> Las celdas describen el **modelo observable**, no el rendimiento. "MAI" = Managed AI Operations.

| Actor | Categoría | Modelo de pricing | Unidad de venta | Cliente típico | Operación gestionada end-to-end | Multi-sistema | Human-in-the-loop declarado | Cobertura es/ES-LatAm |
|---|---|---|---|---|---|---|---|---|
| **Weaves (recomendado V2)** | Servicio gestionado | Assessment + Setup + Monthly + Volumen | Proceso externalizado (Inbox, Lead, Customer, Document, Backoffice, Workflow) | Pyme media 20-200 emp. | Sí | Sí | Sí | Sí |
| Aunoa | Agencia IA CX | Proyecto | Agente conversacional | Enterprise, banca, telco | Parcial | Sí | Parcial | España |
| Chatbot Chocolate | Agencia chatbots | Proyecto + outsourcing perfiles | Chatbot | Enterprise, AAPP | No | Limitado | No | España |
| indigitall | Plataforma SaaS + IA | Licencia SaaS | Plataforma omnicanal | Mid-market | No (self-serve) | Sí | No | EMEA + LatAm |
| Inbenta | Plataforma enterprise + AI | Licencia enterprise | Plataforma + proyectos | Enterprise global | Parcial | Sí (850+) | Sí | Global (HQ España) |
| TaxDown | Servicio AI + humano (fiscal) | Por plan/caso | Declaración de renta, fiscal | Autónomos, pyme | Sí (en fiscal) | No | Sí | España |
| Algoritmia | Consultora Microsoft | Proyecto | Implantación Dynamics 365 | Enterprise, mid-market | Parcial | Sí (Microsoft) | Limitado | España |
| Intelygenz (VASS) | Consultora AI | Proyecto | Solución AI enterprise | Banca, fintech | Parcial | Sí | Parcial | España + LatAm |
| Cognizant | Consultora global | Proyecto + retainer | Programa AI enterprise | Enterprise global | Sí (retainer) | Sí | Sí | Global (LatAm fuerte) |
| UiPath | Plataforma RPA + AI | Licencia ($25→Enterprise) | Plataforma + agents | Enterprise, mid-market | No (herramienta) | Sí | Sí | Global |
| Automation Anywhere | Plataforma APA | Licencia enterprise | Solución vertical pre-built | Enterprise | Parcial | Sí | Sí | Global |
| Celonis | Plataforma process mining + AI | Licencia enterprise | Process intelligence | Enterprise global | No (herramienta) | Sí | Limitado | Global |
| n8n | Workflow automation | Self-host gratis + cloud | Plataforma low-code | Equipos técnicos | No (herramienta) | 500+ apps | Limitado | Global |
| Make | Workflow automation SaaS | Por escenario | Plataforma low-code | Marketing/ops | No (herramienta) | 1000+ apps | No | Global |
| Zapier | Workflow automation SaaS | Freemium + planes | Plataforma low-code | Empresas, equipos | No (herramienta) | 9.000+ apps | Limitado | Global |
| Cresta | AI contact center platform | Licencia enterprise | Plataforma CX | Enterprise | Parcial | Limitado | Sí | Global |

### 4.6 Espacios de posicionamiento para Weaves (3–5 huecos concretos)

De la matriz anterior y del análisis del documento MAI, se desprenden estos espacios:

1. **"MAI para pyme de servicios en España"** — Aunoa, Chatbot Chocolate e indigitall compiten por el segmento enterprise / CX. Algoritmia e Intelygenz se centran en banca y Dynamics. **No hay un actor claro** que venda Managed AI Operations como servicio mensual para pyme media de servicios con compliance multi-sistema (ERP + CRM + email + WhatsApp + documentos). TaxDown lo hace en fiscal, pero no en operaciones genéricas.

2. **"El equipo AI operativo de tu negocio, sin proyecto"** — frente a consultoras (Algoritmia, Intelygenz, Cognizant) que venden proyectos con entregable, Weaves puede vender **capacidad mensual** con KPI por operación gestionada. Es el patrón TaxDown aplicado a procesos administrativos, comerciales y documentales.

3. **"Plataformas enterprise entregadas como servicio gestionado para mid-market"** — Inbenta, UiPath, Automation Anywhere y Celonis son plataformas enterprise. Weaves las puede **usar como motor** (como ya hace con n8n, Chatwoot, OpenAI) y vender el resultado operacional. Es el patrón "WordPress gestionado" o "AWS operado".

4. **"Operación con human-in-the-loop declarado, no autonomía irresponsable"** — la categoría de "AI agents" está saturada de promesas de autonomía. Weaves puede ocupar explícitamente el espacio **"responsabilidad con escalamiento humano"**, que es la promesa MAI del documento. Esta es una de las tesis más fuertes del documento y debería ser eje de comunicación, no un footnote.

5. **"Compliance y trazabilidad como producto, no como feature"** — Inbenta ya compite aquí en enterprise; TaxDown lo demuestra con fiscalistas colegiados. Weaves puede **certificar la operación** (ISO 27001, ENS, registro de auditoría por operación) como ventaja competitiva verificable para sectores regulados (salud, educación, legal, financiero). No es la promesa más sexy, pero es la más defendible.

---

## 5 · Mensaje, hero, pilares, prueba — propuesta concreta

### 5.1 Diagnóstico de la comunicación actual

| Síntoma (hecho observable) | Diagnóstico (inferencia AURA) |
|---|---|
| Home dice "9 soluciones" y CTA "Ver todas" (index.html:300-310) | El sitio se vende como catálogo. El visitante tiene que elegir entre 9 etiquetas sin saber cuál necesita. |
| Hero promete "Sin contratar. Sin errores. Sin contratar." | Mensaje centrado en **lo que el cliente deja de hacer** (contratar) en lugar de **lo que obtiene** (responsabilidad operacional sobre un proceso). |
| Planes son tiers de chatbot | El pricing contradice la tesis MAI del documento Word. |
| El CTA principal "Agenda tu diagnóstico" apunta a `href="#"` | El embudo está roto en el primer paso. |
| Casos en marquis (Rubik, Empieza de Cero, Ananta, Stellamia, Lunea, Zuzel) son workshops nivel "redes + chatbots puntuales" | Los casos visibles son de servicios de catálogo, no de MAI. **No hay un caso firmado de operación gestionada**. |
| Caso destacado es "Director de Operaciones, Consultora Legal" sin nombre | Erosion a la propia promesa de "transparencia extrema". |
| "Poder de enterprise, coste de PYME" (index.html:227) | Slogan genérico de toda la categoría. |
| Footer: "Sin letra pequeña, sin compromisos ocultos" | Claim incompatible con un modelo MAI que combina componentes variables. O se matiza o se cumple (especificar lo que está dentro y fuera del fee mensual). |
| WhatsApp `wa.me/1234567890` placeholder (pages/contacto.html:78) | Indica que la web no se ha usado en serio. Cualquier visitante profesional lo detecta. |
| n8n `webhook-test` (pages/diagnostico-gratuito.html:178) | El endpoint es efímero; un cliente que vuelve después de un redeploy de n8n ve el flujo roto. |

### 5.2 Mensaje central recomendado

**Frase de posicionamiento:**
> "Externalizamos procesos operativos de tu empresa con IA, software y personas — por capacidad, no por horas."

**Por qué esta y no la actual:**

- **Recoge la tesis literal del documento MAI:** "externaliza procesos, no personas".
- **Invierte la lógica de la home actual:** no es "te ahorro tiempo" (beneficio pasivo), es "te opero un proceso" (compromiso activo).
- **"Por capacidad, no por horas"** resuelve la ambigüedad de "sin letra pequeña": especifica que el SLA se mide por operaciones gestionadas, no por tickets.
- **Diferencia de la categoría "agencia IA":** no vendemos un agente, vendemos la responsabilidad sobre un proceso.

### 5.3 3 pilares / ofertas máximos

| # | Pilar | Lo que agrupa del catálogo actual | Lo que añade (V2) | Mensaje |
|---|---|---|---|---|
| 1 | **Diagnosticar y paquetizar** | `consultoria` | Process Assessment formal (€750–€2.500) + Pilot con datos reales | "Medimos tu proceso, te decimos cuánto cuesta hoy, cuánto costaría con MAI y qué riesgos ves." |
| 2 | **Operar con IA y humanos** | `chatbot`, `procesos`, `integraciones`, `web`, `marketing`, `embudo`, `dashboard` | Managed AI Operations sobre los 6 paquetes MAI (Inbox, Lead, Customer, Document, Backoffice, Workflow) con Setup (€3.000–€15.000+) + Monthly (€1.000–€5.000+/mes) | "Operamos el proceso por ti. Mensualmente. Con SLA, escalamiento humano, costes por operación y mejora continua." |
| 3 | **Escalar y mejorar** | `mantenimiento` | Expansion a procesos adyacentes; ajustes, nuevos canales, reentrenamiento | "Cuando un proceso funciona, lo extendemos a procesos vecinos. Sin empezar de cero." |

> **Nota:** los servicios `chatbot`, `marketing`, `embudo`, `web` pasan a ser **capacidades dentro de Pilar 2**, no productos diferenciados. Esto resuelve el solapamiento Chatbot vs Marketing vs Embudo que la V1 ya detectó.

### 5.4 Hero, subtítulo, CTA y prueba

**Opción recomendada (V2):**

```html
<section class="hero">
  <h1>Externaliza procesos operativos.<br>No personas.</h1>
  <p class="hero-sub">
    Diseñamos, automatizamos y operamos los procesos administrativos,
    comerciales y documentales de tu empresa — con agentes de IA,
    software e intervención humana donde hace falta. Por capacidad,
    con SLA y con coste por operación.
  </p>
  <a href="/diagnostico-gratuito.html" class="btn-hero-primary">
    Empieza con un Assessment gratuito
  </a>
  <a href="#como-operamos" class="btn-hero-secondary">
    Cómo operamos
  </a>
</section>
```

**Prueba (justo debajo del CTA, sin necesidad de scroll largo):**

- Un mini-badge "Operamos con n8n · OpenAI · Chatwoot · Anthropic · Supabase · y stack open source verificable" (los logos ya están en `index.html:230-281`).
- Una línea de **transparencia**: "Te enseñamos el coste por operación y el % automatizado desde el primer mes. Sin demos vacías."

**Por qué este hero y no el actual:**

- Pasa de "Recupera el tiempo" a "Externaliza procesos": cambia la promesa.
- El CTA lleva a la página de diagnóstico, no a `href="#"`.
- La prueba (logos + transparencia) **se firma**, no se promete. Los logos ya existen en la web; el problema de la V1 es que se presentaban sin anclar a un caso real. Aquí se usan como **prueba de capacidad técnica**, no como prueba de resultado.

### 5.5 Qué eliminar, fusionar o relegar

| Acción | Elemento | Justificación |
|---|---|---|
| **Eliminar** | Caso destacado "ROI 7 meses · 20.000€ · 40%" sin atribución (`index.html:288-309`) | Erosiona la promesa de transparencia hasta que exista un caso firmado. |
| **Eliminar** | Cifras hard del hero (400 h/día, 95%, 30-50%, 24/7, +52% ROI, 8.40€ CPA) sin atribución | Si no se firman con un cliente real, se rotulan como "objetivo de diseño" o se quitan. |
| **Eliminar** | Testimonios duplicados para loop si no están firmados | El patrón de loop es legítimo en UI, pero multiplica la huella de afirmaciones sin atribución. |
| **Fusionar** | Servicios `chatbot`, `marketing`, `embudo`, `web`, `procesos`, `integraciones` | Todos pasan a capacidades dentro del **Pilar 2 — Operar**. El catálogo deja de mostrar 9 productos y pasa a mostrar capacidades bajo paquetes MAI. |
| **Fusionar** | Servicios `consultoria` (existente) → **Pilar 1 — Diagnosticar** | El servicio de consultoría se reescribe como Process Assessment formal con entregable (mapa + ROI + riesgos + arquitectura) y precio (€750-€2.500). |
| **Fusionar** | Servicio `mantenimiento` → **Pilar 3 — Escalar y mejorar** | Se reescribe como "Managed Operations" mensual y "Expansion". |
| **Fusionar** | Servicio `dashboard` → parte de **Pilar 2** (observabilidad de la operación) | Deja de ser un producto separado para ser parte del SLA. |
| **Relegar** | "Planes y precios" como página accesible directamente | Sigue existiendo, pero el **CTA principal ya no apunta a ella**, sino al Assessment. |
| **Relegar (no publicar)** | La propuesta borrador de asistente de Instagram para Transi (de la V1) | No es servicio Weaves. No añadir al sitio. |
| **Mover a docs internas** | `WEAVES.md` declarado con catálogo de 9 servicios distintos al sitio | Reconciliar WEAVES.md con el sitio y con el documento MAI antes de cualquier decisión de copy. |

### 5.6 Cómo presentar Managed AI Operations sin prometer autonomía irresponsable

Esta sección es crítica: el documento MAI lo deja meridianamente claro y la categoría "AI agents" está saturada de promesas de autonomía total que se están volviendo en contra de los vendors.

| Principio (texto recomendado para la web) | Por qué importa |
|---|---|
| "La IA absorbe el volumen. Las personas deciden las excepciones." | Replica la fórmula MAI del documento: "externaliza procesos, no personas". |
| "Cada proceso tiene una matriz de acciones: automáticas, validadas o prohibidas para el agente." | La matriz se firma con el Process Owner del cliente y se versiona. Hace tangible el human-in-the-loop. |
| "El SLA se mide por operaciones gestionadas, coste por operación y porcentaje automatizado." | Conversión de "autonomía" en métricas. Lo que no se mide, no se promete. |
| "Cuando un proceso supera el umbral de confianza o aparece una excepción, se escala a una persona. Siempre." | Diferencia Weaves de competidores que prometen "agentes 100% autónomos". |
| "No prometemos autonomía total. Prometemos responsabilidad operacional con SLA." | Esta frase debería estar en la home. |

> **Riesgo de marca:** si Weaves comunica MAI como "AI agent" o "agentes IA" sin estas cláusulas, hereda automáticamente la crisis reputacional de la categoría (promesas de autonomía que no se cumplen, casos de alucinaciones, etc.). El documento MAI ya marca esta distancia; la web debe respetarla.

### 5.7 Implicaciones para la página de planes y precios

La página actual (`pages/planes-precios.html`) **no se puede arreglar con un cambio de importes** — el modelo conceptual es distinto. Recomendación: reescribirla.

**Estructura propuesta:**

1. **Bloque 1 — Cómo cobramos.** Componentes del precio: Assessment + Setup + Monthly + Volumen. Transparente. "Sin letra pequeña" implica que estos cuatro componentes son visibles.
2. **Bloque 2 — Empezar.** Plan **Diagnostic**: Assessment formal (€750–€2.500) + Pilot (a presupuestar según proceso). Salida: mapa de proceso + ROI + riesgos + arquitectura + propuesta de Setup.
3. **Bloque 3 — Operar.** Planes **Run** (€1.000–€5.000+/mes) según paquete MAI elegido (Inbox, Lead, Customer, Document, Backoffice, Workflow). Cada plan declara:
   - Volumen incluido (ej.: "hasta 8.000 emails/mes" o "hasta 1.500 leads/mes").
   - Coste por operación por encima del incluido.
   - SLA de respuesta y resolución.
   - % objetivo de automatización.
   - Tasa objetivo de escalamiento humano.
   - Frecuencia de reporting y reunión de optimización.
4. **Bloque 4 — Escalar.** Plan **Scale**: Managed Operations multi-proceso con Expansion a procesos adyacentes. Precio a medida.
5. **Bloque 5 — Personalizado.** El actual CTA "¿Necesitas algo diferente?" se queda como cierre.

> **Implicación para reporting:** si se publica un plan Run con SLAs, la página debe enlazar a una página/section "Cómo operamos" donde se explique el ciclo, los KPIs, la matriz de autonomía y los riesgos. Sin esa página, los SLAs son promesas huecas.

---

## 6 · Qué cambió respecto a V1

| Dimensión | V1 (aura-comunicacion-estrategia.md) | V2 (este informe) |
|---|---|---|
| Servicio central del informe | Auditoría del sitio sin servicio estrella explícito; Anexo §10 incorpora la propuesta cliente-específica de Instagram para Transi como "posible evolución de la oferta" | **Managed AI Operations (MAI) del documento Word** como servicio central, con la tesis "Externaliza procesos, no personas" |
| Posicionamiento | "Automatización con IA para empresas" + 9 servicios modulares | "Managed AI Operations" — externalizar procesos con IA, software y personas, por capacidad con SLA |
| Mensaje principal recomendado | "Automatizamos los procesos operativos de tu pyme para que tu equipo trabaje en lo que hace crecer el negocio" | "Externalizamos procesos operativos de tu empresa con IA, software y personas — por capacidad, no por horas" |
| Arquitectura de oferta | 3 pilares reagrupando los 9 servicios (recomendación estratégica) | 3 pilares atados al **ciclo MAI real** (Diagnosticar · Operar · Escalar), con los 6 paquetes MAI (Inbox, Lead, Customer, Document, Backoffice, Workflow) como ofertas dentro de Pilar 2 |
| Pricing | Crítica a los planes tiers de chatbot (497/997/1997 €/mes) y quick wins para arreglarlos | Crítica estructural: el modelo actual es incompatible con MAI; propuesta de reescritura completa con Assessment + Setup + Monthly + Volumen |
| Análisis de competencia | **Ausente en V1** (reconocido como limitación al final del informe) | **15 actores** analizados con ficha, URL y verificación: Aunoa, Chatbot Chocolate, indigitall, Inbenta, TaxDown, Algoritmia, Intelygenz, Cognizant, Cresta, Power Data, Bismart, Making Science, Aitalentum, UiPath, Automation Anywhere, Celonis, n8n, Make, Zapier. Mapa comparativo. 5 espacios de posicionamiento. |
| Presentación de MAI | No incorporada | Sección §2 con síntesis del documento Word (definición, categoría, 6 paquetes, ciclo, pricing, KPIs, posición competitiva, relación con catálogo actual) |
| Tratamiento de la propuesta Transi | Anexo §10 — declarada como "posible evolución" y separada del catálogo | **Fuera del alcance V2** por encargo explícito de Héctor; el documento canónico para servicio estratégico es el Word de MAI |
| Riesgo de autonomía | No tratado | Sección §5.6 con principios de comunicación para evitar "autonomía irresponsable" |
| Planes y precios | Quick wins (arreglar importes, no el modelo) | Reescritura estructural con 4 bloques y SLAs por paquete |
| Fuente de verdad | Mezcla de sitio + propuesta Transi anexada | **Documento Word MAI** + sitio + verificación pública de competidores |
| Metodología / limitaciones | Sección §9 con estados de auditoría + anexo §10 | Sección §7 específica con hechos / inferencias / recomendaciones separadas y fuentes declaradas |

### 6.1 Cambios sobre el error de la V1

- La V1 introdujo en §10 una propuesta cliente-específica (`projects/transi/proposals/2026-08-21-asistente-instagram/`) como "posible evolución de la oferta Weaves". Esa propuesta **no es servicio de catálogo**, **no fue parte del encargo original** y se basaba en un borrador no vinculante.
- La V2 **la deja fuera** del informe principal. Se declara aquí, en "Limitaciones y metodología" (§7), la regla general: **las propuestas cliente-específicas en estado de borrador no entran en informes de estrategia de catálogo**, salvo instrucción explícita de considerarlas como input estratégico.
- La V1 detectó que el sitio necesita un servicio estrella y se lo buscó entre los documentos disponibles. La V2 corrige el rumbo: el servicio estrella estaba ya en el documento Word MAI, solo que la V1 lo ignoró al no leerlo como fuente prioritaria.

---

## 7 · Limitaciones y metodología

### 7.1 Tipo de afirmaciones

En este informe se distingue explícitamente entre:

- **Hechos observables:** afirmaciones respaldadas por una ruta del repositorio o por una URL pública consultada el 2026-08-22. Se citan con ruta o URL.
- **Inferencias estratégicas:** conclusiones interpretativas que AURA extrae de los hechos observables. Se marcan como "inferencia AURA" o como recomendación.
- **Recomendaciones:** propuestas de cambio que AURA somete a decisión de Héctor. Se marcan como "recomendado" y pueden no estar implementadas en el sitio.

> Las recomendaciones de §5 son **propuestas**, no instrucciones. No se ha modificado el sitio.

### 7.2 Fuentes consultadas

| Fuente | Tipo | Estado de verificación |
|---|---|---|
| `weaves-premium-web/index.html`, `pages/*.html`, `servicios/`, `sectores/`, `components/`, `data/`, `sitemap.xml`, `README.md` | Repositorio local | Leído completo (2026-08-22) |
| `weaves-premium-web/docs/aura-comunicacion-estrategia.md` (V1) | Informe previo | Leído completo |
| `~/.openclaw/workspace/media/inbound/openclaw-staged-eb83bdcb-.../Weaves_Informe_Managed_AI_Operations_2026---b5940101-...docx` | Documento estratégico Word | Extraído y leído completo (370 párrafos) |
| `WEAVES.md` en `~/.openclaw/workspace` | Curado interno | Mencionado en V1; no se ha re-leído en esta V2 (no aporta cambios respecto a V1) |
| `https://weavewp.com` y sub-URLs | Producción | Verificado en V1 que coincide con repo; no re-verificado en V2 |
| `https://aunoa.ai/` | Web pública competidor | Verificado 2026-08-22, HTTP 200 |
| `https://chatbotchocolate.com/` | Web pública competidor | Home verificada 2026-08-22, HTTP 200; URLs internas devuelven 404 |
| `https://indigitall.com/es/`, `.../es/plataforma/` | Web pública competidor | Verificadas 2026-08-22, HTTP 200 |
| `https://www.inbenta.com/` | Web pública competidor | Verificada 2026-08-22, HTTP 200 |
| `https://taxdown.es/`, `https://taxdown.es/precios` | Web pública competidor | Verificadas 2026-08-22, HTTP 200 |
| `https://algoritmia8.com/` | Web pública competidor | Verificada 2026-08-22, HTTP 200 |
| `https://intelygenz.com/` | Web pública competidor | Verificada 2026-08-22, HTTP 200 |
| `https://www.cognizant.com/es/es` | Web pública competidor | Verificada 2026-08-22, HTTP 200 |
| `https://cresta.com/` | Web pública competidor | Verificada 2026-08-22, HTTP 200 |
| `https://www.automationanywhere.com/` | Web pública competidor | Verificada 2026-08-22, HTTP 200 |
| `https://www.uipath.com/`, `https://www.uipath.com/pricing` | Web pública competidor | Verificadas 2026-08-22, HTTP 200 |
| `https://www.celonis.com/` | Web pública competidor | Verificada 2026-08-22, HTTP 200 |
| `https://n8n.io/`, `https://n8n.io/pricing/` | Web pública competidor | Verificadas 2026-08-22, HTTP 200 |
| `https://zapier.com/` | Web pública competidor | Verificada 2026-08-22, HTTP 200 |
| `https://www.powerdata.es/` | Web pública competidor | Verificada 2026-08-22, HTTP 200 (foco datos, no MAI) |
| `https://bismart.com/` | Web pública competidor | Verificada 2026-08-22, HTTP 200 (foco Power BI, no MAI) |
| `https://www.makingscience.com/` | Web pública competidor | Verificada 2026-08-22, HTTP 200 (agencia, no MAI) |
| `https://www.aitalentum.com/` | Web pública competidor | Verificada 2026-08-22, HTTP 200 (portfolio, no MAI) |
| `https://www.bkops.com/` | Web pública competidor | **NO verificada como competidor** — dominio en venta (HugeDomains). Se excluye del análisis. |
| `https://www.gocontact.com/` | Web pública competidor | **Redirige a Broadvoice** (US contact center). Se menciona como nota informativa pero no como competidor directo para el segmento pyme España. |
| `https://www.inconcertcc.com/es/` | Web pública competidor | **Time-out** en verificación 2026-08-22. Limitación declarada. |
| `https://www.workfusion.com/` | Web pública competidor | Verificada 2026-08-22, HTTP 200 — nicho AML/financial crime compliance. No es target directo de Weaves (fuera del segmento). |
| `https://www.indigitall.com/es/plataforma/` | Web pública competidor | Verificada 2026-08-22, HTTP 200 |
| `https://make.com/` | Web pública competidor | **403 en verificación** 2026-08-22. Limitación declarada. |

### 7.3 Limitaciones declaradas

1. **No se ha hablado con clientes ni con competencia.** El análisis competitivo es de superficie pública, no de venta cruzada ni de mystery shopping.
2. **No se han contrastado precios privados.** Donde se cita un precio (TaxDown, UiPath Basic, n8n), es el declarado por el sitio en la fecha de verificación. Los precios reales pueden diferir por contrato, plan enterprise o geografía.
3. **No se ha medido tráfico, conversión ni SEO técnico.** No es alcance del informe.
4. **No se ha propuesto rediseño visual.** Aunque el hero recomendado es más explícito en su copy, este informe no aborda tipografía, color, layout ni componentes.
5. **El sitio no se ha modificado.** Este es un informe, no una propuesta de pull request.
6. **El documento Word MAI** es la fuente canónica del servicio estratégico. Si en el futuro Héctor edita ese documento o produce una V2, las cifras y los principios de esta V2 deberán re-validarse.
7. **No se ha verificado la producción** (`https://weavewp.com`) tras los cambios de la V1. La V1 ya confirmó drift cero entre repo y producción; se asume la misma situación en V2.
8. **No se ha validado el alcance geográfico.** El sitio dice "pymes en España e Hispanoamérica" (`pages/quienes-somos.html:83`). El documento MAI no entra en geografía. Las recomendaciones asumen un mercado primario en España + LatAm, pero la priorización comercial no es objetivo de este informe.

### 7.4 Reglas metodológicas aplicadas

- **Triangulación:** cada hecho observable importante se contrasta con al menos dos fuentes (repositorio + producción cuando aplica).
- **Etiquetado:** cada sección distingue explícitamente entre hecho observable, inferencia y recomendación.
- **Sin invención:** ningún precio, cliente, métrica o capacidad se ha inventado. Lo no verificable se declara como limitación.
- **Sin compromiso de catálogo:** la propuesta de asistente de Instagram para Transi se mantiene fuera de este informe por encargo. Lo mismo con cualquier propuesta cliente-específica en estado de borrador.
- **Sin prometer autonomía irresponsable:** el lenguaje de la V2 evita "agentes 100% autónomos", "IA que decide" o equivalentes. Refleja el principio MAI del documento.

---

## 8 · Resumen de fuentes y entregables

### 8.1 Archivos creados / actualizados

- `weaves-premium-web/docs/aura-comunicacion-estrategia-v2.md` (este informe).
- `weaves-premium-web/docs/aura-comunicacion-estrategia-v2-RELACION-V1.md` (nota de relación entre V1 y V2).

> Ningún archivo del sitio se ha modificado. No se ha hecho commit ni push.

### 8.2 Resumen de hallazgos en una página

| # | Hallazgo | Evidencia |
|---|---|---|
| 1 | El servicio estrella del documento Word MAI (Managed AI Operations) no aparece en la home ni en los planes | `index.html:1-50`, `pages/planes-precios.html:1-50` vs `Weaves_Informe_Managed_AI_Operations_2026…docx` |
| 2 | El hero dice "Sin contratar. Sin errores." pero no comunica responsabilidad operacional | `index.html:31` |
| 3 | Los planes actuales son tiers de chatbot (Start 497€, Growth 997€, Pro 1997€); incompatibles con el modelo MAI (Assessment + Setup + Monthly + Volumen) | `pages/planes-precios.html:17-110` vs `Weaves_Informe_Managed_AI_Operations_2026…docx` §7 |
| 4 | El CTA principal "Agenda tu diagnóstico" apunta a `href="#"` | `index.html:38` |
| 5 | 4 páginas de sector están duplicadas (mismo `<title>`, mismo h1, mismo lead) | `sectores/salud.html`, `restauracion-turismo.html`, `servicios-profesionales.html`, `startups.html` (238 líneas cada una) |
| 6 | Caso destacado del home sin cliente nombrado ("Director de Operaciones, Consultora Legal") | `index.html:288-309` |
| 7 | WhatsApp placeholder `wa.me/1234567890` | `pages/contacto.html:78` |
| 8 | Webhook `webhook-test` (efímero) en diagnóstico | `pages/diagnostico-gratuito.html:178` |
| 9 | La propuesta de Instagram para Transi **no es** servicio Weaves y se mantiene fuera de esta V2 | Encargo explícito de Héctor; verificación en `projects/transi/proposals/2026-08-21-asistente-instagram/proposal_content.json` ya hecha en V1 |
| 10 | 15 competidores analizados con URL verificable; 5 espacios de posicionamiento identificados | §4.5–4.6 |
| 11 | TaxDown es el modelo de referencia más cercano al MAI en España para pyme/autónomo | https://taxdown.es/ y §4.2.5 |
| 12 | Aunoa, Chatbot Chocolate, Inbenta, indigitall cubren parcialmente el espacio "IA + empresa" en España | §4.2.1–4.2.4 |
| 13 | El documento MAI ya posiciona a Weaves entre BPO, RPA, SaaS de agentes, consultora y equipo interno | `Weaves_Informe_Managed_AI_Operations_2026…docx` §10.1 |
| 14 | Weaves ya usa n8n + Chatwoot + OpenAI + Anthropic como stack visible; MAI es la **oferta** sobre ese stack | `index.html:230-281` + `pages/diagnostico-gratuito.html:178` + doc Word |

---

*Informe elaborado por AURA sobre el repositorio `weaves-premium-web` y el documento estratégico `Weaves_Informe_Managed_AI_Operations_2026…docx` (agosto 2026). Verificación pública de competidores: 2026-08-22.*
