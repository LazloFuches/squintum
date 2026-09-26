export async function onRequest(context) {
  const url = new URL(context.request.url);
  const path = url.pathname.replace(/^\/collection\/?/, '').replace(/\/$/, '');

  const publicRoutes = ['login', 'forgot-password', 'reset-password'];
  const isPublic = publicRoutes.includes(path);
  const isStatic = /\.(css|js|jpg|jpeg|png|gif|svg|ico|webp|woff2?|pdf|map)$/i.test(path);

  if (isStatic) {
    return context.next();
  }

  if (isPublic) {
    context.data = context.data || {};
    context.data.user = null;
    return context.next();
  }

  const cookies = parseCookies(context.request.headers.get('Cookie') || '');
  const sessionToken = cookies['collection_session'];

  if (!sessionToken) {
    return Response.redirect(new URL('/collection/login', url.origin).toString(), 302);
  }

  const db = context.env.DB;
  const row = await db.prepare(
    `SELECT s.user_id, s.expires_at, u.email, u.name, u.role
     FROM sessions s JOIN users u ON s.user_id = u.id
     WHERE s.token = ?`
  ).bind(sessionToken).first();

  if (!row || new Date(row.expires_at) < new Date()) {
    if (row) {
      await db.prepare('DELETE FROM sessions WHERE token = ?').bind(sessionToken).run();
    }
    return new Response(null, {
      status: 302,
      headers: {
        'Location': '/collection/login',
        'Set-Cookie': 'collection_session=; Path=/collection; Max-Age=0; HttpOnly; Secure; SameSite=Lax'
      }
    });
  }

  context.data = context.data || {};
  context.data.user = {
    id: row.user_id,
    email: row.email,
    name: row.name,
    role: row.role
  };

  return context.next();
}

function parseCookies(header) {
  const cookies = {};
  header.split(';').forEach(pair => {
    const [name, ...rest] = pair.trim().split('=');
    if (name) cookies[name] = rest.join('=');
  });
  return cookies;
}
