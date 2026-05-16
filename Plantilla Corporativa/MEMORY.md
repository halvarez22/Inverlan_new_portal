# MEMORY - Registro de Decisiones

## Formato recomendado
- Contexto:
- Decisión:
- Impacto:
- Fecha:

## Entradas

### [2026-04-13] Adaptación de plantilla corporativa a Inverlan
- Contexto: La carpeta de plantilla estaba orientada a otro producto y no reflejaba el dominio inmobiliario actual.
- Decisión: Reescribir `README.md`, `INSTRUCTIONS.md`, `AGENTS_CONTEXT.md`, `NOW.md` y conservar este archivo como bitácora oficial de decisiones.
- Impacto: Alineación inmediata para futuros cambios de agentes y equipo técnico con foco en propiedades, CRM, agentes, marketing y analítica.
- Fecha: 2026-04-13

### [2026-04-13] Criterio formal SQA/ISO y uso de MCP
- Contexto: Existía duda sobre si SQA + ISO/IEC 27034 implicaban implementar MCP de forma obligatoria.
- Decisión: Definir explícitamente que MCP es opcional y solo requerido en escenario multi-agente con estado compartido; mantener como obligatorio SQA + ISO/IEC 27034 con evidencia de validación y controles de seguridad.
- Impacto: Reduce ambigüedad técnica y evita sobre-ingeniería; conserva cumplimiento de calidad y seguridad en el roadmap actual.
- Fecha: 2026-04-13

### [2026-04-13] Retoma de alineamiento tecnico (paso 2.7)
- Contexto: El flujo de autenticacion aun mantenia logs detallados durante login y gestion de usuarios, lo que elevaba riesgo de exposicion operativa.
- Decision: Restringir logs de autenticacion a entorno local y eliminar trazas innecesarias durante login para reducir superficie de exposicion.
- Impacto: Mejora alineacion con SQA/ISO 27034 en controles de seguridad, sin cambiar comportamiento funcional del acceso.
- Fecha: 2026-04-13

### [2026-04-13] Migracion parcial a Firebase Auth (paso 2.8)
- Contexto: El acceso seguia validando contrasenas en cliente y no forzaba correo asociado para autenticacion administrada.
- Decision: Migrar login a flujo asincrono con Firebase Auth en produccion, agregar correo en gestion de usuarios, y dejar fallback local solo para desarrollo mientras se completa la migracion total.
- Impacto: Reduce riesgo en produccion y prepara la eliminacion definitiva de `password` en cliente y del fallback legacy.
- Fecha: 2026-04-13

### [2026-04-13] Auth de personal sin password en datos (paso 2.9)
- Contexto: El modelo `User` y Firestore aun podian llevar `password`; el alta debia crear identidad solo en Firebase Auth y perfil en `users`.
- Decision: Eliminar `password` del tipo y de escrituras; saneo en lectura/sync; alta con `createUserWithEmailAndPassword` en app Firebase secundaria; rollback si falla Firestore; quitar semilla local con credenciales y fallback de login por password en cliente.
- Impacto: Alineacion con provision solo por administrador y secretos solo en Auth; primer admin debe existir en Authentication + documento `users` (o crearse desde consola). Eliminar usuario en app no borra la cuenta Auth (requiere Cloud Function o consola hasta un paso 3.x).
- Fecha: 2026-04-13

### [2026-04-13] Integridad auth-perfiles, seguridad en logs, split UI y bundle (pasos 3.0–3.3)
- Contexto: Hacía falta alinear documentos `users` con Firebase Auth (`authUid`/email), endurecer trazas en servicios de usuarios, recortar vistas muy largas y reducir el chunk inicial de Vite.
- Decisión: Resolver perfil con prioridad authUid → email → username y sincronizar en login; script `migrate:auth-profiles` con firebase-admin (dry-run); permisos admin en operaciones sensibles de usuarios; `devLog`/`dev`-only en `userService` y menos PII en advertencias; extracción de piezas de `ContactPage`, `AddProperty` (primitivos + utilidades de precio) y lazy load amplio en `App` más `import()` dinámico de `geminiService` en búsqueda; `manualChunks` para react, firebase y `@google/genai`.
- Impacto: Perfiles más consistentes con Auth; menos datos en consola en producción; carga inicial notablemente menor (chunk principal ~260 kB vs ~560 kB); mantenimiento de formularios más modular.
- Fecha: 2026-04-13

