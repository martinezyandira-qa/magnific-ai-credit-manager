# Seguridad y privacidad

- La URL original de Apps Script fue reemplazada por un marcador de configuración.
- No se incluyen contraseñas, datos de Google Sheets ni la asociación del proyecto Firebase (`.firebaserc`).
- `Code.gs` no se incluyó en el ZIP original; revisar antes de publicarlo.
- La autenticación actual depende de contraseñas compartidas. No es un sistema multiusuario de aislamiento fuerte.
- No conectar esta copia pública a la instancia real de producción.
- No subir capturas con información confidencial, contraseñas ni datos privados de producciones.

- `backend/Code.gs` no contiene los valores de `USER_PASSWORD` ni `ADMIN_PASSWORD`; deben configurarse en Script Properties.
- La autenticación mediante parámetros GET puede exponer contraseñas en historiales y registros. No se recomienda para un despliegue público.
- El rol `user` puede guardar `credit-entries`, `credit-purchases` y `settings`; solo `programs` requiere administrador en el endpoint `save`.
- La API devuelve los registros de todos los programas al cliente autenticado; la separación visual no constituye aislamiento de seguridad entre programas.
