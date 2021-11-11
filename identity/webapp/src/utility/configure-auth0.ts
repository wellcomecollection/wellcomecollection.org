import koaPassport from 'koa-passport';
import Auth0Strategy from 'passport-auth0';
import { config } from '../config';
import { identityAxios } from './api-caller';

export function configureAuth0(): void {
  const strategy = new Auth0Strategy(config.auth0, function (
    accessToken,
    refreshToken,
    extraParams,
    profile,
    done
  ) {
    return done(null, {
      accessToken,
      profile,
    });
  });

  koaPassport.use(strategy);

  koaPassport.serializeUser(function (user, done) {
    done(null, user);
  });

  koaPassport.deserializeUser(async function (user: any, done) {
    const accessToken: string = user?.accessToken;
    try {
      // TODO: we shouldn't need to do this, we should assume the session is valid
      await identityAxios.get('/users/me', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      done(null, user);
    } catch (e) {
      done(null, false);
    }
  });
}
