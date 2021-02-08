import { withPrefix } from '../utility/prefix';
import { RouteMiddleware } from '../types/application';
import { prefix } from '../utility/prefix';

const unAuthenticatedPages: string[] = ['/register', '/validated', '/error'];

export const indexPage: RouteMiddleware = (context) => {
  const bundle = context.routes.url('assets-bundles');
  let path = context.request.URL.pathname;
  if (prefix) {
    path = path.replace(prefix, '');
  }

  if (context.isAuthenticated() || unAuthenticatedPages.includes(path)) {
    console.log('current user ->', context.state.user);
    context.response.body = `
      <html lang="en">
        <head>
          <title>Account management</title>
          <script crossorigin src="https://unpkg.com/react@16/umd/react.development.js"></script>
          <script crossorigin src="https://unpkg.com/react-dom@16/umd/react-dom.development.js"></script>
        </head>
        <body>
          <div id="root"></div>
          <script type="application/javascript" src="${bundle}"></script>
        </body>
      </html>
    `;
    return;
  }

  context.redirect(withPrefix('/login'));
};
