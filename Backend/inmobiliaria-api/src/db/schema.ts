import { z } from '@hono/zod-openapi';

export const PropiedadSchema = z.object({
  codigo_id: z.string().openapi({ example: 'ZN1001', description: 'ID único alfanumérico' }),
  pais: z.string().openapi({ example: 'Argentina' }),
  ciudad: z.string().openapi({ example: 'Tigre' }),
  direccion: z.string().openapi({ example: 'Av. Cazón 123' }),
  ambientes: z.number().openapi({ example: 3 }),
  metros_cuadrados: z.number().openapi({ example: 75.5 }),
  precio: z.number().openapi({ example: 120000 }),
  tipo_contratacion: z.enum(['Alquiler', 'Venta']).openapi({ example: 'Venta' }),
  estado: z.enum(['Disponible', 'Reservado', 'Alquilado', 'Vendido']).openapi({ example: 'Disponible' }),
  descripcion: z.string().optional().openapi({ example: 'Hermosa vista al río' }),
});