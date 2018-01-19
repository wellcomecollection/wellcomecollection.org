import { readFileSync } from 'fs';
import { join } from 'path';

const styles = readFileSync(join(process.cwd(), '../dist/assets/css/styleguide.css'), 'utf8');

export default (props) => (
  <html>
    <head>
      <style>{styles}</style>
    </head>
    <body>
      <div class="container styleguide__container">
        <div dangerouslySetInnerHTML={{ __html: props.yield }} />
      </div>
    </body>
  </html>
);
