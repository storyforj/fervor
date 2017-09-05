import KoaRouter from 'koa-router';
import koaSend from 'koa-send';

export default () => {
  const router = new KoaRouter();
  router.get('/sw.js', async (ctx) => koaSend(ctx, '/build/sw.js', { gzip: true }));
  router.get('/workbox-sw.prod.v2.0.0.js', async (ctx) => koaSend(ctx, '/build/workbox-sw.prod.v2.0.0.js', { gzip: true }));
  router.get('/build/bundle-*', async (ctx) => koaSend(ctx, ctx.path, { gzip: true }));
  router.get('/assets/*', async (ctx) => koaSend(ctx, ctx.path, { gzip: true }));

  return router.routes();
};
