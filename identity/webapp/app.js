const Koa = require('koa');
const Router = require('koa-router');
const session = require('koa-session');
const next = require('next');
const Auth0Strategy = require('passport-auth0');
const passport = require('koa-passport');
require('dotenv').config();
const querystring = require('querystring');
const {
  handleAllRoute,
} = require('@weco/common/koa-middleware/withCachedValues');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

module.exports = app
  .prepare()
  .then(async () => {
    const server = new Koa();
    const router = new Router();

    if (server.env === 'production') {
      session.cookie.secure = true;
    }

    // Passport configuration
    const strategy = new Auth0Strategy(
      {
        domain: process.env.AUTH0_DOMAIN,
        clientID: process.env.AUTH0_CLIENT_ID,
        clientSecret: process.env.AUTH0_CLIENT_SECRET,
        callbackURL: process.env.AUTH0_CALLBACK_URL,
      },
      function (accessToken, refreshToken, extraParams, profile, done) {
        return done(null, profile);
      }
    );

    // App configuration
    server.keys = ['secret'];
    server.use(session({}, server));
    passport.use(strategy);
    server.use(passport.initialize());
    server.use(passport.session());

    passport.serializeUser((user, done) => {
      done(null, user);
    });

    passport.deserializeUser((user, done) => {
      done(null, user);
    });

    // Auth routing
    router.get(
      '/login',
      passport.authenticate('auth0', { scope: 'openid email profile' }),
      ctx => {
        ctx.redirect('/account');
      }
    );

    router.get('/callback', (ctx, next) => {
      passport.authenticate('auth0', (err, user, info) => {
        if (err) {
          return next(err);
        }

        if (!user) {
          return ctx.redirect('/login');
        }

        ctx.login(user, err => {
          if (err) {
            return next(err);
          }
          const returnTo = ctx.session.returnTo;
          delete ctx.session.returnTo;
          ctx.redirect(returnTo || '/');
        });
      })(ctx, next);
    });

    router.get('/logout', ctx => {
      ctx.logout();

      let returnTo = `${ctx.protocol}://${ctx.hostname}`;
      const port = ctx.socket.localPort;

      if (port !== undefined && port !== 80 && port !== 443) {
        returnTo =
          process.env.NODE_ENV === 'production'
            ? `${returnTo}/`
            : `${returnTo}:${port}/`;
      }

      const logoutUrl = new URL(
        `https://${process.env.AUTH0_DOMAIN}/v2/logout`
      );

      const searchString = querystring.stringify({
        client_id: process.env.AUTH0_CLIENT_ID,
        returnTo: returnTo,
      });

      logoutUrl.search = searchString;

      ctx.redirect(logoutUrl.toString());
    });

    const secured = (ctx, next) => {
      if (ctx.state.user) {
        return next();
      }

      ctx.session.returnTo = ctx.originalUrl;
      ctx.redirect('/login');
    };

    // Next routing
    router.get('/account', secured, async ctx => {
      await app.render(ctx.req, ctx.res, '/account');
    });

    router.get('/account/management/healthcheck', async ctx => {
      ctx.status = 200;
      ctx.body = 'ok';
    });

    router.get('*', handleAllRoute(handle));

    server.use(async (ctx, next) => {
      ctx.res.statusCode = 200;
      await next();
    });

    server.use(router.routes());
    return server;
  })
  .catch(ex => {
    console.error(ex.stack);
    process.exit(1);
  });
