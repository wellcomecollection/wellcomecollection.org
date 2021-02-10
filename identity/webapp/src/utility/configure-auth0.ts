import koaPassport from 'koa-passport';
import Auth0Strategy from 'passport-auth0';
import { config } from '../config';
import { callAuth0Api } from './api-caller';

export function configureAuth0(): void {
  const strategy = new Auth0Strategy(config.auth0, function (accessToken, refreshToken, extraParams, profile, done) {
    return done(null, {
      accessToken,
      id: profile.id.replace('auth0|p', ''),
    });
  });

  koaPassport.use(strategy);

  koaPassport.serializeUser(function (user, done) {
    done(null, user);
  });

  koaPassport.deserializeUser(async function (user: any, done) {
    const accessToken: string = user?.accessToken;

    try {
      const isValidToken = await callAuth0Api('GET', '/userinfo', { user: { accessToken } });
      done(null, isValidToken.status !== 200 ? false : user);
    } catch (e) {
      done(null, false);
    }
  });
}
