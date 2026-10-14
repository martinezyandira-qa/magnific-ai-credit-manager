# Plan de pruebas y evidencias QA — Magnific AI Credit Manager

**Proyecto:** Magnific Control de Créditos · **Versión:** PWA multiprograma  
**Responsable:** Yandira Martínez Jaimes · **Tipo:** Proyecto personal (desarrollo + QA)  
**Estado del documento:** Plan de pruebas con resultados parciales basados en verificaciones reportadas.  
**Fecha de actualización:** 2026-10-13

> **Transparencia de evidencia:** Las pruebas que se indican como *observadas* corresponden a verificaciones manuales comunicadas durante el desarrollo, no a una ejecución formal con capturas, logs y acta de pruebas. Los demás casos permanecen **pendientes**. No se atribuyen ejecuciones de Postman, automatización o métricas de cobertura que no estén documentadas.

## 1. Objetivo

Evaluar el comportamiento funcional y la integridad de datos de una PWA que registra generaciones y compras de créditos de Magnific AI, con múltiples programas independientes que comparten un saldo global. Documentar escenarios positivos, negativos, límites, integración frontend–Apps Script–Google Sheets, regresión y actualización de la PWA.

## 2. Alcance

**Incluido:** autenticación, selector de programas, creación administrativa, validaciones, registro/archivo de generaciones, compras USD/MXN, cálculo de saldo global, separación por programa, reportes, sincronización, modo sin conexión y actualización de PWA.

**Fuera de alcance por ahora:** pruebas de carga a gran escala, pentesting formal, automatización E2E, compatibilidad exhaustiva entre navegadores, publicación en tiendas, acceso multiusuario empresarial.

## 3. Entorno y datos de prueba

| Elemento | Configuración / criterio |
|---|---|
| Frontend | HTML, CSS y JavaScript; PWA en Firebase Hosting |
| Backend | Google Apps Script (`doGet`, `doPost`) |
| Persistencia | Google Sheets: `Generaciones`, `Compras`, `Programas`, `Configuracion`, `Data`, `Audit` |
| Navegadores | Chrome en Windows y navegador en macOS; registrar versión exacta al ejecutar |
| Roles | `user` y `admin`; usar credenciales de prueba, nunca incluirlas en el repositorio |
| Programa A | `El Corral VIP` (datos existentes) |
| Programa B | Programa de prueba creado desde el login; registrar ID real |
| Precaución | Ejecutar escrituras sobre una copia de pruebas de la hoja y del despliegue cuando sea posible |

**Datos de ejemplo sugeridos:** episodio `1`, fecha local de hoy, `125` créditos, descripción `QA - prueba de integración`; compra ficticia `1000` créditos, costo `20.50`, moneda `USD`. No introducir compras ficticias en el entorno productivo.

## 4. Criterios de entrada y salida

**Entrada:** respaldo reciente de Google Sheets; URL de pruebas funcional; programas A y B existentes; usuario y administrador de pruebas; conectividad disponible; valores iniciales de saldo registrados.

**Salida:** casos prioritarios ejecutados con evidencia; defectos críticos/altos corregidos o aceptados explícitamente; verificación de regresión; diferencias de saldo reconciliadas con registros de Sheets.

**Prioridad:** P0 = seguridad/integridad de datos; P1 = flujo principal; P2 = interfaz/compatibilidad.

## 5. Casos de prueba

Cada caso incluye pasos reproducibles. El campo **Estado** describe evidencia disponible al preparar este documento, no una afirmación de ejecución exhaustiva.

### Acceso y administración de programas

**TC-01 · P1 · Mostrar programas activos en login**  
**Precondición:** hoja `Programas` con al menos un programa activo.  
**Pasos:** 1) Abrir la PWA en ventana nueva. 2) Esperar carga del selector. 3) Abrir desplegable.  
**Esperado:** lista nombres de programas activos, sin mostrar saldos ni registros antes de autenticar.  
**Estado:** **Observado manualmente**: apareció `El Corral VIP` en el selector. **Evidencia:** pendiente de adjuntar.

**TC-02 · P0 · Rechazar contraseña incorrecta**  
**Pasos:** 1) Seleccionar programa. 2) Escribir contraseña inválida. 3) Pulsar Entrar.  
**Esperado:** acceso rechazado; no se muestra el contenido de producción.  
**Estado:** Pendiente.

**TC-03 · P0 · Impedir creación sin rol administrador**  
**Pasos:** 1) Pulsar `＋ Añadir programa`. 2) Introducir contraseña de usuario normal o inválida. 3) Intentar continuar.  
**Esperado:** formulario de creación no habilitado; no se agrega fila en `Programas`.  
**Estado:** Pendiente.

**TC-04 · P1 · Crear programa con administrador**  
**Pasos:** 1) Pulsar `＋ Añadir programa`. 2) Validar contraseña admin. 3) Completar nombre, descripción opcional y meta `10`. 4) Crear. 5) Revisar selector y hoja `Programas`.  
**Esperado:** programa activo, ID único y meta `10`; aparece en selector sin alterar programa A.  
**Estado:** **Observado manualmente**: creación desde login confirmada por la usuaria. **Evidencia en hoja:** pendiente.

