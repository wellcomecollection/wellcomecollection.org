import {cache} from '../services/interval-cache';

export function intervalCache() {
  return (ctx, next) => {
    ctx.intervalCache = cache;
    return next();
  };
}
