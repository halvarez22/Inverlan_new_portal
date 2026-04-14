# INSTRUCTIONS - Reglas Operativas de Ingeniería

## Objetivo
Mantener la app inmobiliaria de Inverlan estable, segura y fácil de evolucionar sin romper flujos de negocio (propiedades, clientes, agentes, marketing y analítica).

## Reglas duras
1. No merge a `main` sin pasar CI y validaciones mínimas.
2. Mantener contratos explícitos en tipos y datos (modelos de propiedades, clientes, campañas y usuarios).
3. Hacer cambios pequeños, reversibles y con evidencia de prueba.
4. No exponer secretos ni datos sensibles en frontend, logs o respuestas.

## Diseño y mantenimiento
- Separar claramente UI, estado y servicios de acceso a datos.
- Organizar el código por dominios de negocio (`auth`, `users`, `properties`, `clients`, `marketing`, `analytics`).
- Diseñar cada dominio como módulo independiente con contratos claros para facilitar una evolución progresiva hacia arquitectura de microservicios.
- Evitar refactors amplios en ventanas de release comercial.
- Priorizar compatibilidad hacia atrás cuando haya datos persistidos en Firestore.
- Mantener consistencia visual y de navegación entre portal de usuario, portal de agente y vistas administrativas.
- Evitar archivos excesivamente largos; objetivo recomendado: 150-250 líneas por archivo (salvo excepciones justificadas).

## Verificación obligatoria
- Ejecutar pruebas focalizadas del área tocada (o smoke test funcional si no hay suite).
- Validar rutas críticas: login, listado de propiedades, CRM y guardado de datos.
- Revisar errores de lint/typecheck antes de cerrar la tarea.
- Registrar decisiones relevantes en `MEMORY.md`.

## Cumplimiento SQA e ISO/IEC 27034 (sine qua non)

- Todo cambio debe tener evidencia verificable (typecheck, lint, build y/o prueba funcional).
- No se permiten secretos hardcodeados ni exposición de datos sensibles en logs o UI.
- Debe existir trazabilidad mínima del cambio (archivo tocado, validación aplicada, resultado).
- Cualquier excepción técnica debe documentarse en `MEMORY.md` con riesgo y mitigación.

## Sobre MCP (Model Context Protocol) (sine qua non)

- MCP (Model Context Protocol) es **OBLIGATORIO** para este portal inmobiliario.
- Se implementará para garantizar el intercambio de estado/contexto entre agentes y servicios, permitiendo una orquestación eficiente y coherente del sistema.
- El estándar exigido es modularidad por dominios + contratos de tipos + servicios desacoplados + exposición de contexto vía MCP.
