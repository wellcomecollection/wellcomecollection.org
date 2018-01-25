type Props = {|
  yield: React.Node
|}

const PreviewNoContainerLayout = (props: Props) => (
  <html>
    <head>
      <link rel='stylesheet' href='/dist-styles/styleguide.css' />
    </head>
    <body>
      <div dangerouslySetInnerHTML={{ __html: props.yield }} />
    </body>
  </html>
);

export default PreviewNoContainerLayout;
