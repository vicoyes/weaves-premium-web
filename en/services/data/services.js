// Weaves — Centralized service data
window.SERVICIOS = {
  consultoria: {
    slug: "consultoria",
    titulo: "Assessment and operational design",
    tagline: "Understand the process before deciding what to build.",
    descripcion: "We map the process, volume, systems, exceptions, and metrics needed to decide whether a Pilot is worthwhile.",
    icono: "target",
    color: "teal",
    caracteristicas: [
      { titulo: "Process analysis", desc: "We identify bottlenecks and repetitive tasks that consume your team’s valuable time.", icono: "search" },
      { titulo: "Operations roadmap", desc: "We deliver a structured plan with priorities, limits, and next steps.", icono: "map" },
      { titulo: "Baseline metrics", desc: "We define what to measure: volume, time, errors, escalations, and cost per operation.", icono: "trending-up" },
      { titulo: "No empty promises", desc: "We offer only automation we can deliver and that makes economic sense.", icono: "shield" }
    ],
    pasos: [
      { num: "01", titulo: "Map the process", desc: "We identify inputs, tasks, systems, people, and exceptions." },
      { num: "02", titulo: "Review the fit", desc: "We prioritize by impact, risk, and technical and economic feasibility." },
      { num: "03", titulo: "Define the next step", desc: "Assessment, Pilot, implementation, or a recommendation not to proceed." }
    ],
    casos: [
      { titulo: "Automated reporting", desc: "Reports generated and sent automatically without anyone opening Excel." },
      { titulo: "Customer service optimization", desc: "We reduce response times and route inquiries automatically by type." },
      { titulo: "Error reduction", desc: "Processes once dependent on manual copying now run without intervention." }
    ],
    cta: "Analyze your process →"
  },
  chatbot: {
    slug: "chatbot",
    titulo: "Managed multichannel customer service",
    tagline: "More capacity to help customers, without losing control.",
    descripcion: "We manage intake, classification, approved responses, follow-up, and human escalation on the channels your customers already use.",
    icono: "message-circle",
    color: "teal",
    caracteristicas: [
      { titulo: "WhatsApp and Chatwoot integration", desc: "Direct connection to the channels your customers already use, without friction or changes to their experience.", icono: "message-circle" },
      { titulo: "Rules and approved knowledge", desc: "The operation responds with information and a tone approved by your company.", icono: "brain" },
      { titulo: "Human escalation", desc: "Exceptions and sensitive decisions reach the right person with context.", icono: "arrow-up-right" },
      { titulo: "Measurable follow-up", desc: "We monitor volume, times, reasons for contact, and incidents to improve.", icono: "activity" }
    ],
    pasos: [
      { num: "01", titulo: "Define the scope", desc: "We agree on channels, request types, and permitted actions." },
      { num: "02", titulo: "Connect the process", desc: "We integrate knowledge, tools, and escalation rules." },
      { num: "03", titulo: "Operate and improve", desc: "We review quality, incidents, and changes within scope." }
    ],
    casos: [
      { titulo: "Frequently asked questions", desc: "Hours, prices, locations, and order status answered instantly without waiting for a person." },
      { titulo: "Routing to human agents", desc: "The bot detects when human intervention is needed and escalates with full context." },
      { titulo: "Automatic ticket creation", desc: "Each complex conversation generates a ticket with all the context for your team." },
      { titulo: "Post-inquiry follow-up", desc: "The bot sends an automatic follow-up after an unresolved inquiry." }
    ],
    cta: "Discuss your customer service →"
  },
  marketing: {
    slug: "marketing",
    titulo: "Content and campaigns",
    tagline: "Keep your brand present with a process your team can supervise.",
    descripcion: "We plan, prepare, and follow up on content and campaigns within a sales operation. Brand guidelines and review points are defined with your team.",
    icono: "megaphone",
    color: "teal",
    caracteristicas: [
      { titulo: "Content generation", desc: "Posts, captions, hashtags, and email copy generated in your brand’s tone.", icono: "pen-tool" },
      { titulo: "Automatic publishing", desc: "We connect your profiles and publish directly without requiring your presence.", icono: "send" },
      { titulo: "Weekly reports", desc: "Every week you receive a performance summary with key metrics and recommendations.", icono: "bar-chart-2" },
      { titulo: "Aligned with your brand", desc: "All content follows the brand guidelines we define together, with agreed review.", icono: "check-circle" }
    ],
    pasos: [
      { num: "01", titulo: "Define the strategy", desc: "Tone, frequency, platforms, and content types." },
      { num: "02", titulo: "AI creates the content", desc: "Posts, captions, hashtags, and email copy." },
      { num: "03", titulo: "Publish and measure", desc: "Automatically, with weekly reports so you can see results." }
    ],
    casos: [
      { titulo: "Instagram posts", desc: "Visual content and captions optimized for your audience." },
      { titulo: "LinkedIn posts", desc: "Professional articles and posts that build credibility." },
      { titulo: "Email marketing", desc: "Automated email sequences for nurturing and conversion." }
    ],
    cta: "See content and campaigns →"
  },
  procesos: {
    slug: "procesos",
    titulo: "Administrative operations",
    tagline: "Ongoing processes that do not get lost.",
    descripcion: "We organize emails, documents, data, and updates between systems to reduce repetitive work while retaining traceability.",
    icono: "settings-2",
    color: "teal",
    caracteristicas: [
      { titulo: "Documents and data", desc: "We receive, classify, extract, and validate information according to agreed rules.", icono: "file-text" },
      { titulo: "Data synchronization", desc: "CRM, ERP, spreadsheets: all connected and updated in real time.", icono: "refresh-cw" },
      { titulo: "Scheduled reports", desc: "Information arrives at the frequency and in the format your operation needs.", icono: "calendar" },
      { titulo: "Visible exceptions", desc: "Controls detect incomplete information or anomalies before they escalate.", icono: "shield-check" }
    ],
    pasos: [
      { num: "01", titulo: "Map the process", desc: "We identify repetitive tasks and quantify the time they take." },
      { num: "02", titulo: "Implement", desc: "We connect tools, rules, permissions, and review points." },
      { num: "03", titulo: "Operate", desc: "We record executions, incidents, and changes to maintain traceability." }
    ],
    casos: [
      { titulo: "Recurring invoicing", desc: "Automatic invoices for clients with recurring contracts." },
      { titulo: "Accounting reports", desc: "Financial reports generated and sent without opening Excel." },
      { titulo: "CRM synchronization", desc: "Data flows between your CRM and other tools without manual copying." }
    ],
    cta: "Analyze your operation →"
  },
  integraciones: {
    slug: "integraciones",
    titulo: "Integrations and data flows",
    tagline: "Information moves between your tools without copying and pasting.",
    descripcion: "We connect the tools you already use, including CRM, email, WhatsApp, and online stores, to reduce duplicates, manual copying, and transfer errors.",
    icono: "git-merge",
    color: "teal",
    caracteristicas: [
      { titulo: "Connected CRM", desc: "Your CRM communicates with WhatsApp, email, and more, bringing information together.", icono: "database" },
      { titulo: "Real-time synchronization", desc: "Data updates instantly between systems, without waiting.", icono: "zap" },
      { titulo: "Duplicates removed", desc: "Smart logic automatically detects and merges duplicate records.", icono: "filter" },
      { titulo: "No manual coding", desc: "Everything runs in the background while you continue using your tools as usual.", icono: "code" }
    ],
    pasos: [
      { num: "01", titulo: "Inventory tools", desc: "We identify what you use today and how the tools connect, if at all." },
      { num: "02", titulo: "Design the flows", desc: "We define how information travels between each system." },
      { num: "03", titulo: "Implement", desc: "The connection is ready, tested, and documented without interrupting your operation." }
    ],
    casos: [
      { titulo: "CRM + WhatsApp", desc: "Every WhatsApp message is automatically recorded in your CRM." },
      { titulo: "Email + ERP", desc: "Orders received by email go directly to your ERP without transcription." },
      { titulo: "Store + notifications", desc: "New orders automatically trigger WhatsApp and email alerts." }
    ],
    cta: "One flow. No manual work →"
  },
  web: {
    slug: "web",
    titulo: "Website as an entry point",
    tagline: "Turn visits into conversations with context.",
    descripcion: "We connect forms, assistants, and CRM to gather context, record opportunities, and trigger the right follow-up from the first contact.",
    icono: "globe",
    color: "teal",
    caracteristicas: [
      { titulo: "Lead capture chatbots", desc: "A chatbot on your website qualifies visitors and schedules calls without work from your team.", icono: "message-circle" },
      { titulo: "Smart forms", desc: "Forms adapt to the user, with real-time validation and automatic follow-up.", icono: "edit-3" },
      { titulo: "Integrated CRM", desc: "Every lead from your website goes directly to your CRM with all captured information.", icono: "database" },
      { titulo: "Automated follow-up", desc: "Email and WhatsApp sequences automatically nurture each lead.", icono: "send" }
    ],
    pasos: [
      { num: "01", titulo: "Audit your website", desc: "Drop-off points, forms without follow-up, and conversion opportunities." },
      { num: "02", titulo: "Add intelligence", desc: "Chatbot, smart forms, and CRM integrations." },
      { num: "03", titulo: "Activate", desc: "We connect lead capture with sales follow-up and retain a record of each contact." }
    ],
    casos: [
      { titulo: "Contact leads", desc: "Visitors who did not know what to write can now book a call or leave their details." },
      { titulo: "Support chatbot", desc: "Your website has someone available to answer questions and route leads." },
      { titulo: "Conditional forms", desc: "Forms change according to the user’s response, reducing abandonment." }
    ],
    cta: "Your website working 24 hours a day →"
  },
  embudo: {
    slug: "embudo",
    titulo: "Sales follow-up",
    tagline: "More follow-up. Fewer missed opportunities.",
    descripcion: "We capture, classify, record, and follow up with leads using priority and escalation rules for your sales team.",
    icono: "filter",
    color: "teal",
    caracteristicas: [
      { titulo: "Email and WhatsApp sequences", desc: "Automated email and WhatsApp nurturing based on lead behavior.", icono: "mail" },
      { titulo: "Lead scoring", desc: "A dynamic score prioritizes the coldest leads and alerts your team when they are ready.", icono: "star" },
      { titulo: "Sales alerts", desc: "When a lead reaches the target score, your salesperson receives an alert with full context.", icono: "bell" },
      { titulo: "Rules-based follow-up", desc: "Each lead has a defined next step until they convert, are ruled out, or need human intervention.", icono: "clock" }
    ],
    pasos: [
      { num: "01", titulo: "Map the funnel", desc: "Stages, decision points, and criteria for lead progression." },
      { num: "02", titulo: "Design sequences", desc: "Automatic nurturing, email timing, and scoring rules." },
      { num: "03", titulo: "Activate scoring", desc: "Real-time alerts when a lead is ready for a closing call." }
    ],
    casos: [
      { titulo: "Lead nurturing", desc: "Leads who download your content receive an email sequence guiding them toward conversion." },
      { titulo: "Post-demo follow-up", desc: "After a demo, the lead receives automatic follow-up with relevant resources." },
      { titulo: "Cold lead reactivation", desc: "Leads who have not interacted in 30 days receive an automatic reactivation campaign." }
    ],
    cta: "Discuss your follow-up →"
  },
  dashboard: {
    slug: "dashboard",
    titulo: "Metrics and observability",
    tagline: "Clear data to understand and improve operations.",
    descripcion: "We bring process metrics together to provide visibility into volume, times, errors, escalations, and trends.",
    icono: "bar-chart-3",
    color: "teal",
    caracteristicas: [
      { titulo: "Automatic reports", desc: "Reports generated and sent automatically, without preparing data or opening Excel.", icono: "file-text" },
      { titulo: "Key metrics", desc: "The metrics that matter to your business, rather than vanity numbers.", icono: "trending-up" },
      { titulo: "Real time", desc: "Data updated instantly from CRM, sales, marketing, and more.", icono: "activity" },
      { titulo: "No manual preparation", desc: "You decide, we build. You receive the reports without preparing them.", icono: "check-circle" }
    ],
    pasos: [
      { num: "01", titulo: "Connect sources", desc: "CRM, sales, marketing: we identify where your data lives." },
      { num: "02", titulo: "Define metrics", desc: "The metrics that matter to your business and goals." },
      { num: "03", titulo: "Automatic reports", desc: "They arrive by email or Slack or are available on your dashboard around the clock." }
    ],
    casos: [
      { titulo: "Weekly sales report", desc: "Every Monday you receive a report on pipeline, conversions, and targets versus actual results." },
      { titulo: "Operations dashboard", desc: "Operational metrics: completed tasks, response times, and productivity." },
      { titulo: "Marketing metrics", desc: "Campaign performance, cost per lead, and channel ROI in one place." }
    ],
    cta: "Metrics without the effort →"
  },
  mantenimiento: {
    slug: "mantenimiento",
    titulo: "Operations and continuous improvement",
    tagline: "The operation is maintained, measured, and improved.",
    descripcion: "We monitor what is in production, resolve incidents, and adjust the process within the contracted scope.",
    icono: "shield-check",
    color: "teal",
    caracteristicas: [
      { titulo: "Active monitoring", desc: "Alerts before failures. If something breaks, we know before you do.", icono: "eye" },
      { titulo: "Updates included", desc: "When an API or tool changes, we update your flows at no additional cost.", icono: "refresh-cw" },
      { titulo: "Direct support", desc: "A direct channel to the team that built your automation, without tickets or waiting.", icono: "headphones" },
      { titulo: "Defined continuity", desc: "We agree on coverage, response times, and what happens when an incident occurs.", icono: "shield" }
    ],
    pasos: [
      { num: "01", titulo: "Monitor", desc: "We review alerts, executions, and incidents within the agreed coverage." },
      { num: "02", titulo: "Maintain", desc: "We update integrations and rules when the process context changes." },
      { num: "03", titulo: "Improve", desc: "We use metrics and escalated cases to prioritize adjustments." }
    ],
    casos: [
      { titulo: "Integration outages", desc: "We detect when an integration goes down and restore it before it affects your operation." },
      { titulo: "API updates", desc: "When WhatsApp or another tool changes its API, we update your flows." },
      { titulo: "Undetected errors", desc: "We proactively detect and correct errors that go unnoticed in complex flows." }
    ],
    cta: "Discuss continuity →"
  }
};
