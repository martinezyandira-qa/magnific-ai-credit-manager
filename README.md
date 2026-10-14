# Magnific AI Credit Manager

**PWA para controlar créditos de Magnific AI en producciones audiovisuales — desarrollo y aseguramiento de calidad (QA).**

> **Enfoque del portafolio:** este proyecto muestra tanto la construcción de una herramienta utilizada en un flujo de producción audiovisual como el análisis, diseño y verificación de su comportamiento. Se distinguen explícitamente las comprobaciones realizadas de los casos pendientes de ejecución documentada.

## Problema y solución

Una producción audiovisual puede consumir créditos de IA en múltiples episodios y programas. Sin un registro centralizado es difícil conocer el saldo disponible, asociar consumos a episodios, estimar costos y evitar mezclar datos de distintas producciones.

La solución es una **Progressive Web App (PWA)** con registro de generaciones, compras, reportes y una bolsa global de créditos compartida entre programas, mientras cada programa conserva sus episodios, metas e historial propios.

## Mi participación

- **Análisis funcional:** definición de reglas de negocio para créditos globales, registros por programa, acceso administrativo y reportes.
- **Desarrollo e integración:** interfaz HTML/CSS/JavaScript, conexión con API en Google Apps Script, persistencia en Google Sheets y publicación con Firebase Hosting.
- **Quality Assurance:** definición de escenarios positivos, negativos, de límites, integridad de datos y regresión; comprobaciones manuales de flujos implementados y registro de mejoras.
- **Mantenimiento:** correcciones y validación de cambios en una PWA instalada en diferentes equipos.

## Funcionalidades

- Inicio de sesión con contraseña y selección de programa.
- Creación de programas mediante verificación de contraseña administrativa.
- Registro de generaciones con episodio, fecha, créditos y descripción.
- Archivo y recuperación de generaciones.
- Compras globales de créditos con costos en **MXN y USD**, sin conversión automática.
- Saldo global compartido y reportes de consumo filtrados por programa y episodio.
- Validaciones de campos obligatorios, formatos, límites y fechas.
- Controles de escritura cuando se detecta falta de conexión.
- Instalación como PWA.

## Testing & Quality Assurance

### Estrategia de pruebas

El enfoque de pruebas combina verificaciones de interfaz y flujos completos con comprobaciones de las reglas de negocio y persistencia. La matriz de escenarios se encuentra en [`docs/TEST-PLAN.md`](docs/TEST-PLAN.md).

| Área | Qué se comprueba | Técnica / enfoque |
|---|---|---|
| Autenticación y roles | Contraseña válida/inválida y restricción de creación de programas | Pruebas positivas y negativas |
| Gestión de programas | Alta, selección y persistencia del programa | Prueba funcional e integración UI–API–Sheets |
| Generaciones | Campos requeridos, episodio, créditos, fechas y descripción | Partición de equivalencia y valores límite |
| Créditos globales | Compras, consumos y cálculo de saldo compartido | Reglas de negocio y consistencia de datos |
| Separación por programa | Historial, episodios, metas y reportes | Integridad de datos / regresión |
| Compras y costos | Monedas MXN/USD, importes y cálculos | Validación de datos y reglas de negocio |
| Reportes | Agrupación por episodio, subtotales y totales | Prueba funcional y comparación de resultados |
| PWA y conectividad | Actualización de archivos almacenados, caché y bloqueo de escrituras | Compatibilidad, regresión y pruebas de conectividad |
| API y persistencia | Solicitudes GET/POST, respuestas, errores y escritura en Sheets | Pruebas de integración y contrato de API |

### Comprobaciones realizadas durante el desarrollo

Estas verificaciones se realizaron de forma manual durante la evolución de la aplicación. **No equivalen a una ejecución formal de toda la matriz de pruebas.**

- **Selector de programas:** se comprobó que la pantalla de acceso cargara el programa existente y permitiera ingresar.
- **Alta administrativa:** se probó el flujo de **«Añadir programa»** y la creación de un nuevo programa desde el login.
- **Reportes:** se revisó y ajustó la agrupación por episodio para mostrar registros, subtotales y total general; también se eliminó un cálculo histórico automático que duplicaba información registrada manualmente.
- **Actualización PWA:** se identificó una diferencia de versión entre el navegador y la aplicación instalada en Windows. La actualización se recuperó tras limpiar el Service Worker/caché; la versión actualizada también se observó en Mac.

