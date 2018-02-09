// @flow
import Image from '../Image/Image';
import ReactDOMServer from 'react-dom/server';

export const name = 'Captioned image';
export const handle = 'captioned-image';
export const status = 'graduated';

const imageString = ReactDOMServer.renderToString(<Image
  contentUrl='https://wellcomecollection.files.wordpress.com/2016/10/featured-image-dans-blog2.jpg'
  caption='An edited frame from Animating the Body'
  width={1380}
  height={1104}
  alt='animating the body'
  lazyload={true}
/>);

const Children = () => (
  <div dangerouslySetInnerHTML={{__html: imageString}} />
);

export const context = {
  children: Children(),
  caption: `<p class="">Collecting plants in a monastic garden, from <em class="">Kreuterbuch, von natürlichem Nutz, und gründtlichem Gebrauch der Kreutter</em>, 1550.</p>`
};
