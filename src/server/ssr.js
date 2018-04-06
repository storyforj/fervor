import KoaRouter from 'koa-router';
import processRoute from './processRoute';

export default (options) => {
  const router = new KoaRouter();
  router.get('*', (ctx, next) => (
    processRoute(options, ctx, next)
  ));

  return router.routes();
};
