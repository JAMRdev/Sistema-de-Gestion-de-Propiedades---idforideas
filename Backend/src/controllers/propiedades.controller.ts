import { Context } from 'hono';
import { PropiedadSchema } from '../db/schema';

// Listar todas las propiedades
export const getAllPropiedades = async (c: Context) => {
  const { results } = await c.env.DB.prepare('SELECT * FROM propiedades').all();
  return c.json(results);
};

// Ver una sola propiedad por ID
export const getPropiedadById = async (c: Context) => {
  const id = c.req.param('id');
  const propiedad = await c.env.DB.prepare('SELECT * FROM propiedades WHERE codigo_id = ?')
    .bind(id)
    .first();

  if (!propiedad) return c.json({ error: 'Propiedad no encontrada' }, 404);
  return c.json(propiedad);
};

// Crear propiedad
export const createPropiedad = async (c: Context) => {
  try {
    const body = await c.req.json();
    const validated = PropiedadSchema.parse(body);

    await c.env.DB.prepare(`
      INSERT INTO propiedades (codigo_id, pais, ciudad, direccion, ambientes, metros_cuadrados, precio, tipo_contratacion, estado, descripcion)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      validated.codigo_id, validated.pais, validated.ciudad, validated.direccion,
      validated.ambientes, validated.metros_cuadrados, validated.precio,
      validated.tipo_contratacion, validated.estado, validated.descripcion || ''
    ).run();

    return c.json({ success: true, message: 'Propiedad creada' }, 201);
  } catch (err: any) {
    return c.json({ success: false, error: err.message }, 400);
  }
};

// Actualizar propiedad
export const updatePropiedad = async (c: Context) => {
  const id = c.req.param('id');
  try {
    const body = await c.req.json();
    // Validamos parcialmente (por si solo mandas el precio o el estado)
    const validated = PropiedadSchema.partial().parse(body);

    // Ejemplo simple actualizando precio y estado
    await c.env.DB.prepare('UPDATE propiedades SET precio = COALESCE(?, precio), estado = COALESCE(?, estado) WHERE codigo_id = ?')
      .bind(validated.precio, validated.estado, id)
      .run();

    return c.json({ success: true, message: 'Propiedad actualizada' });
  } catch (err: any) {
    return c.json({ success: false, error: err.message }, 400);
  }
};

// Eliminar propiedad
export const deletePropiedad = async (c: Context) => {
  const id = c.req.param('id');
  await c.env.DB.prepare('DELETE FROM propiedades WHERE codigo_id = ?').bind(id).run();
  return c.json({ success: true, message: 'Propiedad eliminada' });
};