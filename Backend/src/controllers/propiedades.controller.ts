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


// Función auxiliar para generar el código
const generarCodigoId = () => {
  const caracteres = 'ABCDEFGHIJKLMNPQRSTUVWXYZ123456789';
  let resultado = '';
  for (let i = 0; i < 6; i++) {
    resultado += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
  }
  return resultado;
};

export const createPropiedad = async (c: Context) => {
  try {
    const body = await c.req.json();
    
    // 1. Definir el ID inicial (el enviado o uno generado)
    let uniqueId = body.codigo_id || generarCodigoId();
    let isUnique = false;
    let attempts = 0;

    // 2. Bucle para evitar duplicados (Colisiones)
    while (!isUnique && attempts < 5) {
      const existing = await c.env.DB.prepare('SELECT codigo_id FROM propiedades WHERE codigo_id = ?')
        .bind(uniqueId)
        .first();

      if (!existing) {
        isUnique = true; // El ID está libre
      } else {
        // Si el usuario envió uno y ya existe, lanzamos error
        if (body.codigo_id) {
          return c.json({ success: false, error: `El código ${body.codigo_id} ya existe.` }, 409);
        }
        // Si era autogenerado, generamos otro y reintentamos
        uniqueId = generarCodigoId();
        attempts++;
      }
    }

    // Si después de 5 intentos no logramos un ID único (altamente improbable)
    if (!isUnique) throw new Error("No se pudo generar un identificador único. Intente nuevamente.");

    // 3. Asignamos el ID validado al body antes de pasar por Zod
    body.codigo_id = uniqueId;
    const validated = PropiedadSchema.parse(body);

    // 4. Inserción final en la DB
    await c.env.DB.prepare(`
      INSERT INTO propiedades (
        codigo_id, pais, ciudad, direccion, ambientes, 
        metros_cuadrados, precio, tipo_contratacion, estado, descripcion
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      validated.codigo_id,
      validated.pais,
      validated.ciudad,
      validated.direccion,
      validated.ambientes,
      validated.metros_cuadrados,
      validated.precio,
      validated.tipo_contratacion,
      validated.estado,
      validated.descripcion || ''
    ).run();

    return c.json({ 
      success: true, 
      message: 'Propiedad creada correctamente', 
      id: validated.codigo_id 
    }, 201);

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

