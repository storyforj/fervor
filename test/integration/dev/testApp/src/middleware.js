import KoaRouter from 'koa-router';

export default ({ app }) => {
  const router = new KoaRouter();

  router.get('/pizza', async (ctx) => {
    ctx.body = 'Pizza World';
  });

  app.use(router.routes());
};
