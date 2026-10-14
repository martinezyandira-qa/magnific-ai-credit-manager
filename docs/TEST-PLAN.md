# Plan de pruebas y evidencias QA — Magnific AI Credit Manager

**Proyecto:** Magnific Control de Créditos · **Versión:** PWA multiprograma\
**Responsable:** Yandira Martínez Jaimes · **Tipo:** Proyecto personal (desarrollo + QA)\
**Estado del documento:** Plan de pruebas con resultados parciales basados en verificaciones reportadas.\
**Fecha de actualización:** 2026-10-14

> **Transparencia de evidencia:** Las pruebas que se indican como *observadas* corresponden a verificaciones manuales comunicadas durante el desarrollo, no a una ejecución formal con capturas, logs y acta de pruebas. Los demás casos permanecen **pendientes**. No se atribuyen ejecuciones de Postman, automatización o métricas de cobertura que no estén documentadas.

## 1. Objetivo

Evaluar el comportamiento funcional y la integridad de datos de una PWA que registra generaciones y compras de créditos de Magnific AI, con múltiples programas independientes que comparten un saldo global. Documentar escenarios positivos, negativos, límites, integración frontend–Apps Script–Google Sheets, regresión y actualización de la PWA.

## 2. Alcance

**Incluido:** autenticación con contraseñas fijas, selector de programas, control de acceso por roles en interfaz y API, creación administrativa de programas, validaciones, registro de generaciones, operaciones administrativas sobre registros, compras USD/MXN exclusivas del administrador, cálculo de saldo global, separación por programa, reportes, sincronización, modo sin conexión y actualización de PWA.

**Fuera de alcance por ahora:** pruebas de carga a gran escala, pentesting formal, automatización E2E, compatibilidad exhaustiva entre navegadores, publicación en tiendas, acceso multiusuario empresarial.

## 3. Entorno y datos de prueba

| **Elemento** | **Configuración / criterio**                                                                  |
| ------------ | --------------------------------------------------------------------------------------------- |
| Frontend     | HTML, CSS y JavaScript; PWA en Firebase Hosting                                               |
| Backend      | Google Apps Script (`doGet`, `doPost`)                                                        |
| Persistencia | Google Sheets: `Generaciones`, `Compras`, `Programas`, `Configuracion`, `Data`, `Audit`       |
| Navegadores  | Chrome en Windows y navegador en macOS; registrar versión exacta al ejecutar                  |
| Roles        | `user` y `admin`; usar credenciales de prueba, nunca incluirlas en el repositorio             |
| Programa A   | `El Corral VIP` (datos existentes)                                                            |
| Programa B   | Programa de prueba creado desde el login; registrar ID real                                   |
| Precaución   | Ejecutar escrituras sobre una copia de pruebas de la hoja y del despliegue cuando sea posible |

**Datos de ejemplo sugeridos:** episodio `1`, fecha local de hoy, `125` créditos, descripción `QA - prueba de integración`; compra ficticia `1000` créditos, costo `20.50`, moneda `USD`. No introducir compras ficticias en el entorno productivo.

## 4. Criterios de entrada y salida

**Entrada:** respaldo reciente de Google Sheets; URL de pruebas funcional; programas A y B existentes; usuario y administrador de pruebas; conectividad disponible; valores iniciales de saldo registrados.

**Salida:** casos prioritarios ejecutados con evidencia; defectos críticos/altos corregidos o aceptados explícitamente; verificación de regresión; diferencias de saldo reconciliadas con registros de Sheets.

**Prioridad:** P0 = seguridad/integridad de datos; P1 = flujo principal; P2 = interfaz/compatibilidad.

## 5. Casos de prueba

Cada caso incluye pasos reproducibles. El campo **Estado** describe evidencia disponible al preparar este documento, no una afirmación de ejecución exhaustiva.

### Acceso y administración de programas

