import KoaRouter from 'koa-router';

export default () => {
  const router = new KoaRouter();

  router.get('/pizza', async (ctx) => {
    ctx.body = 'Pizza World';
  });

  return router.routes();
};
