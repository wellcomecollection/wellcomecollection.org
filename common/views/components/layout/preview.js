// @flow
type Props = {|
  yield: React.Node
|}

const PreviewLayout = (props: Props) => (
  <html className='enhanced'>
    <head>
      <link rel='stylesheet' href='/dist-styles/styleguide.css' />
      <script type='text/javascript' src='/dist-js/app.js'></script>
    </head>
    <body>
      <div className='container styleguide__container'>
        <div dangerouslySetInnerHTML={{ __html: props.yield }} />
      </div>
    </body>
  </html>
);

export default PreviewLayout;
