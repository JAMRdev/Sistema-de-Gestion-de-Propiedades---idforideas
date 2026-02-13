CREATE TABLE propiedades (
  codigo_id VARCHAR(6) PRIMARY KEY,
  pais VARCHAR(100),
  ciudad VARCHAR(100),
  direccion VARCHAR(255),
  ambientes INTEGER,
  metros_cuadrados DECIMAL(10,2),
  precio DECIMAL(15,2),
  tipo_contratacion TEXT CHECK(tipo_contratacion IN ('Alquiler', 'Venta')),
  estado TEXT CHECK(estado IN ('Disponible', 'Reservado', 'Alquilado', 'Vendido')),
  descripcion TEXT,
  fecha_publicacion DATE DEFAULT CURRENT_DATE
);