**TC-05 · P1 · Validar campos al crear programa**  
**Pasos:** probar nombre vacío; meta vacía, `0`, `-1`, `1.5`; nombre duplicado.  
**Esperado:** mensajes de validación; no se guarda programa inválido o duplicado.  
**Estado:** Pendiente.

### Generaciones y separación de programas

**TC-06 · P0 · Registrar generación en programa A**  
**Pasos:** 1) Entrar a A. 2) Registrar episodio `1`, fecha actual, `125` créditos y descripción de prueba. 3) Revisar historial y `Generaciones`.  
**Esperado:** registro con `ProgramaID` de A, datos íntegros y un único ID.  
**Estado:** Pendiente de ejecución documentada.

**TC-07 · P0 · Aislamiento de generaciones entre A y B**  
**Pasos:** 1) Crear generación de prueba en B. 2) Cambiar a A con nueva autenticación. 3) Revisar listado y reportes. 4) Volver a B.  
**Esperado:** generación visible solo en B; no modifica el historial de A.  
**Estado:** Pendiente; esta verificación fue identificada como siguiente prueba tras la actualización multiprograma.

**TC-08 · P0 · Descuento de saldo global**  
**Pasos:** 1) Anotar saldo global en A y B. 2) Registrar generación usada de `125` créditos en B. 3) Sincronizar ambos.  
**Esperado:** saldo global disminuye `125` en ambos; el contador de consumo específico aumenta solo en B.  
**Estado:** Pendiente.

**TC-09 · P1 · Fecha futura no permitida**  
**Pasos:** intentar registrar generación con fecha de mañana.  
**Esperado:** se bloquea y muestra validación.  
**Estado:** Pendiente de evidencia formal; existe validación implementada en el frontend.

**TC-10 · P1 · Valores límite de episodio y créditos**  
**Datos:** episodio vacío, `0`, `1`, `999`, `1000`, caracteres; créditos vacío, `0`, `-5`, `1`, `1.5`.  
**Esperado:** episodio con 1–3 dígitos; créditos enteros positivos; errores señalados sin guardar. **Nota:** confirmar comportamiento de episodio `0` y ceros iniciales según regla de negocio acordada.  
**Estado:** Pendiente.

**TC-11 · P1 · Archivar y recuperar generación**  
**Pasos:** crear generación de prueba, archivarla, comprobar historial, recuperarla.  
**Esperado:** cambia `Archivada`/`FechaArchivo`; conserva episodio, créditos, descripción y programa.  
**Estado:** Pendiente.

### Compras, cálculos y reportes

**TC-12 · P0 · Compras globales y monedas separadas**  
**Pasos:** registrar compras de prueba en USD y MXN; revisar lista, Sheets y reporte.  
**Esperado:** ambas compras son globales; los costos conservan su moneda sin conversión automática.  
**Estado:** Pendiente de evidencia formal.

**TC-13 · P0 · Integridad del cálculo de saldo**  
**Datos:** total comprado = `C`; créditos iniciales ya usados = `I`; generaciones marcadas como usadas = `G`.  
**Esperado:** saldo = `C − I − G` según configuración vigente; generaciones archivadas siguen contando si permanecen usadas. Revisar que compras históricas e `initialUsed` no dupliquen consumo.  
**Estado:** Pendiente.

**TC-14 · P1 · Reporte agrupado por episodio**  
**Pasos:** crear dos generaciones en episodio `101` y una en `102`; generar reporte total del programa.  
**Esperado:** agrupación por episodio, detalle cronológico, subtotales y total; costos USD/MXN sin mezcla.  
**Estado:** **Observado manualmente**: agrupación de reporte confirmada durante el desarrollo. **Evidencia:** pendiente.

**TC-15 · P0 · Reporte aislado por programa**  
**Pasos:** registrar episodios diferentes en A y B; descargar o visualizar reporte de A.  
**Esperado:** ninguna generación ni nombre de B aparece en el reporte de A; el saldo global puede figurar identificado como compartido.  
**Estado:** Pendiente.

### Integración, conexión y PWA

**TC-16 · P0 · Persistencia Apps Script–Google Sheets**  
**Pasos:** guardar un registro de prueba; comprobar fila en Sheets; cerrar sesión y volver a abrir.  
**Esperado:** dato persistente y consistente en ambos lados; no duplicación.  
**Estado:** Pendiente de evidencia formal.

**TC-17 · P1 · Escritura bloqueada sin conexión**  
**Pasos:** iniciar con datos cargados, desconectar red, intentar guardar generación o compra.  
**Esperado:** aviso de desconexión y bloqueo de escrituras; ningún cambio silencioso en Sheets.  
**Estado:** Pendiente.

**TC-18 · P1 · Sincronización tras reconexión**  
**Pasos:** desconectar, reconectar, activar sincronización y revisar datos.  
**Esperado:** recupera conexión y muestra registros vigentes sin duplicaciones.  
**Estado:** Pendiente.

