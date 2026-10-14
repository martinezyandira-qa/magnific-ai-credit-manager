# Magnific Control de Créditos — Plan de pruebas QA

**Proyecto:** Magnific Control de Créditos  
**Versión:** 1.0 — plan inicial  
**Fecha:** 14 de octubre de 2026  
**Responsable:** QA del proyecto  
**Aplicación:** https://ccia-magnific-control.web.app  
**Repositorio:** https://github.com/martinezyandira-qa/magnific-ai-credit-manager  
**Documento base:** [`QA-Testing/REQUIREMENTS.md`](REQUIREMENTS.md)  
**Estado:** Planificado; no implica ejecución ni resultados confirmados.

## 1. Objetivo

Verificar que Magnific permita registrar consumos y consultar reportes con integridad de datos, que el saldo global y sus advertencias sean coherentes, y que las operaciones administrativas estén protegidas tanto en la interfaz como en la API. Identificar defectos reproducibles y documentar evidencia antes de la entrega del proyecto QA.

## 2. Alcance

| Módulo | Requisitos | Aspectos principales |
|---|---|---|
| Autenticación | RF-001 | Acceso con contraseñas fijas, credenciales incorrectas, campo vacío, roles |
| Permisos | RF-002 | Acciones autorizadas por rol y rechazo en backend |
| Programas | RF-003 | Creación y gestión por administrador, validaciones |
| Generaciones | RF-004, RF-005 | Registro, datos inválidos, saldo agotado y advertencia |
| Compras | RF-006 | Acceso exclusivo de administrador, moneda y efectos sobre saldo |
| Saldos | RF-007 | Bolsa global, sumas, ausencia de duplicados |
| Reportes | RF-008 | Agrupación por programa y episodio, totales y monedas |
| Historial | RF-009 | Consulta, archivo/recuperación y permisos por confirmar |
| Persistencia | RF-010 | UI–API–Google Sheets, recarga y errores de comunicación |
| PWA/conectividad | RF-011 | Sin conexión, reconexión y actualización |

**Fuera del alcance inicial:** pruebas de carga a gran escala, auditoría de penetración formal y automatización end-to-end completa.

## 3. Enfoque y técnicas

- **Pruebas positivas:** operaciones permitidas con datos válidos.
- **Pruebas negativas:** credenciales incorrectas, campos inválidos, operaciones sin autorización, fallas de red.
- **Valores límite (BVA):** mínimo, máximo y valores adyacentes, solo cuando los límites reales de cada campo estén verificados. Para login se prueba el campo vacío; no existe política funcional de longitud de contraseña.
- **Partición de equivalencia (EP):** clases de entradas válidas e inválidas para episodios, créditos, fechas, descripciones y compras, según reglas verificadas.
- **Tablas de decisión:** rol (administrador/usuario), operación (lectura/registro/administración), canal (interfaz/API) y resultado esperado.
- **Integración:** comprobar consistencia entre interfaz, Apps Script y Google Sheets.
- **Regresión:** repetir casos críticos tras correcciones o cambios de versión.

Los casos se registrarán en `QA-Testing/test-cases/Magnific_QA_Testing.xlsx`, con **dos hojas: `Casos de prueba` y `Checklist`**. Cada caso tendrá identificador, requisito relacionado, tipo/técnica, prioridad, precondiciones, datos, pasos, resultado esperado, resultado real, estado y evidencia.

## 4. Entorno y datos de prueba

**Entorno conocido:** PWA web con frontend HTML/CSS/JavaScript, Firebase Hosting, backend Google Apps Script y persistencia en Google Sheets.

**Por registrar antes de ejecutar:** navegador y versión, sistema operativo, dispositivo, URL/versión probada, fecha, rol y conjunto de datos de prueba. No se presuponen dispositivos ni navegadores ya evaluados.

**Datos:** usar programas y generaciones de prueba identificables; registrar el estado inicial y final de los saldos. No incluir contraseñas, tokens ni datos sensibles en capturas, reportes o GitHub. Las pruebas de escritura directa a API, compras, configuración, eliminación y otros cambios irreversibles se harán **solo en un entorno aislado** con datos ficticios y autorización para usarlo.

## 5. Estrategia de ejecución

1. **Analizar requisitos:** revisar `REQUIREMENTS.md`, la interfaz y documentación técnica; aclarar reglas y límites pendientes.
2. **Diseñar pruebas:** preparar casos positivos, negativos y BVA/EP donde apliquen; vincular cada caso con un RF y criterio de aceptación.
3. **Preparar entorno:** identificar versión, navegador, cuentas de rol, datos de prueba y estado inicial.
4. **Ejecutar y evidenciar:** registrar resultados reales; adjuntar capturas o evidencias sin secretos.
5. **Reportar y verificar defectos:** crear incidencias reproducibles, priorizar y ejecutar retest/regresión cuando exista corrección.
6. **Cerrar:** resumir casos ejecutados, estados, defectos, cobertura por requisito y riesgos pendientes.

