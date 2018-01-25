export default (props) => (
  <html>
    <head>
      <link rel='stylesheet' href='/dist-styles/styleguide.css' />
    </head>
    <body>
      <div dangerouslySetInnerHTML={{ __html: props.yield }} />
    </body>
  </html>
);
