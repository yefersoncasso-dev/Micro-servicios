# Microservicio de eventos ficha 06

Implementación de Persona 1: eventos se relaciona con ms-patrocinadores mediante HTTP. La carpeta conserva el nombre ms-eventos; RECURSO=eventos selecciona /eventos, eventos_db y eventos_user.

## Configuración local

- Eventos: http://127.0.0.1:3011.
- Patrocinadores: http://127.0.0.1:3012, configurado mediante PATROCINADORES_URL.
- Usuarios: http://127.0.0.1:3001.
- MySQL 8 local: 127.0.0.1:3307.
- Los tres servicios deben compartir JWT_SECRET. Los archivos .env no se publican.

Iniciar con npm ci y npm run dev desde esta carpeta, después de configurar la base con db/schema.sql. No reemplazar un .env existente por el de ejemplo. npm test ejecuta las pruebas aisladas de la relación y sus errores. La guía completa y la colección están en docs/.

## Contrato

Todos los endpoints requieren Authorization: Bearer <token>. GET admite cualquier rol; POST, PUT y DELETE requieren administrador. El login se realiza en ms-usuarios.

| Campo | Validación |
|---|---|
| id | Autogenerado; no se envía en POST o PUT |
| codigo | Texto obligatorio, máximo 64 caracteres, único |
| nombre | Texto obligatorio, máximo 160 caracteres |
| fecha | Fecha real AAAA-MM-DD |
| asistentes_esperados | Entero positivo |
| tipo | conferencia, taller o feria |
| patrocinador_id | Entero positivo obligatorio; debe existir en el proveedor |

| Petición | Respuesta |
|---|---|
| GET /eventos | 200, listado compuesto; admite ?tipo= y ?ids= |
| GET /eventos/:id | 200 compuesto; 400 por id inválido, 404 si no existe |
| POST /eventos | 201 compuesto y Location; 400, 409 o 503 según la validación |
| PUT /eventos/:id | 200 compuesto; 400, 404, 409 o 503 |
| DELETE /eventos/:id | 204 sin cuerpo; 400 o 404 |

POST y PUT reciben todos los campos. Un patrocinador inexistente produce 400; estado_contrato igual a vencido produce 409. Si el proveedor no responde en tres segundos, las escrituras devuelven 503 y no se persisten. Los códigos duplicados también devuelven 409. Un token ausente o inválido produce 401; un rol sin permiso produce 403.

Las respuestas compuestas incluyen patrocinador_id y patrocinador con exactamente id, empresa y sector. Un listado realiza una sola consulta /patrocinadores?ids= con identificadores únicos. Si no hay eventos, no se consulta al proveedor. Si el proveedor falla, GET conserva 200 y devuelve patrocinador: null junto con aviso en cada evento. Si una referencia dejó de existir, también se indica en aviso. Los errores 401 o 403 del proveedor se conservan. Una respuesta HTTP/JSON inválida se identifica como 502 en escrituras; en lecturas se informa mediante aviso.

## Implementación

Se conserva la arquitectura routes → controller → service → repository. El modelo valida los descriptores definidos en src/config/perfiles.js. El repositorio guarda patrocinador_id mediante consultas parametrizadas. src/clients/patrocinadores.client.js parte del cliente entregado con la ficha y completa obtener, validar y listar. El controlador reenvía la cabecera Authorization original; el servicio aplica la regla antes de escribir y compone las respuestas.

La tabla local fue recreada conservando los eventos previos y sus identificadores. El respaldo SQL anterior está en .runtime/backups. Las referencias iniciales son 1, 2 y 4; los registros previos adicionales sin referencia recibieron 1. La relación se valida por HTTP, sin claves foráneas entre bases de microservicios.

## Verificación

Ver docs/PRUEBAS_FICHA_06.md. Importar docs/ficha-06.postman_collection.json y un entorno de docs/. El entorno público deja la contraseña vacía; ficha-06.local.postman_environment.json contiene la configuración privada de este PC y está ignorado por Git. Ejecutar Login y casos 1 a 6 con proveedor activo; detener solamente el proveedor y ejecutar casos 7 y 8; volver a iniciarlo al terminar.

El código original de ms-usuarios y del proveedor se mantiene sin cambios. Solo se configuró el .env y la base local del proveedor para estas pruebas. Las VMs y el despliegue de Persona 2 no se modificaron. El repositorio se deja para el final, según lo solicitado.
