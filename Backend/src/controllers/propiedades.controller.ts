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
    
    // Si no mandan codigo_id, lo generamos
    if (!body.codigo_id) {
      body.codigo_id = generarCodigoId();
    }

    const validated = PropiedadSchema.parse(body);

    await c.env.DB.prepare(`
      INSERT INTO propiedades (codigo_id, pais, ciudad, direccion, ambientes, metros_cuadrados, precio, tipo_contratacion, estado, descripcion)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      validated.codigo_id, validated.pais, validated.ciudad, validated.direccion,
      validated.ambientes, validated.metros_cuadrados, validated.precio,
      validated.tipo_contratacion, validated.estado, validated.descripcion || ''
    ).run();

    return c.json({ success: true, message: 'Propiedad creada', id: validated.codigo_id }, 201);
  } catch (err: any) {
    return c.json({ success: false, error: err.message }, 400);
  }
};

// Actualizar propiedad
export const updatePropiedad = async (c: Context) => {
  const id = c.req.param('id');
  try {
    const body = await c.req.json();
    
    // VALIDACIÓN: Si el body trae un codigo_id distinto al de la URL, lanzamos error
    if (body.codigo_id && body.codigo_id !== id) {
      return c.json({ 
        success: false, 
        error: "No está permitido modificar el código identificador de la propiedad." 
      }, 400);
    }

    const validated = PropiedadSchema.partial().parse(body);

    const p = {
      pais: validated.pais ?? null,
      ciudad: validated.ciudad ?? null,
      direccion: validated.direccion ?? null,
      ambientes: validated.ambientes ?? null,
      metros_cuadrados: validated.metros_cuadrados ?? null,
      precio: validated.precio ?? null,
      tipo_contratacion: validated.tipo_contratacion ?? null,
      estado: validated.estado ?? null,
      descripcion: validated.descripcion ?? null,
    };

    const result = await c.env.DB.prepare(`
      UPDATE propiedades SET 
        pais = COALESCE(?, pais),
        ciudad = COALESCE(?, ciudad),
        direccion = COALESCE(?, direccion),
        ambientes = COALESCE(?, ambientes),
        metros_cuadrados = COALESCE(?, metros_cuadrados),
        precio = COALESCE(?, precio),
        tipo_contratacion = COALESCE(?, tipo_contratacion),
        estado = COALESCE(?, estado),
        descripcion = COALESCE(?, descripcion)
      WHERE codigo_id = ?
    `).bind(
      p.pais, p.ciudad, p.direccion,
      p.ambientes, p.metros_cuadrados, p.precio,
      p.tipo_contratacion, p.estado, p.descripcion, 
      id
    ).run();

    if (result.meta.changes === 0) {
      return c.json({ success: false, error: "Propiedad no encontrada" }, 404);
    }

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

// Función para generar un código ID único de 6 caracteres
const generarCodigoId = () => {
  const caracteres = 'ABCDEFGHIJKLMNPQRSTUVWXYZ123456789'; // Evitamos O y 0 para no confundir
  let resultado = '';
  for (let i = 0; i < 6; i++) {
    resultado += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
  }
  return resultado;
};