## 6. Prioridades basadas en riesgo

| Prioridad | Riesgo | Pruebas asociadas |
|---|---|---|
| Alta | Usuario normal podría modificar compras o configuración desde API | Autorización por rol en UI y backend; integridad tras rechazo |
| Alta | Saldos o consumos globales incorrectos | Registros entre programas, compras, duplicados y reportes |
| Alta | Pérdida o duplicación de datos | Persistencia, reconexión y errores de red |
| Media | Reportes incorrectos por programa o episodio | Filtros, agrupación y subtotales |
| Media | Advertencia de saldo agotado inconsistente | Registro permitido y aviso visible en panel |
| Media | Caché PWA muestra versión obsoleta | Actualización y regresión |

**Importante:** la documentación técnica indica una posible discrepancia de autorización para `credit-purchases` y `settings`; **no se declara bug confirmado** hasta ejecutar y documentar una prueba controlada.

## 7. Criterios de entrada

- Requisitos y criterios de aceptación disponibles para el módulo.
- Ambiente accesible y versión identificada.
- Datos de prueba preparados y posibilidad de restaurarlos.
- Permisos de prueba definidos; entorno aislado para operaciones sensibles.
- Formato de evidencia y seguimiento disponible.

## 8. Criterios de salida

- Casos planificados ejecutados o justificados como `BLOCKED`/`NOT RUN`.
- Resultados reales y evidencias registrados para casos ejecutados.
- Defectos detectados documentados con severidad, pasos y evidencia.
- Retests efectuados cuando se entregue una corrección.
- Riesgos abiertos, cobertura y limitaciones comunicados en el informe final.

No se fija una tasa mínima de aprobación o cobertura sin acuerdo previo. **El cierre del proyecto no equivale a certificar ausencia de defectos.**

## 9. Estados y seguimiento

- `NOT RUN`: diseñado, pendiente de ejecución.
- `PASS`: resultado observado coincide con el esperado.
- `FAIL`: resultado observado difiere del esperado; evaluar reporte de bug.
- `BLOCKED`: no se puede ejecutar por dependencia o problema de entorno.
- `N/A`: caso no aplicable a la versión/alcance evaluado, con justificación.

Cada bug se registrará en `QA-Testing/bug-reports/` con ID, título, entorno, precondiciones, pasos, esperado, real, severidad, evidencia y estado. Las capturas se guardarán en `QA-Testing/evidence/` sin información sensible.

## 10. Métricas para el informe final

Se calcularán **únicamente después de la ejecución**:

- Total de casos diseñados, ejecutados, PASS, FAIL, BLOCKED y NOT RUN.
- Porcentaje de ejecución = ejecutados / casos aplicables × 100.
- Porcentaje de aprobación = PASS / (PASS + FAIL) × 100, si el denominador es mayor que cero.
- Requisitos con al menos un caso diseñado y requisitos efectivamente verificados.
- Defectos por severidad, estado y módulo.
- Riesgos pendientes y limitaciones del entorno.

## 11. Entregables

```text
QA-Testing/
├── README.md
├── REQUIREMENTS.md
├── TEST-PLAN.md
├── test-cases/
│   └── Magnific_QA_Testing.xlsx
├── bug-reports/
└── evidence/
```

Las carpetas de bugs y evidencias se completarán a medida que existan resultados reales; no se crearán incidencias ficticias.

## 12. Pendientes antes de diseñar límites exactos

1. Confirmar validaciones de créditos, episodios, fechas, descripciones y compras.
2. Precisar qué acciones de archivo, recuperación y eliminación puede realizar cada rol.
3. Verificar fórmula del saldo y tratamiento de registros archivados.
4. Confirmar formatos y filtros de reportes disponibles.
5. Definir un ambiente aislado para pruebas de API administrativas.

## 13. Referencias

- [Especificación QA](REQUIREMENTS.md)
- [README de Magnific](https://github.com/martinezyandira-qa/magnific-ai-credit-manager/blob/main/README.md)
- [Plan técnico existente](https://github.com/martinezyandira-qa/magnific-ai-credit-manager/blob/main/docs/TEST-PLAN.md)
- [Seguridad documentada](https://github.com/martinezyandira-qa/magnific-ai-credit-manager/blob/main/docs/SECURITY.md)

---

**Control de cambios:** v1.0 — 2026-10-14 — Plan inicial basado en los requisitos documentados; ejecución pendiente.
