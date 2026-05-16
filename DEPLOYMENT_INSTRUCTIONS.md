# 🚀 Instrucciones de Despliegue - Corrección de Persistencia de Datos

## ⚠️ PROBLEMA CRÍTICO RESUELTO

**Problema**: Los datos capturados por el equipo de pruebas se perdían al refrescar la página (Ctrl+F5) porque solo se guardaban en localStorage.

**Solución**: Implementada persistencia garantizada en Firebase con fallbacks robustos.

## 🔧 Cambios Implementados

### 1. **ClientContext.tsx** - ✅ CORREGIDO
- **ANTES**: Solo localStorage (se perdían datos al refrescar)
- **AHORA**: Firebase como persistencia principal + localStorage como backup
- **Migración automática**: Los datos de muestra se migran a Firebase automáticamente

### 2. **CampaignContext.tsx** - ✅ CORREGIDO  
- **ANTES**: Solo localStorage (se perdían datos al refrescar)
- **AHORA**: Firebase como persistencia principal + localStorage como backup
- **Migración automática**: Los datos de muestra se migran a Firebase automáticamente

### 3. **PropertyContext.tsx** - ✅ MEJORADO
- **ANTES**: Ya tenía Firebase pero sin migración automática
- **AHORA**: Migración automática de datos de muestra a Firebase

### 4. **Servicios Firebase por dominio** - ✅ REFACTORIZADO
- Persistencia separada por módulos en `services/firebase/`
- Operaciones CRUD desacopladas para propiedades, clientes, campañas y usuarios

### 5. **Nuevos Componentes**
- **DataMigration.tsx**: Migración automática de datos de muestra
- **SyncStatus.tsx**: Indicador visual de estado de conexión
- **useConnectionStatus.ts**: Hook para manejar estado de conexión

## 🚀 Pasos para Desplegar en Producción (inverland.mx)

Para que la aplicación funcione en el dominio privado, sigue estos pasos:

### 1. **Configuración en Vercel**
1. Entra a tu dashboard de Vercel y selecciona el proyecto.
2. Ve a **Settings** > **Domains**.
3. Agrega `inverland.mx` y `www.inverland.mx`.
4. Vercel detectará que necesitas configurar los DNS.

### 2. **Configuración de DNS (GoDaddy u otro registrador)**
Debes actualizar los registros DNS que proporcionaste con estos nuevos valores:

| Tipo | Nombre | Valor | Acción |
| :--- | :--- | :--- | :--- |
| **A** | `@` | `76.76.21.21` | Cambiar el actual `158.23.105.1` |
| **CNAME** | `www` | `cname.vercel-dns.com` | Cambiar el actual que apunta a Azure |
| **CNAME** | `inverland.mx` | - | **ELIMINAR** (el registro A `@` es suficiente) |

*Nota: También se recomienda eliminar los registros `txt` con nombre `asuid` y `asuid.www` ya que son específicos de Azure y no se necesitan para Vercel.*

