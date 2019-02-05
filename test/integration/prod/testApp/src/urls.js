export default {
  '/': () => import('./apps/Hello'),
  '/counter': () => import('./apps/Counter'),
  '/hello2': () => import('./apps/Hello2'),
  '/test': () => import('./apps/Test'),
};
