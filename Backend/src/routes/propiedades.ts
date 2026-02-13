import { createRoute, OpenAPIHono, z } from '@hono/zod-openapi';
import { PropiedadSchema } from '../db/schema';
import * as controller from '../controllers/propiedades.controller';
import { adminAuthMiddleware } from '../middlewares/auth';

const propiedades = new OpenAPIHono<{ Bindings: { DB: D1Database } }>();

// --- DEFINICIÓN DE RUTAS PARA SWAGGER ---

const listRoute = createRoute({
  method: 'get',
  path: '/',
  summary: 'Listar todas las propiedades',
  responses: {
    200: {
      content: { 'application/json': { schema: z.array(PropiedadSchema) } },
      description: 'Retorna una lista de propiedades',
    },
  },
});

const getOneRoute = createRoute({
  method: 'get',
  path: '/{id}',
  summary: 'Obtener una propiedad por ID',
  request: { params: z.object({ id: z.string().openapi({ example: 'ZN1001' }) }) },
  responses: {
    200: {
      content: { 'application/json': { schema: PropiedadSchema } },
      description: 'Propiedad encontrada',
    },
    404: { description: 'Propiedad no encontrada' },
  },
});

const createRouteDoc = createRoute({
  method: 'post',
  path: '/',
  summary: 'Crear una nueva propiedad (Admin)',
  security: [{ basicAuth: [] }],
  request: {
    body: {
      content: { 'application/json': { schema: PropiedadSchema } },
    },
  },
  responses: {
    201: { description: 'Propiedad creada con éxito' },
    400: { description: 'Datos inválidos' },
  },
});


// --- DEFINICIÓN DE UPDATE ---
const updateRouteDoc = createRoute({
  method: 'patch',
  path: '/{id}',
  summary: 'Actualizar una propiedad (Admin)',
  security: [{ basicAuth: [] }],
  request: {
    params: z.object({ id: z.string().openapi({ example: 'ZN1001' }) }),
    body: {
      content: { 
        'application/json': { 
          // Usamos .partial() para que puedan enviar solo los campos que quieran cambiar
          schema: PropiedadSchema.partial() 
        } 
      },
    },
  },
  responses: {
    200: { description: 'Propiedad actualizada con éxito' },
    404: { description: 'Propiedad no encontrada' },
  },
});

// --- DEFINICIÓN DE DELETE ---
const deleteRouteDoc = createRoute({
  method: 'delete',
  path: '/{id}',
  summary: 'Eliminar una propiedad (Admin)',
  security: [{ basicAuth: [] }],
  request: {
    params: z.object({ id: z.string().openapi({ example: 'ZN1001' }) }),
  },
  responses: {
    200: { description: 'Propiedad eliminada con éxito' },
    404: { description: 'Propiedad no encontrada' },
  },
});

// --- REGISTRO DE RUTAS Y VÍNCULO CON EL CONTROLADOR ---

propiedades.openapi(listRoute, controller.getAllPropiedades);
propiedades.openapi(getOneRoute, controller.getPropiedadById);
propiedades.openapi(createRouteDoc, async (c) => {
  await adminAuthMiddleware(c, async () => {}); // Ejecuta el middleware
  return controller.createPropiedad(c);
});
propiedades.openapi(updateRouteDoc, async (c) => {
  await adminAuthMiddleware(c, async () => {}); 
  return controller.updatePropiedad(c);
});
propiedades.openapi(deleteRouteDoc, async (c) => {
  await adminAuthMiddleware(c, async () => {});
  return controller.deletePropiedad(c);
});

export default propiedades;