# Magnific Control de Créditos — Especificación de requisitos para QA

**Proyecto:** Magnific Control de Créditos  
**Especialidad:** Quality Assurance (QA)  
**Versión del documento:** 1.0 — borrador para validación  
**Fecha:** 14 de octubre de 2026  
**Aplicación:** https://ccia-magnific-control.web.app  
**Repositorio:** https://github.com/martinezyandira-qa/magnific-ai-credit-manager  
**Estado:** Requisitos de negocio confirmados por la responsable del proyecto; detalles técnicos sujetos a verificación.

## 1. Objetivo

Documentar el comportamiento esperado de Magnific Control de Créditos para diseñar, ejecutar y evaluar pruebas funcionales, negativas, de valores límite, integración, autorización y regresión. Este documento constituye la referencia de los criterios de aceptación; no representa resultados de ejecución.

## 2. Descripción y alcance

Magnific es una aplicación web progresiva (PWA) para controlar compras y consumos de créditos de inteligencia artificial en producciones audiovisuales. Las generaciones se asocian a programas y episodios; los créditos comprados conforman una bolsa global compartida. La aplicación ofrece reportes por programa y episodio.

**Dentro del alcance QA:** autenticación, roles y permisos, programas, registro de generaciones, compras, saldo global, reportes, validaciones, persistencia, conectividad y PWA.

**Fuera del alcance inicial:** pruebas de carga a gran escala, pentesting formal y automatización end-to-end completa.

## 3. Fuentes y clasificación

- **Confirmado por responsable:** reglas de negocio comunicadas durante el análisis del proyecto.
- **Documentado en repositorio:** comportamiento descrito en `README.md`, `docs/TEST-PLAN.md` y `docs/SECURITY.md`; debe contrastarse con la versión publicada.
- **Por validar:** detalle funcional, límites exactos o comportamiento que aún no ha sido confirmado.

## 4. Reglas de negocio

| ID | Regla | Fuente / estado |
|---|---|---|
| RN-01 | Existen dos roles de acceso: administrador y usuario normal. | Confirmado |
| RN-02 | El usuario normal puede registrar generaciones y consultar/generar reportes, además de visualizar la información necesaria para esas operaciones. | Confirmado |
| RN-03 | Las demás funciones administrativas, incluidas compras, configuración y gestión de programas, son exclusivas del administrador. | Confirmado |
| RN-04 | Las contraseñas de acceso son fijas y preconfiguradas. Ningún usuario, incluido el administrador, puede cambiarlas desde la aplicación; solo el desarrollador puede modificarlas en la configuración técnica. | Confirmado |
| RN-05 | Todos los programas comparten una bolsa global de créditos; los registros de generaciones se asocian al programa y episodio correspondientes. | Confirmado / documentado |
| RN-06 | Se permite registrar generaciones aunque no queden créditos disponibles, siempre que se muestre una advertencia visible sobre el saldo agotado o insuficiente. | Confirmado |
| RN-07 | La aplicación dispone de reportes de consumo por programa y episodio. | Confirmado |
| RN-08 | Las compras pueden registrarse en MXN o USD sin conversión automática entre monedas. | Documentado en repositorio |
| RN-09 | El sistema permite archivar y recuperar generaciones. La autorización específica de estas acciones debe verificarse conforme a RN-02 y RN-03. | Función documentada; permisos por validar |

## 5. Requisitos funcionales y criterios de aceptación

### RF-001 — Autenticación

**Descripción:** el sistema permite ingresar mediante contraseñas preconfiguradas para cada rol.

- **CA-001.1:** la contraseña válida de administrador permite acceder con rol administrador.
- **CA-001.2:** la contraseña válida de usuario permite acceder con rol usuario.
- **CA-001.3:** una contraseña incorrecta o un campo vacío no concede acceso.
- **CA-001.4:** no existe una función de cambio de contraseña disponible para usuarios o administradores en la interfaz.
- **CA-001.5:** el sistema aplica los permisos correspondientes al rol autenticado.

**Diseño de pruebas:** positivas (ambos roles), negativas (incorrecta, vacía, alterada), límite aplicable (0 caracteres). **No se establece** longitud mínima o máxima de contraseña, porque no existe una política funcional definida.

### RF-002 — Autorización por rol

**Descripción:** solo el administrador puede realizar operaciones administrativas. El control debe aplicarse tanto en la interfaz como en el backend.

- **CA-002.1:** el usuario normal puede registrar generaciones y consultar/generar reportes.
- **CA-002.2:** el usuario normal no puede crear o modificar programas, compras ni configuración global.
- **CA-002.3:** una solicitud directa a la API con permisos de usuario normal para una operación administrativa debe ser rechazada.
- **CA-002.4:** una solicitud rechazada no altera datos persistidos ni saldos.
- **CA-002.5:** el administrador puede acceder a las operaciones administrativas autorizadas.

