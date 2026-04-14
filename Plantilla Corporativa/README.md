# Plantilla Corporativa - Inverlan Portal Inmobiliario

Plantilla operativa para mantener la app inmobiliaria de Inverlan con disciplina de ingeniería:
- reglas de calidad claras,
- foco de sprint visible,
- memoria técnica persistente para decisiones de producto y arquitectura.

## Qué incluye
- `INSTRUCTIONS.md`: reglas de ingeniería, seguridad y calidad para la app.
- `NOW.md`: foco operativo del sprint actual (objetivo, estado y cierre).
- `MEMORY.md`: bitácora de decisiones técnicas y funcionales.
- `AGENTS_CONTEXT.md`: contexto compartido para agentes IA que colaboran en el repositorio.

## Para qué usar esta carpeta
1. Alinear al equipo (humano + agentes) sobre cómo trabajar en el portal inmobiliario.
2. Definir alcance de cada sprint y evitar cambios de alto riesgo fuera de foco.
3. Registrar decisiones relevantes (por ejemplo, cambios en CRM, analítica, agentes o integraciones).
4. Mantener consistencia entre frontend, servicios y configuración de despliegue.

## Convención mínima recomendada
- PRs pequeños y enfocados en una sola intención.
- No integrar cambios si fallan `lint`, `typecheck` o pruebas del área impactada.
- Registrar en `MEMORY.md` toda decisión que cambie comportamiento de negocio o arquitectura.
