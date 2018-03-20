// @flow

type Props = {|
  yield: React.Node
|}

const PreviewNoContainerLayout = (props: Props) => (
  <html className='enhanced'>
    <head>
      <link rel='stylesheet' href='/dist-styles/styleguide.css' />
      <script type='text/javascript' src='/dist-js/app.js'></script>
    </head>
    <body>
      <div dangerouslySetInnerHTML={{ __html: props.yield }} />
    </body>
  </html>
);

export default PreviewNoContainerLayout;
