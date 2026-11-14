/**
 * Serves the repository so `playground/index.html` can load the built
 * `ltv-logo-js` bundle. Run with `bun run playground`.
 */
import { join, normalize } from 'node:path';

const root = join(import.meta.dir, '..');
const port = Number(process.env.PORT ?? 4173);

const server = Bun.serve({
  port,
  async fetch(req) {
    const { pathname } = new URL(req.url);
    if (pathname === '/') return Response.redirect('/playground/', 302);
    const rel = normalize(decodeURIComponent(pathname)).replace(
      /^(\.\.[/\\])+/,
      ''
    );
    const path = join(root, rel.endsWith('/') ? `${rel}index.html` : rel);
    if (!path.startsWith(root))
      return new Response('Forbidden', { status: 403 });
    const file = Bun.file(path);
    return (await file.exists())
      ? new Response(file)
      : new Response('Not found', { status: 404 });
  }
});

console.log(`LTV logo playground: ${server.url}playground/`);