**TC-01 · P1 · Mostrar programas activos en login**\
**Precondición:** hoja `Programas` con al menos un programa activo.\
**Pasos:** 1) Abrir la PWA en ventana nueva. 2) Esperar carga del selector. 3) Abrir desplegable.\
**Esperado:** lista nombres de programas activos, sin mostrar saldos ni registros antes de autenticar.\
**Estado:** **Observado manualmente**: apareció `El Corral VIP` en el selector. **Evidencia:** pendiente de adjuntar.

**TC-02 · P0 · Rechazar contraseña incorrecta**\
**Pasos:** 1) Seleccionar programa. 2) Escribir contraseña inválida. 3) Pulsar Entrar.\
**Esperado:** acceso rechazado; no se muestra el contenido de producción.\
**Estado:** Pendiente.

**TC-03 · P0 · Impedir creación sin rol administrador**\
**Pasos:** 1) Pulsar `＋ Añadir programa`. 2) Introducir contraseña de usuario normal o inválida. 3) Intentar continuar.\
**Esperado:** formulario de creación no habilitado; no se agrega fila en `Programas`.\
**Estado:** Pendiente.

**TC-04 · P1 · Crear programa con administrador**\
**Pasos:** 1) Pulsar `＋ Añadir programa`. 2) Validar contraseña admin. 3) Completar nombre, descripción opcional y meta `10`. 4) Crear. 5) Revisar selector y hoja `Programas`.\
**Esperado:** programa activo, ID único y meta `10`; aparece en selector sin alterar programa A.\
**Estado:** **Observado manualmente**: creación desde login confirmada por la usuaria. **Evidencia en hoja:** pendiente.

**TC-05 · P1 · Validar campos al crear programa**\
**Pasos:** probar nombre vacío; meta vacía, `0`, `-1`, `1.5`; nombre duplicado.\
**Esperado:** mensajes de validación; no se guarda programa inválido o duplicado.\
**Estado:** Pendiente.

### Generaciones y separación de programas

**TC-06 · P0 · Registrar generación en programa A**\
**Pasos:** 1) Entrar a A. 2) Registrar episodio `1`, fecha actual, `125` créditos y descripción de prueba. 3) Revisar historial y `Generaciones`.\
**Esperado:** registro con `ProgramaID` de A, datos íntegros y un único ID.\
**Estado:** Pendiente de ejecución documentada.

**TC-07 · P0 · Aislamiento de generaciones entre A y B**\
**Pasos:** 1) Crear generación de prueba en B. 2) Cambiar a A con nueva autenticación. 3) Revisar listado y reportes. 4) Volver a B.\
**Esperado:** generación visible solo en B; no modifica el historial de A.\
**Estado:** Pendiente; esta verificación fue identificada como siguiente prueba tras la actualización multiprograma.

**TC-08 · P0 · Descuento de saldo global**\
**Pasos:** 1) Anotar saldo global en A y B. 2) Registrar generación usada de `125` créditos en B. 3) Sincronizar ambos.\
**Esperado:** saldo global disminuye `125` en ambos; el contador de consumo específico aumenta solo en B.\
**Estado:** Pendiente.

**TC-09 · P1 · Fecha futura no permitida**\
**Pasos:** intentar registrar generación con fecha de mañana.\
**Esperado:** se bloquea y muestra validación.\
**Estado:** Pendiente de evidencia formal; existe validación implementada en el frontend.

**TC-10 · P1 · Valores límite de episodio y créditos**\
**Datos:** episodio vacío, `0`, `1`, `999`, `1000`, caracteres; créditos vacío, `0`, `-5`, `1`, `1.5`.\
**Esperado:** episodio con 1–3 dígitos; créditos enteros positivos; errores señalados sin guardar. **Nota:** confirmar comportamiento de episodio `0` y ceros iniciales según regla de negocio acordada.\
**Estado:** Pendiente.

