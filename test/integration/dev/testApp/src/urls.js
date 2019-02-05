export default {
  '/': () => import('./apps/Hello'),
  '/counter': () => import('./apps/Counter'),
  '/test': () => import('./apps/Test'),
};
