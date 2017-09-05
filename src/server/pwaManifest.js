import KoaRouter from 'koa-router';

export default (options) => {
  const router = new KoaRouter();
  router.get('/pwamanifest.json', (ctx) => {
    ctx.body = JSON.stringify({
      name: options.appName,
      short_name: options.appShortName,
      icons: options.appIcons,
      start_url: '/',
      display: 'standalone',
      background_color: options.appBackgroundColor,
      theme_color: options.appThemeColor,
    });
    ctx.type = 'application/json';
  });

  return router.routes();
};