**TC-11 · P1 · Archivar y recuperar generación**\
**Pasos:** crear generación de prueba, archivarla, comprobar historial, recuperarla.\
**Esperado:** si la acción de archivar/recuperar está disponible, solo el administrador puede ejecutarla; cambia `Archivada`/`FechaArchivo` y conserva episodio, créditos, descripción y programa. Confirmar las acciones exactas disponibles antes de ejecutar.\
**Estado:** Pendiente.

### Compras, cálculos y reportes

**TC-12 · P0 · Compras globales y monedas separadas**\
**Pasos:** autenticar como administrador y registrar compras de prueba en USD y MXN en entorno aislado; revisar lista, Sheets y reporte. Repetir como usuario normal para comprobar denegación.\
**Esperado:** solo el administrador registra o modifica compras; ambas compras son globales; los costos conservan su moneda sin conversión automática. El intento de usuario normal no modifica datos ni saldo.\
**Estado:** Pendiente de evidencia formal.

**TC-13 · P0 · Integridad del cálculo de saldo**\
**Datos:** total comprado = `C`; créditos iniciales ya usados = `I`; generaciones marcadas como usadas = `G`.\
**Esperado:** saldo = `C − I − G` según configuración vigente; generaciones archivadas siguen contando si permanecen usadas. Revisar que compras históricas e `initialUsed` no dupliquen consumo.\
**Estado:** Pendiente.

**TC-14 · P1 · Reporte agrupado por episodio**\
**Pasos:** crear dos generaciones en episodio `101` y una en `102`; generar reporte total del programa.\
**Esperado:** agrupación por episodio, detalle cronológico, subtotales y total; costos USD/MXN sin mezcla.\
**Estado:** **Observado manualmente**: agrupación de reporte confirmada durante el desarrollo. **Evidencia:** pendiente.

**TC-15 · P0 · Reporte aislado por programa**\
**Pasos:** registrar episodios diferentes en A y B; descargar o visualizar reporte de A.\
**Esperado:** ninguna generación ni nombre de B aparece en el reporte de A; el saldo global puede figurar identificado como compartido.\
**Estado:** Pendiente.

### Integración, conexión y PWA

**TC-16 · P0 · Persistencia Apps Script–Google Sheets**\
**Pasos:** guardar un registro de prueba; comprobar fila en Sheets; cerrar sesión y volver a abrir.\
**Esperado:** dato persistente y consistente en ambos lados; no duplicación.\
**Estado:** Pendiente de evidencia formal.

**TC-17 · P1 · Escritura bloqueada sin conexión**\
**Pasos:** iniciar con datos cargados, desconectar red e intentar guardar una generación; repetir con compra únicamente en sesión de administrador y entorno aislado.\
**Esperado:** aviso de desconexión y bloqueo de escrituras; ningún cambio silencioso en Sheets.\
**Estado:** Pendiente.

**TC-18 · P1 · Sincronización tras reconexión**\
**Pasos:** desconectar, reconectar, activar sincronización y revisar datos.\
**Esperado:** recupera conexión y muestra registros vigentes sin duplicaciones.\
**Estado:** Pendiente.

**TC-19 · P1 · Actualización de PWA instalada**\
**Pasos:** publicar nueva versión; abrir web en navegador y PWA instalada; comparar; actualizar Service Worker/caché cuando sea necesario.\
**Esperado:** PWA instalada termina mostrando versión actual.\
**Estado:** **Observado manualmente**: Mac actualizada, Windows mostró versión anterior en PWA; tras limpiar registro/caché del Service Worker, se actualizó. **Incidencia:** ver sección 7.

**TC-20 · P0 · Permisos de API sobre programas**\
**Pasos:** con credencial de usuario normal, intentar POST `save` con `key=programs`; repetir con administrador en entorno de prueba.\
**Esperado:** usuario recibe `admin_required`; administrador puede guardar un conjunto válido.\
**Estado:** Pendiente. La documentación del backend indica esta restricción para programas, pero eso no sustituye la prueba de ejecución.

## 6. Pruebas de API propuestas

El backend usa un endpoint Apps Script con acciones por GET/POST. Estos escenarios se pueden ejecutar manualmente con Postman, sin publicar URLs privadas ni contraseñas.