**Nota de riesgo:** `docs/SECURITY.md` señala que el endpoint de guardado admite operaciones `credit-purchases` y `settings` con rol `user`. Esto es una **discrepancia técnica potencial**, no un defecto confirmado por ejecución. No realizar pruebas de escritura destructiva sobre datos reales.

### RF-003 — Gestión de programas

**Descripción:** el administrador puede crear y gestionar programas; el usuario normal no.

- **CA-003.1:** el administrador puede crear un programa con datos válidos.
- **CA-003.2:** el programa creado aparece en el selector correspondiente y conserva su identificador.
- **CA-003.3:** los intentos de creación por un usuario normal son rechazados.
- **CA-003.4:** no se guardan programas con datos inválidos, conforme a las validaciones implementadas y aprobadas.

**Por validar:** campos obligatorios, reglas de duplicados, límites de nombre y meta, y operaciones de edición/desactivación disponibles.

### RF-004 — Registro de generaciones

**Descripción:** un usuario autenticado puede registrar consumos de créditos asociados a un programa y episodio.

- **CA-004.1:** una generación válida se guarda con programa, episodio, fecha, créditos y descripción según el formulario vigente.
- **CA-004.2:** el registro aparece en el historial del programa correspondiente.
- **CA-004.3:** los datos persistidos coinciden con los ingresados.
- **CA-004.4:** los campos inválidos se rechazan conforme a las reglas de validación verificadas.

**Por validar:** obligatoriedad y límites exactos de episodio, fecha, créditos y descripción; tratamiento de decimales y fechas futuras.

### RF-005 — Registro con saldo insuficiente

**Descripción:** el registro de generaciones sigue permitido con saldo global cero o insuficiente, pero el usuario debe ser informado.

- **CA-005.1:** con saldo igual a cero o insuficiente, se muestra una advertencia visible de falta de créditos.
- **CA-005.2:** el sistema permite guardar una generación válida pese a la insuficiencia.
- **CA-005.3:** el consumo queda registrado y los totales se actualizan correctamente.
- **CA-005.4:** el sistema refleja correctamente el exceso de consumo, aunque el indicador de créditos restantes se presente como cero.

**Observación de análisis:** se observó una advertencia roja en el panel sobre el exceso de créditos. No se exige una segunda alerta al pulsar «Guardar» salvo que se acuerde explícitamente.

### RF-006 — Compras de créditos

**Descripción:** solo el administrador puede registrar y modificar compras.

- **CA-006.1:** el administrador puede registrar una compra válida.
- **CA-006.2:** el usuario normal no puede registrar ni modificar compras desde la interfaz o API.
- **CA-006.3:** una compra válida modifica el total global comprado según los créditos registrados.
- **CA-006.4:** los costos expresados en MXN y USD se conservan en su moneda original, sin conversión automática.
- **CA-006.5:** una operación rechazada no altera el saldo global.

**Por validar:** campos y límites de cantidad, costo, fecha, moneda y reglas de edición/eliminación.

### RF-007 — Saldo global y cálculos

**Descripción:** todos los programas utilizan un saldo global compartido.

- **CA-007.1:** registrar un consumo válido afecta el total global una sola vez.
- **CA-007.2:** los consumos de distintos programas se reflejan en el mismo saldo global.
- **CA-007.3:** las compras válidas incrementan el total de créditos adquiridos.
- **CA-007.4:** los totales son consistentes con el historial y la configuración de créditos iniciales, si aplica.
- **CA-007.5:** los reportes y contadores no duplican consumos históricos.

**Por validar:** fórmula exacta de saldo disponible, tratamiento de generaciones archivadas y visualización de saldo negativo.

### RF-008 — Reportes

**Descripción:** ambos roles pueden consultar/generar reportes por programa y episodio.

- **CA-008.1:** el usuario normal y el administrador pueden acceder a reportes.
- **CA-008.2:** un reporte por programa contiene únicamente las generaciones correspondientes a ese programa.
- **CA-008.3:** un reporte por episodio agrupa correctamente registros y subtotales.
- **CA-008.4:** los totales coinciden con los registros aplicables.
- **CA-008.5:** los importes de MXN y USD no se suman como si fueran una misma moneda.

**Por validar:** formatos de exportación, filtros disponibles y tratamiento de registros archivados.

### RF-009 — Historial, archivo y recuperación

**Descripción:** el sistema conserva y permite consultar el historial de generaciones; el repositorio documenta funciones de archivo y recuperación.

- **CA-009.1:** los registros se muestran en el historial del programa correcto.
- **CA-009.2:** archivar y recuperar no cambia indebidamente los datos originales.
- **CA-009.3:** las acciones administrativas sobre registros están restringidas según RN-02 y RN-03.

**Por validar:** si el usuario normal puede corregir sus propios registros y qué acciones concretas se consideran administrativas.

### RF-010 — Persistencia e integración

**Descripción:** la PWA intercambia información con Google Apps Script y persiste registros en Google Sheets.

