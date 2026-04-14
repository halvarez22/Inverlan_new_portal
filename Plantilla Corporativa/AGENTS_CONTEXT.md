# AGENTS_CONTEXT — Contexto Operativo Compartido de Inverlan

> Documento maestro para agentes de IA que colaboran en esta app.
> Define dominio de negocio, stack, reglas de calidad y flujo de trabajo.
> Última actualización: 2026-04-13.

---

## 1. Identidad y objetivo del proyecto

**Nombre:** Inverland Portal  
**Propósito:** Plataforma inmobiliaria para gestionar propiedades, clientes, agentes, campañas y analítica comercial en un solo portal.  
**Dominio:** Real estate / comercialización inmobiliaria.

---

## 2. Módulos funcionales principales

- **Catálogo de propiedades:** búsqueda, filtros y detalle de inmueble.
- **CRM de clientes:** altas, seguimiento de estatus, asignación y actividad comercial.
- **Portal de agente:** pipeline de ventas, propiedades asignadas y métricas.
- **Marketing:** campañas segmentadas y trazabilidad básica.
- **Analítica:** KPIs de leads, ventas e ingresos.
- **Asistente IA:** chatbot y apoyo de contenido para operaciones comerciales.

---

## 3. Stack técnico base

- **Frontend:** React + TypeScript + Vite.
- **Estilos/UI:** Tailwind CSS.
- **Datos y auth:** Firebase (Firestore/Auth).
- **IA:** Google Gemini (`@google/genai`).
- **Integraciones:** EmailJS, WhatsApp (enlaces/acciones), Leaflet, Chart.js.
- **Deploy:** Vercel (SPA).

---

## 4. Estructura de referencia

```txt
/
├── App.tsx
├── components/
├── services/
├── modules/
├── types.ts
├── constants.ts
├── firebase.ts
└── vercel.json
```

---

## 5. Reglas de trabajo para agentes

1. Leer este archivo al iniciar sesión.
2. Definir alcance antes de editar (qué sí y qué no).
3. Mantener cambios pequeños y reversibles.
4. No romper contratos de tipos ni flujos críticos de negocio.
5. Evitar exponer secretos o credenciales en código/respuestas.
6. Registrar decisiones importantes en `MEMORY.md`.
7. Favorecer módulos independientes por dominio para facilitar mantenibilidad y una eventual transición a microservicios.
8. Evitar archivos largos y concentrar una sola responsabilidad por archivo siempre que sea posible.

---

## 6. Calidad mínima obligatoria

- Ejecutar validación del área afectada (`lint`, `typecheck` o smoke test).
- Verificar al menos flujos críticos:
  - autenticación,
  - listado/detalle de propiedades,
  - gestión de clientes,
  - lectura/escritura en Firestore.
- Documentar riesgos si una validación no pudo correrse.

### Criterio SQA + ISO/IEC 27034
- Todo cambio debe cumplir calidad verificable y controles básicos de seguridad de aplicación.
- Prohibido exponer credenciales o datos sensibles.
- Mantener evidencia de validación y trazabilidad por tarea.

---

## 7. Prioridades funcionales

En caso de conflicto, priorizar:
1. Integridad de datos en CRM y propiedades.
2. Disponibilidad de flujos comerciales (agentes/admin).
3. Seguridad básica y no exposición de información sensible.
4. Consistencia visual y experiencia del usuario.

## 8. Política sobre MCP

- MCP (Model Context Protocol) es **OBLIGATORIO (sine qua non)** en este proyecto para garantizar la interoperabilidad, el intercambio de contexto entre agentes y servicios, y la coherencia del estado compartido.
- Todo desarrollo nuevo debe considerar la exposición de contexto a través de MCP para facilitar la colaboración multi-agente.
- El estándar exigido es separación por dominios, contratos claros, validación continua y exposición de contexto vía MCP.

---

## 9. Plantilla de cierre de tarea de agente

```txt
[REPORTE_AGENTE]
Agente: <nombre>
Objetivo: <qué se resolvió>
Cambios realizados: <archivos o "ninguno">
Validación ejecutada: <qué se probó>
Resultado: <exitoso/parcial/fallido>
Riesgos/Pendientes: <lista breve o "ninguno">
Siguiente paso recomendado: <acción concreta>
```
