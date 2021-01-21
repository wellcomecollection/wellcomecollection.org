import { RouteMiddleware } from '../types/application';

export const indexPage: RouteMiddleware = (context) => {
  const bundle = context.routes.url('assets-bundles');

  if (!context.isAuthenticated()) {
    context.redirect('/login');
    return;
  }

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
};