### [2026-04-13] Consolidación de Gobernanza (Paso 1 del Roadmap) y Estandarización de Nombre
- Contexto: El proyecto requería alinearse estrictamente con SQA e ISO/IEC 27034, además de corregir el nombre oficial a "Inverland Portal".
- Decisión: Actualizar el nombre del proyecto en toda la documentación y configuración; crear `loggingService.ts` para centralizar logs de auditoría sin PII; implementar logs de seguridad en dominios Auth, Propiedades y Clientes; y elevar MCP a estatus de obligatorio (sine qua non).
- Impacto: Cumplimiento formal con estándares de calidad y seguridad; mayor trazabilidad de acciones críticas; alineación de marca consistente en toda la plataforma.
- Fecha: 2026-04-13

### [2026-04-13] Implementación de MCP (Paso 2 del Roadmap)
- Contexto: Se requería habilitar el intercambio de contexto entre agentes y servicios de forma estandarizada.
- Decisión: Crear una arquitectura MCP (Model Context Protocol) personalizada dentro de la SPA. Se definieron Recursos (lectura de propiedades, clientes y sesión) y Herramientas (escritura/acciones) que se exponen a través de un `MCPProvider` y se hacen accesibles globalmente vía `window.__INVERLAND_MCP__`.
- Impacto: Facilita la interoperabilidad multi-agente; permite que agentes externos comprendan el estado actual de la app y ejecuten acciones siguiendo un protocolo estándar; desacopla la exposición de datos de la implementación de la UI.
- Fecha: 2026-04-13

