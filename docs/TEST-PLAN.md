# Plan de pruebas sugerido

| ID | Escenario | Resultado esperado |
|---|---|---|
| TC-01 | Cargar login | Se muestran programas activos |
| TC-02 | Acceso con contraseña incorrecta | Se rechaza el acceso |
| TC-03 | Crear programa sin contraseña admin | Se impide la creación |
| TC-04 | Crear programa con admin | Aparece en el selector y en la hoja Programas |
| TC-05 | Registrar generación en programa A | No aparece en el historial del programa B |
| TC-06 | Consumir créditos en programa A | Disminuye el saldo global visible en A y B |
| TC-07 | Generar reporte por programa | Solo muestra las generaciones del programa seleccionado |
| TC-08 | Fecha futura en generación | Se bloquea el registro |
| TC-09 | Créditos cero o negativos | Se rechaza el registro |
| TC-10 | Modo sin conexión | Se impiden nuevas escrituras |
| TC-11 | Compras en MXN y USD | Se conservan las monedas separadas |
| TC-12 | Actualizar PWA instalada | Se carga la nueva versión tras actualización de caché |

**Estado:** casos propuestos; no deben presentarse como ejecutados sin evidencia y resultados registrados.
