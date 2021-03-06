import koaPassport from 'koa-passport';
import Auth0Strategy from 'passport-auth0';
import { config } from '../config';
import { callRemoteApi } from './api-caller';

export function configureAuth0(): void {
  const strategy = new Auth0Strategy(config.auth0, function(accessToken, refreshToken, extraParams, profile, done) {
    return done(null, {
      accessToken,
      profile: {
        idNumber: Number(profile.id.replace('auth0|p', '')),
      },
    });
  });

  koaPassport.use(strategy);

  koaPassport.serializeUser(function(user, done) {
    done(null, user);
  });

  koaPassport.deserializeUser(async function(user: any, done) {
    const accessToken: string = user?.accessToken;
    try {
      await callRemoteApi('GET', '/users/me', { user: { accessToken } });
      done(null, user);
    } catch (e) {
      console.error(e);
      done(null, false);
    }
  });
}
