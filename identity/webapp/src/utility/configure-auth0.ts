import koaPassport from 'koa-passport';
import Auth0Strategy from 'passport-auth0';
import { config } from '../config';

export function configureAuth0(): void {
  const strategy = new Auth0Strategy(config.auth0, function (accessToken, refreshToken, extraParams, profile, done) {
    return done(null, {
      accessToken,
      refreshToken,
      profile,
    });
  });

  koaPassport.use(strategy);

  koaPassport.serializeUser(function (user, done) {
    done(null, user);
  });

  koaPassport.deserializeUser(function (user: any, done) {
    done(null, user);
  });
}