**TC-19 · P1 · Actualización de PWA instalada**  
**Pasos:** publicar nueva versión; abrir web en navegador y PWA instalada; comparar; actualizar Service Worker/caché cuando sea necesario.  
**Esperado:** PWA instalada termina mostrando versión actual.  
**Estado:** **Observado manualmente**: Mac actualizada, Windows mostró versión anterior en PWA; tras limpiar registro/caché del Service Worker, se actualizó. **Incidencia:** ver sección 7.

**TC-20 · P0 · Permisos de API sobre programas**  
**Pasos:** con credencial de usuario normal, intentar POST `save` con `key=programs`; repetir con administrador en entorno de prueba.  
**Esperado:** usuario recibe `admin_required`; administrador puede guardar un conjunto válido.  
**Estado:** Pendiente. El código implementa esta restricción, pero eso no sustituye la prueba de ejecución.

## 6. Pruebas de API propuestas

El backend usa un endpoint Apps Script con acciones por GET/POST. Estos escenarios se pueden ejecutar manualmente con Postman, sin publicar URLs privadas ni contraseñas.

| API-ID | Método / acción | Escenario | Esperado | Estado |
|---|---|---|---|---|
| API-01 | GET `action=public-programs` | Sin autenticación | Lista de `{id,name}` activos | Pendiente |
| API-02 | GET `action=login` | Contraseña incorrecta | `authorized:false` | Pendiente |
| API-03 | GET `key=credit-entries` | Credencial válida | Array de generaciones | Pendiente |
| API-04 | GET `key=programs` | Credencial válida | Array de programas | Pendiente |
| API-05 | POST `action=save`, `key=programs` | Rol user | `admin_required` | Pendiente |
| API-06 | POST `action=save`, `key=programs` | Meta inválida | Error de validación | Pendiente |
| API-07 | POST `action=save` | JSON mal formado | `invalid_json` | Pendiente |
| API-08 | POST `action=delete`, `key=programs` | Rol admin | `program_delete_not_allowed` | Pendiente |

**Observación de seguridad:** actualmente la contraseña se envía como parámetro GET para ciertas acciones y el backend permite guardar arreglos completos. Se recomienda reforzar autenticación, validación y control de concurrencia antes de abrir la aplicación a usuarios externos.

## 7. Registro de incidencias conocidas

| ID | Hallazgo | Impacto | Acción realizada | Estado |
|---|---|---|---|---|
| BUG-01 | PWA instalada en Windows conservó interfaz antigua tras desplegar nueva versión | Versión inconsistente entre navegador y app instalada | Desregistrar Service Worker, limpiar datos del sitio y reabrir | Resuelto manualmente; prevención automática pendiente |
| BUG-02 | Error de sintaxis en versión anterior impidió completar login en hosting | Bloqueo de flujo principal | Corrección del frontend y nuevo despliegue | Corrección reportada; evidencia de regresión pendiente |
| BUG-03 | Diferencia de fecha por uso de UTC/caché en versión anterior | Fecha incorrecta en formulario | Ajuste de fecha local y estrategia de caché | Corrección reportada; evidencia de regresión pendiente |

Estos registros resumen incidencias tratadas durante el desarrollo; no equivalen a tickets formales de Jira.

## 8. Plantilla para evidencias de ejecución

Duplicar esta ficha para cada prueba realizada:

```text
Caso: TC-__
Fecha/hora y zona:
Tester:
Entorno / navegador / versión:
Build o commit:
Precondiciones:
Datos de prueba (sin secretos):
Pasos ejecutados:
Resultado esperado:
Resultado obtenido:
Estado: PASS / FAIL / BLOCKED / NOT RUN
Evidencia: docs/evidence/TC-__-captura.png (o log anonimizado)
Defecto asociado (si aplica):
Observaciones:
```

**Criterio de evidencia:** capturas sin datos reales, sin contraseñas, sin URLs privadas ni identificadores sensibles; para API, conservar solicitud/respuesta anonimizadas.

## 9. Matriz de trazabilidad resumida

| Requisito | Casos |
|---|---|
| Acceso autenticado y roles | TC-01–TC-05, TC-20, API-01–API-05 |
| Generaciones por programa | TC-06–TC-11 |
| Créditos y compras globales | TC-08, TC-12, TC-13 |
| Reportes individuales | TC-14, TC-15 |
| Persistencia y conexión | TC-16–TC-18 |
| Actualización de PWA | TC-19 |

## 10. Próximos pasos de QA

1. Ejecutar TC-07 y TC-08 en copia de pruebas para validar aislamiento y saldo global.
2. Registrar resultados y capturas de los casos P0/P1.
3. Ejecutar colección Postman en un entorno de prueba con credenciales no productivas.
4. Documentar defectos con pasos, severidad, esperado/actual y evidencia.
5. Ejecutar regresión tras cada cambio y actualizar este documento con resultados reales.

---

**Nota:** este repositorio muestra un proyecto propio desarrollado y sometido a verificaciones manuales iterativas. El plan distingue explícitamente verificaciones observadas, pruebas aún no ejecutadas formalmente y oportunidades de automatización.
