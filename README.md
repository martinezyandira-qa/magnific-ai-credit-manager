# Magnific AI Credit Manager

Aplicación web progresiva (PWA) para registrar y consultar el consumo de créditos de Magnific AI en producciones audiovisuales.

## Funcionalidades

- Acceso con contraseña y selección de programa.
- Alta de programas con autorización de administrador.
- Registro de generaciones por episodio, fecha, créditos y descripción.
- Historial y archivo de generaciones.
- Registro de compras globales de créditos y costos en USD/MXN, sin conversión automática.
- Seguimiento del saldo global compartido entre programas.
- Reportes de consumo por programa y episodio.
- Validaciones de formularios, sincronización y protección de escritura ante pérdida de conexión.
- Instalación como PWA.

## Arquitectura

`PWA (HTML/CSS/JavaScript) → Google Apps Script (API) → Google Sheets (almacenamiento)`

Firebase Hosting sirve los archivos estáticos. Las compras y el saldo son globales; las generaciones, episodios y metas se asocian a un programa.

## Estructura

- `index.html`: interfaz y lógica del cliente.
- `manifest.webmanifest`: metadatos de instalación.
- `service-worker.js`: estrategia de caché de la PWA.
- `icons/`, `logo-ccia.png`: recursos visuales.
- `firebase.json`: configuración de Firebase Hosting.
- `docs/`: notas de arquitectura y pruebas.

## Configuración local

1. Configurar una instancia propia de Google Apps Script y Google Sheets con el contrato API correspondiente.
2. En `index.html`, sustituir `REPLACE_WITH_YOUR_APPS_SCRIPT_WEB_APP_URL` por la URL `/exec` **de una instancia de pruebas propia**.
3. Publicar el frontend en hosting HTTPS para instalarlo como PWA.

**Importante:** el backend `Code.gs` no está incluido en esta entrega porque no estaba dentro del ZIP original. El frontend por sí solo no permite iniciar sesión ni almacenar datos; requiere un backend compatible. Este repositorio no está listo para un despliegue funcional independiente hasta incorporar/configurar ese backend.

## API esperada por el cliente

- `GET ?action=public-programs`: lista de programas activos para el selector.
- `GET ?action=login&password=...`: autorización y rol.
- `GET ?key=...&password=...`: lectura de `programs`, `credit-entries`, `credit-purchases` y `settings`.
- `POST` JSON con `action=save`, `key`, `value` y `password`: persistencia de cambios.

La versión original usa contraseñas enviadas en consultas GET y cargas de datos compartidas. Antes de ofrecerla públicamente como servicio, conviene implementar autenticación basada en tokens, permisos por recurso y validación del lado del servidor.

## Estado y alcance de pruebas

Se verificaron manualmente la carga del selector de programas y el flujo de alta con autorización administrativa en la aplicación original. Las pruebas de aislamiento entre programas, saldo compartido y regresión completa quedan pendientes de documentar y ejecutar sobre una instancia de pruebas.

## Autoría

Proyecto de portafolio que integra producción audiovisual, desarrollo web y control de calidad de software.

## Backend (Google Apps Script)

El archivo `backend/Code.gs` documenta la implementación multiprograma de Google Apps Script. Para desplegar una instancia propia se necesita una hoja de cálculo de Google Sheets, un proyecto de Apps Script asociado y las propiedades de script `USER_PASSWORD` y `ADMIN_PASSWORD`. **No utilices datos ni contraseñas de producción en una demostración pública.**

### Consideraciones de seguridad

Este proyecto se publica como muestra técnica, no como solución multiusuario de producción. El acceso utiliza contraseñas compartidas; la lectura de registros se realiza a nivel global y el filtrado por programa ocurre en el frontend. Las operaciones de guardado reemplazan conjuntos completos de datos y pueden producir conflictos entre clientes. Antes de utilizarlo con datos sensibles se recomienda autenticación individual, autorización por programa y escrituras transaccionales.
