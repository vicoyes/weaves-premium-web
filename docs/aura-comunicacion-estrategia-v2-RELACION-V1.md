# Nota de relación: AURA · Estrategia V1 ↔ V2

**Fecha:** 2026-08-22 (GMT-5)
**Estado:** aclaración sobre los dos archivos `aura-comunicacion-estrategia*.md` del directorio `docs/`.

## Qué hay en el directorio `docs/`

| Archivo | Estado | Función |
|---|---|---|
| `aura-comunicacion-estrategia.md` | **Histórico (V1)** — conservar | Auditoría detallada del sitio, página a página. Identificó contradicciones, duplicaciones y quick wins. Anexo §10 incorpora — por error — una propuesta cliente-específica (asistente de Instagram para Transi) que NO era servicio de catálogo. |
| `aura-comunicacion-estrategia-v2.md` | **Vigente (V2)** — referencia | Informe corregido y ampliado. Toma como servicio central **Managed AI Operations** del documento Word `Weaves_Informe_Managed_AI_Operations_2026…docx` (agosto 2026). Incorpora análisis de competencia con 15 actores verificados. |

## Por qué V2 es un archivo nuevo y no una edición de V1

- El cambio de servicio central (de "9 servicios modulares" a Managed AI Operations) **reescribe la columna vertebral** del informe. Editar V1 habría requerido reescribir §1, §2, §3, §4, §5, §6, §7 casi por completo.
- Mantener V1 intacta preserva el histórico de auditoría y permite a Héctor revisar el delta entre ambos informes sin reconstruir el pasado.
- Esta nota (`aura-comunicacion-estrategia-v2-RELACION-V1.md`) es el puente explícito entre ambos archivos. Si en el futuro se hace una V3, debe añadirse una nota de relación equivalente.

## Diferencia principal entre V1 y V2

| Dimensión | V1 | V2 |
|---|---|---|
| Servicio estratégico central | No incorporado como servicio estrella; Anexo §10 incorpora propuesta cliente-específica (Transi Instagram) por error | **Managed AI Operations (MAI)** del documento Word, como servicio estrella |
| Análisis de competencia | Ausente (declarado como limitación) | 15 actores con ficha, URL y verificación; mapa comparativo; 5 espacios de posicionamiento |
| Mensaje principal recomendado | "Automatizamos los procesos operativos de tu pyme…" | "Externalizamos procesos operativos de tu empresa con IA, software y personas — por capacidad, no por horas" |
| Pricing | Crítica a tiers de chatbot; quick wins de importes | Crítica estructural: modelo incompatible con MAI; propuesta de reescritura completa |
| Riesgo de autonomía | No tratado | Sección específica con principios para evitar "autonomía irresponsable" |

## Tratamiento de la propuesta Transi (Instagram)

La V1 incluyó en §10 un anexo sobre la propuesta `projects/transi/proposals/2026-08-21-asistente-instagram/proposal_content.json`. El propio anexo advertía que el documento era "borrador no vinculante" y "cliente-confidencial".

En V2 se mantiene la siguiente regla:

> Las propuestas cliente-específicas en estado de borrador no entran en informes de estrategia de catálogo de Weaves. La fuente correcta del servicio estratégico de Weaves es el documento Word **Managed AI Operations** (`Weaves_Informe_Managed_AI_Operations_2026…docx`), no propuestas puntuales.

Si en el futuro Héctor decide promover esa propuesta cliente-específica a servicio de catálogo, debe hacerlo de forma explícita y producir un documento estratégico equivalente al Word MAI. Mientras tanto, el anexo §10 de la V1 queda como histórico y NO debe usarse como base de decisiones de copy, pricing o comunicación pública.

## Relación con `WEAVES.md`

`WEAVES.md` (en `~/.openclaw/workspace`, última actualización 2026-04-21 según V1) declara un catálogo de 9 servicios distinto del sitio web y distinto del documento MAI. La V1 ya detectó esta divergencia. La V2 no la cierra (no es alcance de este informe) pero confirma que:

- El documento **Managed AI Operations** debe ser el documento canónico para la capa de servicio gestionado.
- El sitio debe alinearse con MAI (Pilares 1–2–3 de la V2).
- `WEAVES.md` debe reconciliarse con el sitio y con MAI antes de cualquier decisión de comunicación pública.

## Qué hacer con la V1

- **No borrar.** Es el histórico del primer pase.
- **No editar a posteriori** sin marcar claramente que es una corrección retroactiva.
- Si se quiere desambiguar el anexo §10 (que es la parte errónea de V1), se puede añadir un preámbulo corto al inicio de V1 que diga: *"Anexo §10 contiene una propuesta cliente-específica (Transi Instagram) que el encargo explícito de 2026-08-22 descartó como input estratégico. Véase `aura-comunicacion-estrategia-v2.md` §6.1 para el tratamiento del error."*

## Qué hacer con la V2

- **Es la referencia vigente** hasta que se produzca una V3.
- Cualquier decisión de comunicación, copy, planes o pricing debería referenciarla.
- Si el documento Word MAI se actualiza o se sustituye, esta V2 debe re-validarse.

---

*Nota elaborada por AURA sobre el repositorio `weaves-premium-web`. 2026-08-22.*
