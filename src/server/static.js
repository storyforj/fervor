import KoaRouter from 'koa-router';
import koaSend from 'koa-send';

export default (options) => {
  const router = new KoaRouter();
  router.get(
    '/sw.js',
    async (ctx) => koaSend(ctx, '/build/sw.js', { gzip: true, root: options.appLocation }),
  );
  router.get(
    '/workbox-sw.prod.v2.0.3.js',
    async (ctx) =>
      koaSend(ctx, '/build/workbox-sw.prod.v2.0.3.js', { gzip: true, root: options.appLocation }),
  );
  router.get(
    '/build/common.js',
    async (ctx) => koaSend(ctx, ctx.path, { gzip: true, root: options.appLocation }),
  );
  router.get(
    '/build/*-*',
    async (ctx) => koaSend(ctx, ctx.path, { gzip: true, root: options.appLocation }),
  );
  router.get(
    '/assets/*',
    async (ctx) => koaSend(ctx, ctx.path, { gzip: true, root: options.appLocation }),
  );

  return router.routes();
};
