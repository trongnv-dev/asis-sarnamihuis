import nookies, { parseCookies, setCookie, destroyCookie } from 'nookies';

const MAX_AGE = 24 * 60 * 60 * 7;
export function getToken(ctx) {
  return parseCookies(ctx).token;
}

export function saveToken(token, ctx) {
  setCookie(ctx, 'token', token, {
    maxAge: MAX_AGE,
  });
}

export function clearToken(ctx) {
  destroyCookie({}, 'token');
}

export default { getToken, saveToken, clearToken };