| **API-ID** | **Método / acción**                  | **Escenario**         | **Esperado**                 | **Estado** |
| ---------- | ------------------------------------ | --------------------- | ---------------------------- | ---------- |
| API-01     | GET `action=public-programs`         | Sin autenticación     | Lista de `{id,name}` activos | Pendiente  |
| API-02     | GET `action=login`                   | Contraseña incorrecta | `authorized:false`           | Pendiente  |
| API-03     | GET `key=credit-entries`             | Credencial válida     | Array de generaciones        | Pendiente  |
| API-04     | GET `key=programs`                   | Credencial válida     | Array de programas           | Pendiente  |
| API-05     | POST `action=save`, `key=programs`   | Rol user              | `admin_required`             | Pendiente  |
| API-06     | POST `action=save`, `key=programs`   | Meta inválida         | Error de validación          | Pendiente  |
| API-07     | POST `action=save`                   | JSON mal formado      | `invalid_json`               | Pendiente  |
| API-08     | POST `action=delete`, `key=programs` | Rol admin             | `program_delete_not_allowed` | Pendiente  |

**Observación de seguridad:** actualmente la contraseña se envía como parámetro GET para ciertas acciones y el backend permite guardar arreglos completos. Se recomienda reforzar autenticación, validación y control de concurrencia antes de abrir la aplicación a usuarios externos.

## 7. Registro de incidencias conocidas

| **ID** | **Hallazgo**                                                                    | **Impacto**                                           | **Acción realizada**                                           | **Estado**                                             |
| ------ | ------------------------------------------------------------------------------- | ----------------------------------------------------- | -------------------------------------------------------------- | ------------------------------------------------------ |
| BUG-01 | PWA instalada en Windows conservó interfaz antigua tras desplegar nueva versión | Versión inconsistente entre navegador y app instalada | Desregistrar Service Worker, limpiar datos del sitio y reabrir | Resuelto manualmente; prevención automática pendiente  |
| BUG-02 | Error de sintaxis en versión anterior impidió completar login en hosting        | Bloqueo de flujo principal                            | Corrección del frontend y nuevo despliegue                     | Corrección reportada; evidencia de regresión pendiente |
| BUG-03 | Diferencia de fecha por uso de UTC/caché en versión anterior                    | Fecha incorrecta en formulario                        | Ajuste de fecha local y estrategia de caché                    | Corrección reportada; evidencia de regresión pendiente |

Estos registros resumen incidencias tratadas durante el desarrollo; no equivalen a tickets formales de Jira.

## 8. Plantilla para evidencias de ejecución

Duplicar esta ficha para cada prueba realizada:

