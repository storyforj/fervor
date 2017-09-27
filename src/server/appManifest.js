import KoaRouter from 'koa-router';

export default (options) => {
  const router = new KoaRouter();
  router.get('/appmanifest.json', (ctx) => {
    if (options.disableWebpack) {
      // eslint-disable-next-line
      ctx.body = JSON.stringify(require(`${options.appLocation}/build/config/appmanifest.json`));
    } else {
      // eslint-disable-next-line
      ctx.body = JSON.stringify(require(`${options.appLocation}/src/config/appmanifest.json`));
    }
    ctx.type = 'application/json';
  });

  return router.routes();
};
