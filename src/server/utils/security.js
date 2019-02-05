import getAttr from 'lodash/get';
import crypto from 'crypto';
import jsonwebtoken from 'jsonwebtoken';

const algorithm = 'aes-256-ctr';

export function encrypt(text, secret = getAttr(process, 'env.APP_SECRET', null)) {
  const cipher = crypto.createCipher(algorithm, secret);
  let crypted = cipher.update(text, 'utf8', 'hex');
  crypted += cipher.final('hex');
  return crypted;
}

export function decrypt(text, secret = getAttr(process, 'env.APP_SECRET', null)) {
  const decipher = crypto.createDecipher(algorithm, secret);
  let dec = decipher.update(text, 'hex', 'utf8');
  dec += decipher.final('utf8');
  return dec;
}

export function createJWT(id, role) {
  return jsonwebtoken.sign(
    { role, person_id: parseInt(id, 10) },
    process.env.JWT_SECRET,
    {
      audience: 'postgraphile',
      issuer: 'postgraphile',
      expiresIn: '10 days',
    },
  );
}

export function getAdminJWT() {
  return jsonwebtoken.sign(
    JSON.parse(process.env.ADMIN_JWT),
    process.env.JWT_SECRET,
    {
      audience: 'postgraphile',
      issuer: 'postgraphile',
      expiresIn: '1 day',
    },
  );
}

export function decodeJWT(token) {
  return jsonwebtoken.verify(token, process.env.JWT_SECRET, {
    audience: ['postgraphile'],
  });
}