- **CA-010.1:** un registro guardado permanece disponible tras recargar y volver a iniciar sesión.
- **CA-010.2:** una operación exitosa no genera duplicados inesperados.
- **CA-010.3:** los errores de comunicación se informan sin presentar falsamente la operación como guardada.
- **CA-010.4:** los datos persistidos conservan su programa, episodio y valores.

### RF-011 — Conectividad y PWA

**Descripción:** la aplicación debe manejar pérdida y recuperación de conexión y actualizarse de manera controlada.

- **CA-011.1:** cuando no existe conexión, el sistema no confirma escrituras que no llegaron al backend.
- **CA-011.2:** al recuperar conexión, los datos se sincronizan sin duplicaciones inesperadas.
- **CA-011.3:** la PWA instalada puede recibir las versiones publicadas sin conservar indefinidamente una interfaz obsoleta.

**Por validar:** comportamiento exacto del modo sin conexión y estrategia de actualización del Service Worker.

## 6. Requisitos no funcionales iniciales

| ID | Categoría | Requisito verificable | Estado |
|---|---|---|---|
| RNF-001 | Seguridad | El servidor valida permisos antes de aceptar modificaciones administrativas. | Confirmado como objetivo; requiere prueba |
| RNF-002 | Integridad | Una operación rechazada no debe modificar datos ni saldos. | Confirmado como objetivo; requiere prueba |
| RNF-003 | Usabilidad | Los errores y advertencias relevantes deben ser visibles y comprensibles. | Confirmado para saldo insuficiente; otros mensajes por validar |
| RNF-004 | Confiabilidad | Los registros guardados deben persistir y no duplicarse por recarga o reconexión. | Documentado; requiere prueba |
| RNF-005 | Compatibilidad | La PWA debe funcionar en los navegadores y equipos definidos para la ronda de QA. | Navegadores/versiones por definir |

No se fijan tiempos máximos de respuesta ni porcentajes de disponibilidad sin requisitos acordados o una línea base medible.

## 7. Matriz de permisos esperados

| Operación | Administrador | Usuario normal |
|---|:---:|:---:|
| Iniciar sesión | Sí | Sí |
| Consultar saldo y datos necesarios para su trabajo | Sí | Sí |
| Registrar generaciones | Sí | Sí |
| Consultar/generar reportes | Sí | Sí |
| Crear o administrar programas | Sí | No |
| Registrar o modificar compras | Sí | No |
| Modificar configuración global | Sí | No |
| Archivar, recuperar o eliminar registros | Sí | Pendiente de confirmar alcance exacto |
| Cambiar contraseñas desde la aplicación | No | No |

## 8. Estrategia de diseño de pruebas

- **Positivas:** operaciones permitidas con datos válidos.
- **Negativas:** credenciales incorrectas, entradas inválidas, permisos insuficientes y errores de conexión.
- **Valores límite (BVA):** límites numéricos y de longitud **solo después de confirmar los valores reales**; para login, campo vacío como frontera válida de prueba, sin inventar política de longitud.
- **Particiones de equivalencia (EP):** entradas válidas e inválidas por campo.
- **Tablas de decisión:** combinación de rol, operación y resultado autorizado/rechazado.
- **Integración:** coherencia entre interfaz, API y Google Sheets.
- **Regresión:** volver a ejecutar casos críticos después de cambios.

Los casos, checklist, ejecuciones y evidencias se documentarán por separado. No se atribuyen estados PASS/FAIL ni defectos confirmados en este documento.

## 9. Riesgos y puntos pendientes

1. **Autorización en API:** confirmar que `user` no pueda guardar compras ni configuración; usar una instancia de pruebas aislada para operaciones que modifiquen datos.
2. **Reglas de validación:** inspeccionar formularios y código para determinar límites exactos antes de crear casos BVA.
3. **Saldo agotado:** verificar que la advertencia del panel y el exceso de consumo sean coherentes con el cálculo.
4. **Acciones sobre registros:** precisar permisos de archivo, recuperación y eliminación.
5. **Pruebas en producción:** usar registros identificables y reversibles; anotar valores iniciales y comprobar restauración. No crear compras ficticias en datos reales.

## 10. Referencias

- [README del repositorio](https://github.com/martinezyandira-qa/magnific-ai-credit-manager/blob/main/README.md)
- [Plan de pruebas existente](https://github.com/martinezyandira-qa/magnific-ai-credit-manager/blob/main/docs/TEST-PLAN.md)
- [Seguridad y privacidad](https://github.com/martinezyandira-qa/magnific-ai-credit-manager/blob/main/docs/SECURITY.md)
- [Backend publicado](https://github.com/martinezyandira-qa/magnific-ai-credit-manager/blob/main/backend/Code.gs)

---

**Control de cambios**

| Versión | Fecha | Descripción |
|---|---|---|
| 1.0 | 2026-10-14 | Consolidación inicial de reglas confirmadas, criterios de aceptación, riesgos y puntos por validar. |