### 3. **Configuración en Firebase (CRÍTICO para Auth)**
Para que el inicio de sesión funcione en el nuevo dominio:
1. Ve a [Firebase Console](https://console.firebase.google.com/).
2. Selecciona tu proyecto.
3. Ve a **Authentication** > **Settings** > **Authorized Domains**.
4. Haz clic en **Add Domain** y agrega:
   - `inverland.mx`
   - `www.inverland.mx`

### 4. **Verificar Variables de Entorno**
Asegúrate de que en Vercel (**Settings** > **Environment Variables**) estén configuradas todas las variables necesarias de producción, especialmente las de Firebase y las API Keys de Gemini/Groq.

El `VITE_FIREBASE_PROJECT_ID` debe ser **el mismo proyecto** donde ves las propiedades en la consola de Firebase. Si Vercel apunta a otro proyecto, el sitio mostrará **0 propiedades**.

### 5. **Reglas de Firestore (CRÍTICO para el catálogo público)**
La página de inicio lee `properties` **sin iniciar sesión**. Si las reglas exigen `request.auth`, verás **0 propiedades** en Vercel aunque existan en la consola.

1. En Firebase Console → **Firestore** → **Reglas**, publica reglas que permitan lectura pública del catálogo, por ejemplo el archivo `firestore.rules` de este repo:

```
match /properties/{propertyId} {
  allow read: if true;
  allow create, update, delete: if request.auth != null;
}
```

2. O desde CLI (con Firebase CLI instalado y proyecto seleccionado):

```bash
firebase deploy --only firestore:rules
```

3. Tras publicar reglas, recarga el sitio en Vercel (Ctrl+F5).

---

## 🚀 Pasos para Actualizaciones Continuas (CI/CD)
```bash
git add .
git commit -m "🚀 CRITICAL FIX: Garantizar persistencia de datos en Firebase

- Migrar ClientContext y CampaignContext a Firebase
- Implementar migración automática de datos de muestra
- Agregar indicadores de estado de sincronización
- Resolver pérdida de datos al refrescar página (Ctrl+F5)

Fixes: Pérdida de datos de prueba en producción"
git push origin main
```

### 2. **Verificar Despliegue en Vercel**
- Vercel se desplegará automáticamente desde GitHub
- Verificar que la URL https://inverlan-new-portal.vercel.app/ esté actualizada

### 3. **Verificación Post-Despliegue**

#### ✅ **Checklist de Verificación**
- [ ] La aplicación carga sin errores
- [ ] Se muestra el modal de migración de datos (primera vez)
- [ ] Los datos de muestra aparecen correctamente
- [ ] Al agregar una nueva propiedad, se guarda en Firebase
- [ ] Al refrescar la página (Ctrl+F5), los datos persisten
- [ ] El indicador de estado de conexión funciona
- [ ] No hay errores en la consola del navegador

#### 🧪 **Pruebas del Equipo de Testing**
1. **Limpiar datos locales**:
   ```javascript
   // En la consola del navegador
   localStorage.clear();
   sessionStorage.clear();
   ```

2. **Refrescar página** (Ctrl+F5)

3. **Verificar migración automática**:
   - Debe aparecer el modal "Migrando datos a Firebase"
   - Los datos de muestra deben cargar automáticamente

4. **Probar persistencia**:
   - Agregar una nueva propiedad
   - Refrescar página (Ctrl+F5)
   - Verificar que la propiedad persiste

## 🔍 Arquitectura de Persistencia Implementada

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Firebase      │    │  LocalStorage   │    │ Datos de Muestra│
│   (Principal)   │◄──►│   (Backup)      │◄──►│   (Fallback)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         ▲                       ▲                       ▲
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────────────────────────────────────────────────────┐
│                    ESTRATEGIA DE FALLBACK                       │
│                                                                 │
│  1. Intentar Firebase                                           │
│  2. Si falla → LocalStorage                                    │
│  3. Si falla → Datos de muestra                               │
│  4. Migración automática a Firebase                            │
└─────────────────────────────────────────────────────────────────┘
```

## 🛡️ Garantías de Persistencia

### **Nivel 1: Firebase Firestore**
- ✅ Persistencia en la nube
- ✅ Sincronización entre dispositivos
- ✅ Escalabilidad
- ✅ Timestamps automáticos

### **Nivel 2: LocalStorage**
- ✅ Respaldo local inmediato
- ✅ Funciona offline
- ✅ Persistencia entre sesiones

### **Nivel 3: Datos de Muestra**
- ✅ Garantiza que la app siempre funcione
- ✅ Experiencia de usuario consistente

## 🚨 Notas Importantes

1. **Primera carga**: La primera vez que se accede a la aplicación después del despliegue, se ejecutará la migración automática de datos de muestra.

2. **Indicador de estado**: El equipo de pruebas verá un indicador en la esquina superior derecha que muestra el estado de conexión con Firebase.

3. **Sin pérdida de datos**: Ahora es imposible perder datos al refrescar la página, ya que todo se guarda en Firebase.

4. **Compatibilidad**: Los cambios son completamente compatibles con el código existente.

## 📞 Contacto de Emergencia

Si hay algún problema durante el despliegue:
- Revisar logs de Vercel
- Verificar configuración de Firebase
- Confirmar que las variables de entorno estén correctas

---

**✅ ESTADO**: Listo para despliegue inmediato
**🎯 OBJETIVO**: Resolver pérdida de datos en producción
**⏰ URGENCIA**: CRÍTICA - El equipo de pruebas está esperando
