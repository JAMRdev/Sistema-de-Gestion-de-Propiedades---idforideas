# 🏠 Sistema de Gestión Inmobiliaria - API Documentation

¡Hola equipo! Hemos desplegado la nueva API robusta para la gestión de propiedades (enfocada en las operaciones de Zona Norte y Oeste). Esta infraestructura es **Serverless**, diseñada para alta disponibilidad y baja latencia.

## 🚀 Stack Tecnológico
* **Runtime:** Cloudflare Workers (Edge Computing).
* **Framework:** Hono (v4+) con soporte nativo para OpenAPI/Swagger.
* **Base de Datos:** Cloudflare D1 (SQL Relacional).
* **Validación:** Zod (Garantiza integridad de tipos en Runtime).

---

## 🔗 Enlaces de Interés
* **Base URL:** `https://idforideas-1.jamrdev.com.ar/api`
* **Documentación Interactiva (Swagger UI):** [Abrir Swagger](https://idforideas-1.jamrdev.com.ar/ui)
* **Especificación Técnica (JSON):** `/doc`

---

## 🎨 Para el equipo de Frontend

La API tiene **CORS habilitado** y expone contratos claros mediante Swagger.

### Autenticación
Las rutas de administración (`POST`, `PUT`, `DELETE`) están protegidas mediante **Basic Auth**.
- **Header:** `Authorization: Basic <credentials>`
- **Tip:** Pueden usar el endpoint `GET /api/auth/verify` para validar las credenciales ingresadas por el usuario en el login del panel antes de guardarlas en el estado global.

### Ejemplo de integración rápida (JavaScript):
```javascript
const fetchPropiedades = async () => {
  try {
    const response = await fetch('[https://idforideas-1.jamrdev.com.ar/api/propiedades](https://idforideas-1.jamrdev.com.ar/api/propiedades)');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error cargando propiedades:", error);
  }
};


## 🧪 Guía de Testing - API Inmobiliaria

La API implementa validaciones de esquema estrictas mediante **Zod** y **OpenAPI**. A continuación, los escenarios clave para pruebas de regresión y humo.

### 1. Endpoints de Verificación
| Método | Ruta | Objetivo |
| :--- | :--- | :--- |
| `GET` | `/api/auth/verify` | Validar credenciales de Admin (Basic Auth). |
| `GET` | `/doc` | Validar que el JSON de OpenAPI esté actualizado. |

### 2. Casos de Prueba (Validación de Datos)
* **Código ID Único:** Intentar crear una propiedad con un `codigo_id` que no tenga exactamente 6 caracteres (ej: `ABC1` o `ABC1234`). La API debe retornar `400 Bad Request`.
* **Tipos de Datos:** Enviar el campo `precio` como un string (`"100.000"`) en lugar de number (`100000`). Debe fallar con error de validación.
* **Enumeraciones:** Intentar setear un `estado` fuera de los permitidos (`Disponible`, `Reservado`, `Alquilado`, `Vendido`).
* **Campos Obligatorios:** Intentar un POST omitiendo la `ciudad` o `dirección`.

### 3. Pruebas de Seguridad
* **Acceso No Autorizado:** Intentar un `POST`, `PUT` o `DELETE` sin el Header `Authorization`. Resultado esperado: `401 Unauthorized`.
* **Persistencia:** Tras un `POST` exitoso, verificar que el `codigo_id` aparezca en el listado general `GET /api/propiedades`.


## ⚙️ Infraestructura y Despliegue (DevOps)

La API corre sobre la red global de **Cloudflare** utilizando un modelo de ejecución *Serverless* de baja latencia.

### 📦 Stack de Infraestructura
* **Runtime:** Cloudflare Workers (V8 Isolation).
* **Database:** Cloudflare D1 (Motor SQLite distribuido).
* **Domain:** `idforideas-1.jamrdev.com.ar`