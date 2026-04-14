# AGENTS - Contexto Operativo del Portal Inverlan

Este archivo alinea a cualquier agente IA con las reglas de trabajo del repositorio.
Referencia extendida: `Plantilla Corporativa/AGENTS_CONTEXT.md`.

## 1) Identidad del proyecto

- **Proyecto:** Inverland Portal
- **Dominio:** Plataforma inmobiliaria (propiedades, clientes, agentes, marketing y analítica)
- **Objetivo:** Mantener flujos comerciales estables, seguros y consistentes

## 2) Stack y arquitectura esperada

- Frontend en React + TypeScript + Vite
- Persistencia y auth con Firebase
- Integraciones con Gemini, EmailJS y WhatsApp
- UI consistente basada en componentes reutilizables
- Organización modular por dominio de negocio y contratos claros entre módulos
- Evolución progresiva hacia diseño estilo microservicios (sin acoplamiento fuerte entre dominios)

## 3) Reglas obligatorias

1. No romper contratos de tipos ni modelos de negocio (`types.ts` y servicios).
2. Cambios pequeños, reversibles y con validación mínima.
3. No exponer secretos o credenciales en código, logs o respuestas.
4. Priorizar integridad de datos en CRM y propiedades.
5. Registrar decisiones relevantes en `Plantilla Corporativa/MEMORY.md`.
6. Mantener archivos cortos y enfocados en una responsabilidad (objetivo recomendado: 150-250 líneas).
7. Cumplir SQA + ISO/IEC 27034 con evidencia mínima de validación y sin exposición de secretos.

## 3.1) Política MCP

- MCP (Model Context Protocol) es **OBLIGATORIO (sine qua non)** en esta app para garantizar la interoperabilidad y el intercambio de contexto entre agentes y servicios.
- Todo desarrollo nuevo debe considerar la exposición de contexto a través de MCP para facilitar la colaboración multi-agente.

## 4) Validación mínima por cambio

- Ejecutar `lint`/`typecheck`/smoke test del área impactada.
- Verificar al menos:
  - login/autenticación,
  - listado y detalle de propiedades,
  - CRUD de clientes,
  - lectura/escritura con Firebase.

## 5) Prioridades en caso de conflicto

1. Integridad de datos.
2. Continuidad operativa de flujos comerciales.
3. Seguridad y privacidad.
4. Consistencia de experiencia de usuario.

## 6) Cierre esperado de cada intervención de agente

- Objetivo resuelto.
- Archivos tocados.
- Validación ejecutada.
- Resultado y riesgos pendientes.
