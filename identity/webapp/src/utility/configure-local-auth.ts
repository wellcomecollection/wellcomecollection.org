import koaPassport from 'koa-passport';
import { config } from '../config';

export function configureLocalAuth() {
  if (process.env.NODE_ENV === 'production' || !config.testUser) {
    throw new Error(`Local authentication not supported outside of dev environment`);
  }

  koaPassport.serializeUser(function (user, done) {
    done(null, user as any);
  });

  koaPassport.deserializeUser(async function (id, done) {
    try {
      done(null, config.testUser);
    } catch (err) {
      done(err);
    }
  });

  const LocalStrategy = require('passport-local').Strategy;
  koaPassport.use(
    new LocalStrategy(function (username: string, password: string, done: any) {
      if (config.testUser && username === config.testUser.username && password === config.testUser.password) {
        done(null, config.testUser);
      } else {
        done(null, false);
      }
    })
  );
}
