# ms-patrocinadores · Contrato de la API

Microservicio **proveedor** del examen del Módulo 3 (solo lectura). Puerto: **3012**.
Lo consulta el microservicio de eventos, que guarda el atributo `patrocinador_id`.

## Cómo ejecutarlo

Requisitos: Node.js 22.9 o superior, MySQL 8 y ms-usuarios corriendo (para obtener tokens).

1. Como root en MySQL:

```sql
CREATE DATABASE patrocinadores_db;
CREATE USER 'patrocinadores_user'@'localhost' IDENTIFIED BY 'una-clave-segura';
GRANT ALL PRIVILEGES ON patrocinadores_db.* TO 'patrocinadores_user'@'localhost';
```

2. `mysql -u patrocinadores_user -p patrocinadores_db` y luego `SOURCE db/schema.sql;`
3. `npm install`
4. Copiar `.env.example` como `.env`. `JWT_SECRET` debe ser **la misma de ms-usuarios**.
5. `npm run dev`

## Representación

```json
{"id": 1, "empresa": "Tecnoandina", "sector": "tecnología", "estado_contrato": "vigente"}
```

## Atributos

| Atributo | Tipo |
|---|---|
| id | entero |
| empresa | texto |
| sector | texto |
| estado_contrato | texto |

## Endpoints

Todas las peticiones llevan `Authorization: Bearer <token>`. Cualquier rol autenticado puede consultar.

| Operación | Método | URI | Respuesta exitosa | Errores |
|---|---|---|---|---|
| Listar | GET | /patrocinadores | 200 arreglo | 401 |
| Consultar por lotes | GET | /patrocinadores?ids=1,3 | 200 arreglo (solo los que existen) | 400 · 401 |
| Obtener | GET | /patrocinadores/:id | 200 objeto | 400 · 401 · 404 |

## Datos iniciales

| id | empresa | sector | estado_contrato |
|---|---|---|---|
| 1 | Tecnoandina | tecnología | vigente |
| 2 | Lácteos del Valle | alimentos | vigente |
| 3 | Construye Ya | construcción | vencido |
| 4 | Banco Futuro | finanzas | vigente |

## Para el consumidor

La carpeta `para-el-consumidor/` trae `patrocinadores.client.js` con la función `pedir()` ya escrita (token y tiempo de espera). Se copia en `ms-eventos/src/clients/` y se completa.

## Frontend del examen

La carpeta `frontend/` trae `index.html`, ya configurado para ms-eventos y ms-patrocinadores. No se modifica: se copia al `DocumentRoot` del host virtual del examen en servidor2, y desde Windows se abre `http://examen.<dominio>/`. La página inicia sesión por `/api/usuarios/login` y muestra los listados de `/api/eventos` y `/api/patrocinadores` por el mismo nombre, así que no necesita CORS.

## Me consultan

| Me consulta | Peticiones que me hace |
|---|---|
| ms-eventos | `GET /patrocinadores/:id` (validar) · `GET /patrocinadores?ids=…` (componer) |
