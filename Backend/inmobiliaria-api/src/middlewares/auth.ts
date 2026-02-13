import { basicAuth } from 'hono/basic-auth'
import { Context, Next } from 'hono'

export const adminAuthMiddleware = async (c: Context, next: Next) => {
  // Obtenemos las credenciales de las variables de entorno que configuramos en wrangler.jsonc
  const auth = basicAuth({
    username: c.env.ADMIN_USER,
    password: c.env.ADMIN_PASS,
  })
  
  return auth(c, next)
}