type Props = {|
  yield: React.Node
|}

const PreviewLayout = (props: Props) => (
  <html>
    <head>
      <link rel='stylesheet' href='/dist-styles/styleguide.css' />
    </head>
    <body>
      <div className='container styleguide__container'>
        <div dangerouslySetInnerHTML={{ __html: props.yield }} />
      </div>
    </body>
  </html>
);

export default PreviewLayout;