### [2026-04-13] Evolución a Micro-módulos (Paso 3 del Roadmap)
- Contexto: Se requería desacoplar los dominios para avanzar hacia una arquitectura orientada a microservicios y mejorar la mantenibilidad.
- Decisión: Implementar el patrón "Domain Bridge" ([domainBridge.ts](file:///c:/Inverlan_new_portal-main/domainBridge.ts)). Cada dominio (`Auth`, `Properties`, `Clients`, `Campaigns`) ahora registra su interfaz pública en el puente central. Se eliminaron todas las importaciones directas entre carpetas de dominios, obligando a que la comunicación sea a través de contratos definidos.
- Impacto: Aislamiento total entre módulos; facilidad para sustituir implementaciones de dominio sin afectar a otros; alineación con estándares de Clean Architecture y preparación para escalabilidad horizontal.
- Fecha: 2026-04-13

### [2026-04-13] Optimización Comercial: Pipeline y Comisiones (Paso 4 del Roadmap)
- Contexto: Se requería mejorar la experiencia de usuario en el CRM y automatizar el reporte de comisiones para gerencia.
- Decisión: 
    - **Pipeline Visual:** Se mejoró [SalesPipeline.tsx](file:///c:/Inverlan_new_portal-main/components/SalesPipeline.tsx) con feedback visual avanzado (columnas resaltadas, escalado, sombras y placeholders durante drag-and-drop).
    - **Gestión de Comisiones:** Se actualizó [AdminDashboard.tsx](file:///c:/Inverlan_new_portal-main/components/AdminDashboard.tsx) para incluir KPIs de comisiones totales y un desglose detallado por propiedad y agente.
    - **Auditoría:** Se integró `loggingService` para rastrear cambios de etapa en el pipeline (`PIPELINE_STAGE_CHANGE`), cumpliendo con ISO 27034.
- Impacto: Operación comercial más fluida y transparente; reportes financieros automáticos para la administración; trazabilidad completa de las ventas cerradas.
- Fecha: 2026-04-13

### [2026-04-13] Integración de Groq API
- Contexto: El usuario solicitó habilitar Groq como motor de IA adicional para la plataforma.
- Decisión: Se añadió la clave de API `VITE_GROQ_API_KEY` al archivo [.env.local](file:///c:/Inverlan_new_portal-main/.env.local) y se creó un servicio ligero [groqService.ts](file:///c:/Inverlan_new_portal-main/services/groqService.ts) que utiliza `fetch` para comunicarse con la API de Groq (Llama 3.3). Se verificó el funcionamiento con un script de prueba independiente.
- Impacto: Mayor redundancia y flexibilidad en los motores de IA; permite el uso de modelos de alto rendimiento con latencia mínima.
- Fecha: 2026-04-13

### [2026-04-13] Sustitución Definitiva de Gemini por Groq
- Contexto: Tras validar que Groq ofrece un rendimiento superior y está operativo, se decidió reemplazar Gemini como motor principal de IA.
- Decisión: 
    - Se actualizó [groqService.ts](file:///c:/Inverlan_new_portal-main/services/groqService.ts) para incluir las instrucciones de sistema de Inverland y la lógica de parseo de búsqueda con el modelo Llama 3.3.
    - Se modificó [ChatBot.tsx](file:///c:/Inverlan_new_portal-main/components/ChatBot.tsx) para dirigir todas las consultas al nuevo servicio de Groq.
    - Se actualizó [App.tsx](file:///c:/Inverlan_new_portal-main/App.tsx) para que la búsqueda inteligente de propiedades en el Hero utilice el parser de Groq en lugar del de Gemini.
- Impacto: Mejora significativa en la velocidad de respuesta de la IA; reducción de dependencias externas activas; unificación del motor de lenguaje natural bajo un estándar de alta eficiencia.
- Fecha: 2026-04-13

### [2026-04-13] Internacionalización del Portal (i18n)
- Contexto: El usuario solicitó que el portal sea multilingüe (Español, Inglés, Chino) para atraer a una audiencia global.
- Decisión: 
    - Se creó [I18nContext.tsx](file:///c:/Inverlan_new_portal-main/components/I18nContext.tsx) con soporte para ES, EN y ZH.
    - Se implementó un selector de idiomas con mini banderas (México, USA, China) utilizando SVGs de alta calidad en el [Header.tsx](file:///c:/Inverlan_new_portal-main/components/Header.tsx).
    - Se tradujeron los componentes principales: [Hero.tsx](file:///c:/Inverlan_new_portal-main/components/Hero.tsx), [PropertyListings.tsx](file:///c:/Inverlan_new_portal-main/components/PropertyListings.tsx) y [ChatBot.tsx](file:///c:/Inverlan_new_portal-main/components/ChatBot.tsx).
    - El ChatBot ahora informa a Groq el idioma seleccionado para responder de forma coherente.
- Impacto: Expansión del alcance de la plataforma; experiencia de usuario personalizada por región; automatización del idioma en la IA.
- Fecha: 2026-04-13

### [2026-04-14] Integración Nativa de Recorridos 360 (Kuula.co)
- Contexto: Los agentes necesitaban una forma sencilla de integrar recorridos virtuales inmersivos sin depender de enlaces externos manuales.
- Decisión: 
    - Se implementó detección automática de enlaces de Kuula.co en el módulo de propiedades.
    - Se añadió lógica de conversión de URLs normales a formatos de "embed" (`/share/collection/`) para visualización nativa.
    - Se configuraron parámetros de visualización premium (`fs=1`, `vr=1`, `thumbs=1`, `logo=0`) y permisos de hardware (`gyroscope`, `accelerometer`).
    - Se actualizó la UI del panel de agente para mostrar un distintivo visual de "Kuula integrado".
- Impacto: Mejora significativa en la presentación de propiedades de lujo; experiencia de usuario inmersiva directamente en el portal; facilidad de carga para los agentes.
- Fecha: 2026-04-14

### [2026-04-15] Corrección de Bootstrap de Autenticación Local
- Contexto: El inicio de sesión en local fallaba para el usuario `"admin"` porque la lista de usuarios no podía leerse de Firestore antes de estar autenticado (problema circular de permisos).
- Decisión: 
    - Se refactorizó `AuthContext.tsx` para corregir un bug estructural en el manejo de fallbacks.
    - Se habilitó la carga de `localStorage` como respaldo inmediato ante errores de permisos.
    - Se implementó un mapeo de desarrollo (bootstrap) que resuelve el username `"admin"` a un correo electrónico estándar para permitir la primera autenticación incluso con el catálogo vacío.
- Impacto: Permite a los desarrolladores iniciar sesión y "desbloquear" Firestore sin configuraciones manuales complejas; mejora la robustez del flujo de carga inicial.
- Fecha: 2026-04-15

### [2026-04-15] Internacionalización de Fichas Informativas y Botones de Descarga
- Contexto: El portal ya era multilingüe, pero las fichas informativas descargables y el botón de acción seguían hardcodeados en español.
- Decisión: 
    - Se agregaron claves de i18n para todos los textos de la ficha (descripción, amenidades, avisos legales, etc.).
    - Se modificó `PropertyDatasheet.tsx` para usar el hook `useI18n` y recibir títulos/descripciones traducidos.
    - Se localizó el formato de fecha y moneda según el idioma seleccionado (`es-MX`, `en-US`, `zh-CN`).
    - Se tradujo completamente el botón "Descargar Ficha" y su descripción en `PropertyDetailPage.tsx`.
- Impacto: Experiencia coherente en todos los idiomas soportados; permite la generación de material de marketing exportable para clientes internacionales.
- Fecha: 2026-04-15

### [2026-04-30] Refactorizaci�n de Edici�n de Propiedades y Paridad de Formulario
- Contexto: El cliente report� que muchos campos presentes en el formulario de alta (AddProperty) no eran editables en la p�gina de edici�n, debido a una desincronizaci�n t�cnica entre ambos formularios.
- Decisi�n: 
    - Se refactoriz� completamente EditPropertyPage.tsx para integrar los componentes modulares compartidos (PropertyLocationSection, PropertyAmenitiesSection, PropertyPoliciesSection).
    - Se habilitaron campos cr�ticos que faltaban: N�mero Exterior/Interior, Esquina con, CP, Amenidades por categor�a, Pol�ticas de mascotas/fumar y selecci�n de Tipo de Operaci�n (Venta/Renta/Renta temporal).
    - Se incluy� la funcionalidad de " Generar con IA\ para descripciones en el modo edici�n.
- Impacto: Se resolvi� la limitaci�n operativa de los agentes para actualizar fichas completas; se elimin� la deuda t�cnica de duplicidad de l�gica de formularios y se asegur� una experiencia de usuario consistente en todo el ciclo de vida de la propiedad.
- Fecha: 2026-04-30

### [2026-05-16] Sincronización en tiempo real de propiedades (Firestore)
- Contexto: Los cambios se veían en la consola de Firebase pero no en la app; la carga inicial usaba `orderBy(createdAt)` y, ante fallos de lectura, se mostraba un respaldo obsoleto de `localStorage`.
- Decisión: Suscripción con `onSnapshot` sobre la colección `properties`, lectura sin `orderBy` en servidor (orden en cliente), eliminación del fallback silencioso a `localStorage` en errores y respaldo local solo tras datos confirmados de Firebase.
- Impacto: La UI refleja altas, ediciones y borrados sin recargar la página; se evita mostrar datos viejos cuando Firestore es la fuente de verdad.
- Fecha: 2026-05-16
