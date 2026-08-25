// Weaves — Datos centralizados de servicios
window.SERVICIOS = {
  consultoria: {
    slug: "consultoria",
    titulo: "Assessment y diseño operativo",
    tagline: "Entiende el proceso antes de decidir qué construir.",
    descripcion: "Mapeamos el proceso, el volumen, los sistemas, las excepciones y las métricas necesarias para decidir si merece un Pilot.",
    icono: "target",
    color: "teal",
    caracteristicas: [
      { titulo: "Análisis de procesos", desc: "Identificamos cuellos de botella y tareas repetitivas que consumen tiempo valioso de tu equipo.", icono: "search" },
      { titulo: "Roadmap de operación", desc: "Te entregamos un plan estructurado con prioridades, límites y siguientes pasos.", icono: "map" },
      { titulo: "Métricas base", desc: "Definimos qué medir: volumen, tiempos, errores, escalamientos y coste por operación.", icono: "trending-up" },
      { titulo: "Sin promesas vacías", desc: "No te vendemos humo. Solo automatizaciones que podemos ejecutar y que tienen sentido económico.", icono: "shield" }
    ],
    pasos: [
      { num: "01", titulo: "Mapeamos el proceso", desc: "Identificamos entradas, tareas, sistemas, personas y excepciones." },
      { num: "02", titulo: "Revisamos el encaje", desc: "Priorizamos por impacto, riesgo y viabilidad técnica y económica." },
      { num: "03", titulo: "Definimos el siguiente paso", desc: "Assessment, Pilot, implementación o una recomendación de no avanzar." }
    ],
    casos: [
      { titulo: "Automatización de reportes", desc: "Reportes que se generan y envían solos, sin que nadie abra Excel." },
      { titulo: "Optimización de atención", desc: "Reducimos tiempos de respuesta y derivación automática por tipo de consulta." },
      { titulo: "Reducción de errores", desc: "Procesos que antes dependían de copia manual ahora se ejecutan sin intervención." }
    ],
    cta: "Analiza tu proceso →"
  },
  chatbot: {
    slug: "chatbot",
    titulo: "Atención multicanal gestionada",
    tagline: "Más capacidad para atender, sin perder el control.",
    descripcion: "Gestionamos recepción, clasificación, respuestas autorizadas, seguimiento y escalamiento humano en los canales donde ya están tus clientes.",
    icono: "message-circle",
    color: "teal",
    caracteristicas: [
      { titulo: "Integración con WhatsApp y Chatwoot", desc: "Conexión directa con los canales donde ya están tus clientes. Sin fricción, sin cambios en su experiencia.", icono: "message-circle" },
      { titulo: "Reglas y conocimiento autorizado", desc: "La operación responde con la información y el tono que tu empresa aprueba.", icono: "brain" },
      { titulo: "Escalamiento humano", desc: "Las excepciones y decisiones sensibles llegan a la persona adecuada con contexto.", icono: "arrow-up-right" },
      { titulo: "Seguimiento medible", desc: "Observamos volumen, tiempos, motivos de contacto e incidencias para mejorar.", icono: "activity" }
    ],
    pasos: [
      { num: "01", titulo: "Definimos el alcance", desc: "Acordamos canales, tipos de solicitud y acciones permitidas." },
      { num: "02", titulo: "Conectamos el proceso", desc: "Integramos conocimiento, herramientas y reglas de escalamiento." },
      { num: "03", titulo: "Operamos y mejoramos", desc: "Revisamos calidad, incidencias y cambios dentro del alcance." }
    ],
    casos: [
      { titulo: "Respuesta a preguntas frecuentes", desc: "Horarios, precios, ubicaciones, estados de pedido. Respondidos al instante, sin esperar a un humano." },
      { titulo: "Derivación a agentes humanos", desc: "El bot detecta cuándo necesita intervención humana y escala con contexto completo." },
      { titulo: "Generación de tickets automático", desc: "Cada conversación compleja genera un ticket con todo el contexto para tu equipo." },
      { titulo: "Seguimiento post-consulta", desc: "El bot envía seguimiento automático después de una consulta sin resolver." }
    ],
    cta: "Habla de tu atención →"
  },
  marketing: {
    slug: "marketing",
    titulo: "Contenido y campañas",
    tagline: "Tu marca presente con un proceso que el equipo puede supervisar.",
    descripcion: "Planificamos, preparamos y damos seguimiento a contenido y campañas dentro de una operación comercial. Las directrices de marca y los puntos de revisión quedan definidos con tu equipo.",
    icono: "megaphone",
    color: "teal",
    caracteristicas: [
      { titulo: "Generación de contenido", desc: "Posts, captions, hashtags y textos para email. Todo generado con el tono de tu marca.", icono: "pen-tool" },
      { titulo: "Publicación automática", desc: "Conectamos tus perfiles y publicamos directamente. Sin estar presente.", icono: "send" },
      { titulo: "Reportes semanales", desc: "Cada semana recibes un resumen de rendimiento con métricas clave y recomendaciones.", icono: "bar-chart-2" },
      { titulo: "Alineado con tu marca", desc: "Todo el contenido pasa por las directrices de marca que definimos juntos. Consistencia basada en directrices de marca y revisión acordada.", icono: "check-circle" }
    ],
    pasos: [
      { num: "01", titulo: "Definimos la estrategia", desc: "Tono, frecuencia, plataformas y tipos de contenido." },
      { num: "02", titulo: "La IA crea el contenido", desc: "Posts, captions, hashtags y textos para email." },
      { num: "03", titulo: "Publicamos y medimos", desc: "Automáticamente. Reports semanales para que veas resultados." }
    ],
    casos: [
      { titulo: "Posts para Instagram", desc: "Contenido visual y captions optimizados para tu audiencia." },
      { titulo: "LinkedIn posts", desc: "Artículos y publicaciones profesionales que generan credibilidad." },
      { titulo: "Email marketing", desc: "Secuencias de emails automatizados para nurturing y conversión." }
    ],
    cta: "Ver contenido y campañas →"
  },
  procesos: {
    slug: "procesos",
    titulo: "Operaciones administrativas",
    tagline: "Procesos continuos que no se pierden.",
    descripcion: "Organizamos correos, documentos, datos y actualizaciones entre sistemas para reducir trabajo repetitivo sin perder trazabilidad.",
    icono: "settings-2",
    color: "teal",
    caracteristicas: [
      { titulo: "Documentos y datos", desc: "Recibimos, clasificamos, extraemos y validamos información según reglas acordadas.", icono: "file-text" },
      { titulo: "Sincronización de datos", desc: "CRM, ERP, hoja de cálculo. Todo conectado y actualizado en tiempo real.", icono: "refresh-cw" },
      { titulo: "Reportes programados", desc: "La información llega con la frecuencia y el formato que necesita tu operación.", icono: "calendar" },
      { titulo: "Excepciones visibles", desc: "Los controles detectan información incompleta o anomalías antes de que escalen.", icono: "shield-check" }
    ],
    pasos: [
      { num: "01", titulo: "Mapeamos el proceso", desc: "Identificamos tareas repetitivas y cuantificamos el tiempo que consumen." },
      { num: "02", titulo: "Implementamos", desc: "Conectamos herramientas, reglas, permisos y puntos de revisión." },
      { num: "03", titulo: "Operamos", desc: "Registramos ejecuciones, incidencias y cambios para mantener trazabilidad." }
    ],
    casos: [
      { titulo: "Facturación recurrente", desc: "Facturas automáticas para clientes con contratos periódicos." },
      { titulo: "Reportes contables", desc: "Reportes financieros que se generan y envían sin abrir Excel." },
      { titulo: "Sincronización CRM", desc: "Datos que fluyen entre tu CRM y otras herramientas sin copia manual." }
    ],
    cta: "Analiza tu operación →"
  },
  integraciones: {
    slug: "integraciones",
    titulo: "Integraciones y flujos de datos",
    tagline: "La información avanza entre tus herramientas sin copiar y pegar.",
    descripcion: "Conectamos las herramientas que ya usas — CRM, email, WhatsApp o tienda online — para reducir duplicados, copias manuales y errores de traspaso.",
    icono: "git-merge",
    color: "teal",
    caracteristicas: [
      { titulo: "CRM conectado", desc: "Tu CRM hablando con WhatsApp, email y más. Información unificada.", icono: "database" },
      { titulo: "Sincronización en tiempo real", desc: "Datos que se actualizan al instante entre sistemas. Sin esperas.", icono: "zap" },
      { titulo: "Duplicados eliminados", desc: "Lógica inteligente que detecta y fusiona registros duplicados automáticamente.", icono: "filter" },
      { titulo: "Sin código manual", desc: "Todo funciona en segundo plano. Tú sigues usando tus herramientas como siempre.", icono: "code" }
    ],
    pasos: [
      { num: "01", titulo: "Inventario de herramientas", desc: "Identificamos qué usas hoy y cómo se conectan (o no)." },
      { num: "02", titulo: "Diseñamos los flujos", desc: "Definimos cómo viaja la información entre cada sistema." },
      { num: "03", titulo: "Implementamos", desc: "Conexión lista, probada y documentada. Sin interrumpir tu operación." }
    ],
    casos: [
      { titulo: "CRM + WhatsApp", desc: "Cada mensaje de WhatsApp se registra automáticamente en tu CRM." },
      { titulo: "Email + ERP", desc: "Pedidos recibidos por email que pasan directo a tu ERP sin transcripción." },
      { titulo: "Tienda + Notificaciones", desc: "Nuevos pedidos que disparan alertas a WhatsApp y emails automáticamente." }
    ],
    cta: "Un solo flujo. Sin manual →"
  },
  web: {
    slug: "web",
    titulo: "Web como punto de entrada",
    tagline: "Convierte visitas en conversaciones con contexto.",
    descripcion: "Conectamos formularios, asistentes y CRM para recoger contexto, registrar oportunidades y activar el seguimiento adecuado desde el primer contacto.",
    icono: "globe",
    color: "teal",
    caracteristicas: [
      { titulo: "Chatbots de captación", desc: "Un chatbot en tu web que cualifica visitors y agenda llamada sin que tu equipo haga nada.", icono: "message-circle" },
      { titulo: "Formularios inteligentes", desc: "Formularios que se adaptan al usuario, con validación en tiempo real y follow-up automático.", icono: "edit-3" },
      { titulo: "CRM integrado", desc: "Cada lead que entra en tu web va directo a tu CRM con toda la información capturada.", icono: "database" },
      { titulo: "Seguimiento automatizado", desc: "Secuencias de email y WhatsApp que nurturing a cada lead automáticamente.", icono: "send" }
    ],
    pasos: [
      { num: "01", titulo: "Auditamos tu web", desc: "Puntos de fuga, formularios sin seguimiento, oportunidades de conversión." },
      { num: "02", titulo: "Añadimos inteligencia", desc: "Chatbot, forms inteligentes, integraciones con tu CRM." },
      { num: "03", titulo: "Activamos", desc: "Conectamos la captación con el seguimiento comercial y dejamos trazabilidad de cada contacto." }
    ],
    casos: [
      { titulo: "Leads de contacto", desc: "Visitantes que no sabían qué escribirte ahora reservan llamada o dejan sus datos." },
      { titulo: "Chatbot de soporte", desc: "Tu web tiene alguien atendiendo siempre que responde preguntas y deriva leads." },
      { titulo: "Formularios condicionales", desc: "Forms que cambian según la respuesta del usuario, reduciendo abandono." }
    ],
    cta: "Tu web trabajando 24h →"
  },
  embudo: {
    slug: "embudo",
    titulo: "Seguimiento comercial",
    tagline: "Más seguimiento. Menos oportunidades perdidas.",
    descripcion: "Capturamos, clasificamos, registramos y seguimos leads con reglas de prioridad y escalamiento para tu equipo comercial.",
    icono: "filter",
    color: "teal",
    caracteristicas: [
      { titulo: "Secuencias email/WhatsApp", desc: "Nurturing automatizado por email y WhatsApp según el comportamiento del lead.", icono: "mail" },
      { titulo: "Puntuación de leads", desc: "Score dinámico que prioriza los leads más fríos y alerta a tu equipo cuando están listos.", icono: "star" },
      { titulo: "Alertas a ventas", desc: "Cuando un lead alcanza el score objetivo, tu vendedor recibe la alerta con todo el contexto.", icono: "bell" },
      { titulo: "Seguimiento con reglas", desc: "Cada lead tiene un siguiente paso definido hasta que convierte, se descarta o necesita intervención humana.", icono: "clock" }
    ],
    pasos: [
      { num: "01", titulo: "Mapeamos el embudo", desc: "Etapas, puntos de decisión y criterios de avance del lead." },
      { num: "02", titulo: "Diseñamos las secuencias", desc: "Nurture automático, timing de emails y reglas de scoring." },
      { num: "03", titulo: "Activamos scoring", desc: "Alertas en tiempo real cuando un lead está listo para la llamada de cierre." }
    ],
    casos: [
      { titulo: "Nurture de leads", desc: "Leads que descargan tu contenido reciben una secuencia de emails que los guían hacia la conversión." },
      { titulo: "Seguimiento post-demo", desc: "Después de una demo, el lead recibe un seguimiento automático con recursos relevantes." },
      { titulo: "Reactivación de leads fríos", desc: "Leads que no han interactuado en 30 días reciben una campaña de reactivación automática." }
    ],
    cta: "Habla de tu seguimiento →"
  },
  dashboard: {
    slug: "dashboard",
    titulo: "Métricas y observabilidad",
    tagline: "Datos claros para entender y mejorar la operación.",
    descripcion: "Reunimos las métricas del proceso para dar visibilidad sobre volumen, tiempos, errores, escalamientos y evolución.",
    icono: "bar-chart-3",
    color: "teal",
    caracteristicas: [
      { titulo: "Reportes automáticos", desc: "Reportes que se generan y envían solos. Sin preparar datos, sin Excel.", icono: "file-text" },
      { titulo: "Métricas clave", desc: "Las métricas que realmente importan a tu negocio, no vanity numbers.", icono: "trending-up" },
      { titulo: "En tiempo real", desc: "Datos actualizados al instante desde CRM, ventas, marketing y más.", icono: "activity" },
      { titulo: "Sin preparación manual", desc: "Tú decides, nosotros construimos. Tú recibes, no preparas.", icono: "check-circle" }
    ],
    pasos: [
      { num: "01", titulo: "Conectamos fuentes", desc: "CRM, ventas, marketing. Identificamos dónde están tus datos." },
      { num: "02", titulo: "Definimos métricas", desc: "Las que importan a tu negocio y a tus objetivos." },
      { num: "03", titulo: "Reportes automáticos", desc: "Llegan a tu email, a tu Slack o están disponibles en tu dashboard 24/7." }
    ],
    casos: [
      { titulo: "Reporte semanal comercial", desc: "Cada lunes recibes un reporte con pipeline, conversiones y objetivos vs. real." },
      { titulo: "Dashboard de operaciones", desc: "Métricas de operaciones: tareas completadas, tiempos de respuesta, productividad." },
      { titulo: "Métricas de marketing", desc: "Rendimiento de campañas, coste por lead, ROI de canales. Todo en un solo lugar." }
    ],
    cta: "Métricas sin esfuerzo →"
  },
  mantenimiento: {
    slug: "mantenimiento",
    titulo: "Operación y mejora continua",
    tagline: "La operación se mantiene, se mide y mejora.",
    descripcion: "Monitoreamos lo que está en producción, resolvemos incidencias y ajustamos el proceso dentro del alcance contratado.",
    icono: "shield-check",
    color: "teal",
    caracteristicas: [
      { titulo: "Monitoreo activo", desc: "Alertas antes de que fallen. Si algo se rompe, lo sabemos antes que tú.", icono: "eye" },
      { titulo: "Actualizaciones incluidas", desc: "Cuando cambia una API o una herramienta, actualizamos tus flujos sin costo adicional.", icono: "refresh-cw" },
      { titulo: "Soporte directo", desc: "Un canal directo con el equipo que construyó tu automatización. Sin tickets ni esperas.", icono: "headphones" },
      { titulo: "Continuidad definida", desc: "Acordamos cobertura, tiempos de respuesta y qué ocurre cuando aparece una incidencia.", icono: "shield" }
    ],
    pasos: [
      { num: "01", titulo: "Monitoreamos", desc: "Revisamos alertas, ejecuciones e incidencias dentro de la cobertura acordada." },
      { num: "02", titulo: "Mantenemos", desc: "Actualizamos integraciones y reglas cuando cambia el contexto del proceso." },
      { num: "03", titulo: "Mejoramos", desc: "Usamos las métricas y los casos escalados para priorizar ajustes." }
    ],
    casos: [
      { titulo: "Caídas de integraciones", desc: "Detectamos cuando una integración se cae y la restauramos antes de que Impacte tu operación." },
      { titulo: "Actualizaciones de APIs", desc: "Cuando WhatsApp o alguna herramienta cambia su API, actualizamos tus flujos." },
      { titulo: "Errores no detectados", desc: "Errores que pasan inadvertidos en flujos complejos los detectamos y corregimos proactivamente." }
    ],
    cta: "Habla de continuidad →"
  }
};
