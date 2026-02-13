import { OpenAPIHono } from '@hono/zod-openapi'; // Cambiá esto
import { adminAuthMiddleware } from '../middlewares/auth';

const auth = new OpenAPIHono<{ Bindings: { ADMIN_USER: string; ADMIN_PASS: string } }>();

auth.get('/verify', adminAuthMiddleware, (c) => {
  return c.json({ 
    authenticated: true, 
    user: c.env.ADMIN_USER 
  });
});

export default auth;