### Escenarios pendientes de evidencia formal

Aún es necesario registrar pasos, datos de prueba, resultado real, estado **Pass/Fail**, capturas y fecha de ejecución para afirmar una cobertura completa. Entre las prioridades están: aislamiento entre programas, impacto de consumos sobre el saldo global, permisos por rol, casos límite de formularios, integridad en Sheets, manejo de fallos de red y regresión después de desplegar.

### Evidencias y defectos

La carpeta [`docs/`](docs/) contiene el plan de pruebas y las consideraciones de seguridad. Como siguiente mejora se incorporarán una **matriz de ejecución**, evidencias visuales anonimizadas y reportes de defectos reproducibles (pasos, resultado esperado, resultado obtenido, severidad y estado).

> No se atribuyen métricas de cobertura, número de bugs o porcentajes de éxito sin un registro de ejecución que los respalde.

## Arquitectura

```text
PWA (HTML / CSS / JavaScript)
          |
          v
Google Apps Script (API GET / POST)
          |
          v
Google Sheets (Programas, Generaciones, Compras, Configuración)
```

Firebase Hosting publica el frontend. Las compras son globales; las generaciones se relacionan con un `programId` estable. La separación actual por programa se implementa principalmente en el cliente; **no es aislamiento de seguridad entre usuarios**.

## Tecnologías y herramientas

**HTML5 · CSS3 · JavaScript · Google Apps Script · Google Sheets · Firebase Hosting · PWA · REST/JSON · Git/GitHub**

## Estructura del repositorio

- `index.html`: interfaz y lógica del cliente.
- `backend/Code.gs`: API y persistencia con Google Apps Script.
- `docs/TEST-PLAN.md`: escenarios y criterios de prueba.
- `docs/SECURITY.md`: limitaciones y consideraciones de seguridad.
- `service-worker.js`, `manifest.webmanifest`, `icons/`: componentes de la PWA.
- `firebase.json`: configuración de Hosting.

## Ejecución en un entorno propio

1. Crear una hoja de cálculo y asociarle un proyecto de Google Apps Script.
2. Incorporar `backend/Code.gs` y configurar `USER_PASSWORD` y `ADMIN_PASSWORD` en **Script Properties** (nunca en GitHub).
3. Preparar las hojas y datos iniciales según el esquema esperado por el backend; el repositorio no incluye una migración automática integral para instalaciones nuevas.
4. Desplegar el script como aplicación web y configurar en `index.html` la URL `/exec` de **una instancia propia de pruebas** en lugar de `REPLACE_WITH_YOUR_APPS_SCRIPT_WEB_APP_URL`.
5. Servir el frontend por HTTPS para utilizar las capacidades PWA.

**Esta copia del repositorio no está conectada a los datos reales de producción.**

## API — resumen

| Método | Acción | Uso |
|---|---|---|
| GET | `action=public-programs` | Lista de programas activos |
| GET | `action=login` | Autenticación y rol |
| GET | `key=programs` / `credit-entries` / `credit-purchases` / `settings` | Lectura de datos autorizada |
| POST | `action=save` | Guardado de datos; `programs` requiere administrador |

El backend utiliza contraseñas compartidas y las envía en parámetros GET para ciertas operaciones. También permite guardar colecciones completas, lo que supone riesgos de concurrencia y autorización. **No debe considerarse una API segura para datos sensibles o uso multiusuario público sin rediseñar autenticación, permisos y escrituras.** Consulta [`docs/SECURITY.md`](docs/SECURITY.md).

## Próximas mejoras

- Completar la ejecución formal de pruebas y publicar evidencias anonimizadas.
- Automatizar pruebas de API y de flujos críticos de la interfaz.
- Fortalecer autenticación, autorización por recurso y validación del servidor.
- Mejorar la actualización automática del Service Worker.
- Incorporar administración completa de programas (edición y desactivación).

## Autoría

**Proyecto personal de desarrollo y QA**, creado para resolver una necesidad real de seguimiento de créditos en producción audiovisual y documentar la aplicación de pruebas de software durante su evolución.
