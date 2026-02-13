# 🏠 Sistema de Gestión Inmobiliaria  
## 📘 API Documentation

¡Hola equipo! 👋  

Se ha desplegado la nueva API robusta para la gestión de propiedades.  
La infraestructura es **Serverless**, diseñada para alta disponibilidad y baja latencia.

---

# 🚀 Stack Tecnológico

| Componente | Tecnología |
|------------|------------|
| **Runtime** | Cloudflare Workers (Edge Computing) |
| **Framework** | Hono v4+ (con soporte nativo OpenAPI/Swagger) |
| **Base de Datos** | Cloudflare D1 (SQL relacional) |
| **Validación** | Zod (integridad de tipos en runtime) |

---

# 🔗 Enlaces de Interés

- **Base URL:**  
  ```
  https://idforideas-1.jamrdev.com.ar/api
  ```

- **Swagger UI (Documentación Interactiva):**  
  https://idforideas-1.jamrdev.com.ar/ui

- **OpenAPI JSON:**  
  ```
  /doc
  ```

---

# 🎨 Para el Equipo de Frontend

La API:

- ✅ Tiene **CORS habilitado**
- ✅ Expone contratos claros mediante **Swagger**
- ✅ Mantiene validaciones estrictas

---

## 🔐 Autenticación

Las rutas administrativas (`POST`, `PUT`, `DELETE`) utilizan **Basic Auth**.

**Header requerido:**

```
Authorization: Basic <credentials>
```

💡 **Tip:**  

Usar el endpoint:

```
GET /api/auth/verify
```

Para validar credenciales antes de guardarlas en el estado global del panel.

---

## 💻 Ejemplo de Integración (JavaScript)

```javascript
const fetchPropiedades = async () => {
  try {
    const response = await fetch(
      'https://idforideas-1.jamrdev.com.ar/api/propiedades'
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data;

  } catch (error) {
    console.error("Error cargando propiedades:", error);
  }
};
```

---

# 🧪 Para el Equipo de QA

La API implementa validaciones estrictas con **Zod + OpenAPI**.
En la carpeta "ID For Ideas - Inmobiliaria" encontrarán una colección para importar a Bruno y también encontrarán el archivo "TEST_ ID For Ideas - Inmobiliaria - Postman File" para importarlo a Postman y probar los endpoints.

Escenarios clave para pruebas de regresión y smoke tests.

---

## 1️⃣ Endpoints de Verificación

| Método | Ruta | Objetivo |
|--------|------|----------|
| `GET` | `/api/auth/verify` | Validar credenciales Admin (Basic Auth) |
| `GET` | `/doc` | Verificar que el JSON OpenAPI esté actualizado |

---

## 2️⃣ Casos de Prueba — Validación de Datos

### 🔎 Código ID Único

- Crear propiedad con `codigo_id` que **no tenga exactamente 6 caracteres**
  - Ej: `ABC1`
  - Ej: `ABC1234`
- ✅ Esperado: `400 Bad Request`

---

### 🔢 Tipos de Datos

Enviar `precio` como string:

```json
{ "precio": "100.000" }
```

En lugar de:

```json
{ "precio": 100000 }
```

- ✅ Esperado: Error de validación

---

### 📌 Enumeraciones

Intentar enviar un `estado` fuera de los permitidos:

- Disponible  
- Reservado  
- Alquilado  
- Vendido  

- ✅ Esperado: Error de validación

---

### 📍 Campos Obligatorios

Intentar `POST` omitiendo:

- `ciudad`
- `direccion`

- ✅ Esperado: `400 Bad Request`

---

## 3️⃣ Pruebas de Seguridad

### 🚫 Acceso No Autorizado

- Ejecutar `POST`, `PUT` o `DELETE`
- Sin header `Authorization`

- ✅ Esperado: `401 Unauthorized`

---

### 💾 Persistencia

1. Realizar `POST` exitoso  
2. Validar que el `codigo_id` aparezca en:

```
GET /api/propiedades
```

---

# ⚙️ Infraestructura y Despliegue (DevOps)

La API corre sobre la red global de **Cloudflare** utilizando un modelo *Serverless* de baja latencia.

---

## 📦 Stack de Infraestructura

| Componente | Tecnología |
|------------|------------|
| **Runtime** | Cloudflare Workers (V8 Isolation) |
| **Database** | Cloudflare D1 (SQLite distribuido) |
| **Dominio** | idforideas-1.jamrdev.com.ar |
