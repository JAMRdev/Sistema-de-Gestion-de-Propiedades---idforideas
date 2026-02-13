import { OpenAPIHono } from '@hono/zod-openapi';
import { swaggerUI } from '@hono/swagger-ui';
import { cors } from 'hono/cors';
import propiedades from './routes/propiedades';
import auth from './routes/auth'; // 1. Importá el archivo de auth

const app = new OpenAPIHono();

app.use('*', cors());
app.use('*', cors());

// Configuración de Seguridad para Swagger (Basic Auth)
app.openAPIRegistry.registerComponent('securitySchemes', 'basicAuth', {
  type: 'http',
  scheme: 'basic',
});

//
app.get('/', (c) => c.text('API Sistema de Gestión de Propiedades - ID For Ideas') );

// Documentación JSON
app.doc('/doc', {
  openapi: '3.0.0',
  info: {
    version: '1.0.0',
    title: 'API - ID For Ideas',
    description: 'Gestión de propiedades',
  },
});

// Interfaz Gráfica
app.get('/ui', swaggerUI({ url: '/doc' }));

// Montar rutas
app.route('/api/propiedades', propiedades);
app.route('/api/auth', auth); // 2. Montá las rutas de autenticación

export default app;