```
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

| **Requisito**               | **Casos**                         |
| --------------------------- | --------------------------------- |
| Acceso autenticado y roles  | TC-01–TC-05, TC-20, API-01–API-05 |
| Generaciones por programa   | TC-06–TC-11                       |
| Créditos y compras globales | TC-08, TC-12, TC-13               |
| Reportes individuales       | TC-14, TC-15                      |
| Persistencia y conexión     | TC-16–TC-18                       |
| Actualización de PWA        | TC-19                             |

## 10. Actualización de reglas de negocio y estrategia de diseño (2026-10-14)

### 10.1 Reglas confirmadas por la responsable del producto

- **Autenticación:** existen contraseñas fijas preconfiguradas para `user` y `admin`. No hay función para crear, cambiar o restablecer contraseñas desde la aplicación; únicamente el desarrollador puede modificarlas mediante configuración técnica. **No existe una regla de negocio confirmada de longitud mínima o máxima de contraseña.**
- **Usuario normal:** puede iniciar sesión, registrar generaciones, consultar información necesaria para su operación y consultar/generar reportes. No debe administrar programas, compras, configuración ni realizar acciones de mantenimiento sobre registros.
- **Administrador:** además de registrar generaciones y consultar reportes, puede administrar programas, compras y configuración, conforme a las operaciones efectivamente disponibles.
- **Créditos agotados:** se permite registrar generaciones aunque el saldo esté agotado; debe existir una advertencia visible en el panel principal. **No se exige un mensaje adicional al pulsar Guardar.** La visualización de saldo en cero no demuestra por sí sola que el cálculo interno no conserve un excedente de consumo.
- **Saldo:** las compras y el saldo disponible son globales; el consumo y los reportes de generaciones se desglosan por programa/episodio.

### 10.2 Matriz de permisos esperados

| Operación | Usuario normal | Administrador | Observaciones |
| --- | --- | --- | --- |
| Iniciar sesión con credencial fija | Permitido | Permitido | Rol según credencial |
| Registrar generación | Permitido | Permitido | Incluso sin saldo, con advertencia en panel |
| Consultar saldo, historial y reportes propios del programa | Permitido | Permitido | Respetar separación por programa |
| Crear/administrar programas | Denegado | Permitido | Verificar frontend y API |
| Crear/modificar compras | Denegado | Permitido | Verificar frontend y API |
| Modificar configuración global | Denegado | Permitido | Verificar frontend y API |
| Archivar/recuperar/eliminar registros | Denegado | Permitido, si la función existe | Confirmar acciones disponibles |
| Cambiar contraseña desde la PWA | No disponible | No disponible | Solo desarrollador, fuera de interfaz |

### 10.3 Técnicas y datos de prueba

Se diseñarán casos **positivos**, **negativos** y **de valores límite** donde exista una frontera comprobable. Se utilizarán particiones de equivalencia (EP), análisis de valores límite (BVA) y tablas de decisión para roles/operaciones. No se inventarán restricciones de longitud de contraseña. Para autenticación se probarán credenciales correctas/incorrectas, campo vacío y alteración de un carácter; para campos numéricos se confirmarán primero los rangos y reglas efectivas. Los datos de prueba deben quedar identificados en la hoja de casos y no contener secretos.

### 10.4 Riesgo prioritario de autorización — RISK-001

La documentación técnica revisada indica que ciertas operaciones `save` de compras (`credit-purchases`) y configuración (`settings`) podrían estar disponibles para `user` en el backend, mientras que las reglas de negocio actuales las reservan al administrador. **Esto es un riesgo pendiente de verificación, no un defecto confirmado.** Las pruebas de escritura de API deben ejecutarse en un despliegue y hoja de cálculo de pruebas, comprobando tanto la respuesta como la ausencia de cambios persistidos y en el saldo.

## 11. Casos complementarios propuestos (pendientes de ejecución)

Los TC-01 a TC-20 y API-01 a API-08 se conservan como línea base histórica. Los casos siguientes amplían la cobertura y no representan resultados ejecutados. La versión operativa y sus pasos detallados se registrarán en `QA-Testing/test-cases/Magnific_QA_Testing.xlsx`.

| ID | Prioridad | Tipo / técnica | Escenario | Resultado esperado | Estado |
| --- | --- | --- | --- | --- | --- |
| TC-21 | P0 | Positiva | Login con contraseña fija de usuario | Accede con rol `user` y permisos limitados | NOT RUN |
| TC-22 | P0 | Positiva | Login con contraseña fija de administrador | Accede con rol `admin` y permisos administrativos | NOT RUN |
| TC-23 | P0 | Negativa / EP | Contraseña vacía, incorrecta o alterada | Acceso rechazado sin exposición de datos | NOT RUN |
| TC-24 | P0 | Negativa / tabla de decisión | Usuario normal intenta crear/editar programa | Acción denegada; sin cambios en datos | NOT RUN |
| TC-25 | P0 | Negativa / tabla de decisión | Usuario normal intenta crear/modificar compra desde UI | Acción denegada; saldo y datos sin cambios | NOT RUN |
| TC-26 | P0 | Negativa / API | Usuario normal intenta guardar compras vía API | Backend rechaza operación; sin persistencia ni variación de saldo | NOT RUN |
| TC-27 | P0 | Negativa / API | Usuario normal intenta guardar configuración vía API | Backend rechaza operación; configuración intacta | NOT RUN |
| TC-28 | P0 | Positiva | Administrador guarda compra válida en entorno aislado | Compra persistida y saldo global recalculado | NOT RUN |
| TC-29 | P1 | Positiva / límite de saldo | Registrar generación con saldo agotado | Registro permitido y advertencia visible en panel | NOT RUN |
| TC-30 | P1 | Negativa | Usuario normal intenta modificar configuración o archivar registros | Acceso denegado; sin cambios, si dichas acciones existen | NOT RUN |
| TC-31 | P1 | Negativa | Intentar modificar contraseña desde interfaz como user/admin | No existe funcionalidad de cambio de contraseña | NOT RUN |
| TC-32 | P1 | BVA / EP | Probar fronteras reales de episodio y créditos (0, 1, máximos confirmados, decimales) | Aceptación/rechazo según restricciones verificadas y acordadas | NOT RUN |

**Casos API adicionales:**

| API-ID | Método / acción | Escenario | Esperado | Estado |
| --- | --- | --- | --- | --- |
| API-09 | POST `action=save`, `key=credit-purchases` | Rol `user`, entorno aislado | Rechazo por autorización; sin escritura | NOT RUN |
| API-10 | POST `action=save`, `key=settings` | Rol `user`, entorno aislado | Rechazo por autorización; sin escritura | NOT RUN |
| API-11 | POST `action=save`, `key=credit-purchases` | Rol `admin`, compra válida en entorno aislado | Operación autorizada y persistencia íntegra | NOT RUN |
| API-12 | POST `action=save`, `key=programs` | Rol `user` | Rechazo; no altera programas | NOT RUN |

### 11.1 Criterios para reportar defectos

Un resultado `FAIL` debe sustentarse en pasos reproducibles, resultado esperado, resultado real, evidencia y versión/entorno. Los casos no ejecutados permanecen `NOT RUN`. Las incidencias históricas BUG-01 a BUG-03 se mantienen como antecedentes del desarrollo, sin contabilizarlas como defectos nuevos del ciclo formal. La advertencia de saldo agotado observada en el panel **no se reportará como fallo por ausencia de aviso durante el guardado**.

### 11.2 Trazabilidad adicional

| Regla / requisito | Casos asociados |
| --- | --- |
| Contraseñas fijas y roles | TC-02, TC-21–TC-23, TC-31, API-02 |
| Gestión de programas solo admin | TC-03–TC-05, TC-20, TC-24, API-05, API-12 |
| Compras solo admin | TC-12, TC-25, TC-26, TC-28, API-09, API-11 |
| Configuración solo admin | TC-27, TC-30, API-10 |
| Registro permitido sin saldo y advertencia | TC-06, TC-08, TC-13, TC-29 |
| Límites de episodios y créditos | TC-05, TC-09, TC-10, TC-32 |

## 12. Próximos pasos de QA

1. Confirmar los permisos en interfaz y backend (TC-21 a TC-29) y ejecutar TC-07 y TC-08 en copia de pruebas para validar aislamiento y saldo global.
2. Registrar resultados y capturas de los casos P0/P1.
3. Ejecutar colección Postman en un entorno de prueba con credenciales no productivas.
4. Documentar defectos con pasos, severidad, esperado/actual y evidencia.
5. Ejecutar regresión tras cada cambio y actualizar este documento con resultados reales.

---

**Nota:** este repositorio muestra un proyecto propio desarrollado y sometido a verificaciones manuales iterativas. El plan distingue explícitamente verificaciones observadas, pruebas aún no ejecutadas formalmente y oportunidades de automatizaci

> **Control de consistencia documental:** verificar que `QA-Testing/REQUIREMENTS.md` refleje contraseñas fijas sin límites de longitud y permisos administrativos sobre compras/configuración. Si contiene reglas anteriores, actualizarlo antes de la ejecución formal.
