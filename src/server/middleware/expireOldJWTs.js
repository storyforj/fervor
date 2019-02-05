import { decodeJWT } from '../utils/security';

export default async (ctx, next) => {
  // delete auth JWT when it's not longer valid
  const authJWT = ctx.cookies.get('authJWT');
  try {
    decodeJWT(authJWT);
  } catch (e) {
    if (typeof ctx.cookie === 'object') {
      delete ctx.cookie.authJWT;
    }
  }

  await next();
};
