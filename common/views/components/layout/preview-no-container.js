// @flow

import HeadJs from '../Header/HeadJs';

type Props = {|
  yield: React.Node
|}

const PreviewNoContainerLayout = (props: Props) => (
  <html>
    <head>
      <link rel='stylesheet' href='/dist-styles/styleguide.css' />
      <HeadJs enhancedJsPath='/dist-js/app.js' />
    </head>
    <body>
      <div dangerouslySetInnerHTML={{ __html: props.yield }} />
    </body>
  </html>
);

export default PreviewNoContainerLayout;
