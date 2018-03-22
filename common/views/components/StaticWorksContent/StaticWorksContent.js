// @flow
import {spacing, font, grid} from '../../../utils/classnames';
import {Fragment} from 'react';
import Tags from '../Tags/Tags';
import CaptionedImage from '../CaptionedImage/CaptionedImage';
import Tasl from '../Tasl/Tasl';
import Image from '../Image/Image';

const StaticWorksContent = () => (
  <Fragment>
    <div className={`row ${spacing({s: 3, m: 5}, {padding: ['top']})}`}>
      <div className="container">
        <div className="grid">
          <div className="grid__cell">
            <h3 className={font({s: 'WB6', m: 'WB4'})}>Feeling curious?</h3>
            <p className={`${spacing({s: 2}, {margin: ['bottom']})} ${font({s: 'HNL4', m: 'HNL3'})}`}>Discover our collections through these topics.</p>
            <div className={spacing({s: 4}, {margin: ['bottom']})}>
              <Tags tags={[
                {text: 'Quacks', url: '/works?query=quack+OR+quacks'},
                {text: 'James Gillray', url: '/works?query=james+gillray'},
                {text: 'Botany', url: '/works?query=botany'},
                {text: 'Optics', url: '/works?query=optics'},
                {text: 'Sun', url: '/works?query=sun'},
                {text: 'Health', url: '/works?query=health'},
                {text: 'Paintings', url: '/works?query=paintings'},
                {text: 'Science', url: '/works?query=science'}
              ]} />
            </div>
            <hr className={`divider divider--dashed ${spacing({s: 6}, {margin: ['bottom']})}`} />
          </div>
        </div>
      </div>
    </div>
    <div className={`row bg-cream row--has-wobbly-background ${spacing({s: 10}, {padding: ['bottom']})}`}>
      <div className="container">
        <div className="row__wobbly-background"></div>
        <div className="grid grid--dividers">
          <div className={grid({s: 12, m: 10, l: 7, xl: 7})}>
            <h2 className={`${font({s: 'WB6', m: 'WB4'})} ${spacing({s: 6}, {margin: ['bottom']})} ${spacing({s: 0}, {margin: ['top']})}`}>About the historical images</h2>
            <div className="body-content">
              <div className={`standfirst ${font({s: 'HNL3', m: 'HNL2'})}`}>
                <p>These artworks and photographs are from the library at Wellcome Collection and have been collected over several decades. </p>
              </div>

              <p>Most of the works were acquired between 1890 and 1936 by Sir Henry Wellcome and his agents across the globe. The images reflect Wellcome’s collecting interests and were intended to form a documentary resource that reflects the cultural and historical contexts of health and medicine.</p>

              <p>You may find some of these representations of people and cultures offensive or distressing. On occasion individuals are depicted as research subjects, and the collection includes images of nakedness, medical conditions and surgical interventions.</p>

              <p>Wellcome had a personal interest in medical and ethnographic objects and the objects, artworks and photographs he collected were initially presented in the Wellcome Historical Medical Museum. Over the subsequent decades the library and its collections developed to become Wellcome Collection as it now is: a free museum and library exploring health, life and our place in the world.</p>

              <p>Many of the images on this site were digitised during the 1990s, and first made available online in 2002. Recent developments to the site have made these images more easily discoverable, but have also made the sensitive nature of some content more visible, and revealed the poor quality of some of the early digitisation.</p>

              <p>As we make more images from our collections available over the coming months, we will identify and consider these issues in a systematic and consistent manner. We want to include a range of voices from inside and outside Wellcome Collection to help us with this. If you would like to get involved or have information about an image which might help us to understand it better, please email <a href="mailto:collections@wellcome.ac.uk">collections@wellcome.ac.uk</a>.</p>
            </div>
          </div>
          <div className={`${grid({s: 12, m: 8, l: 5, xl: 5})} ${spacing({s: 1}, {margin: ['bottom']})}`}>
            <CaptionedImage caption='Sir Henry Solomon Wellcome (1853&ndash;1936). Pharmacist, entrepreneur, philanthropist and collector.'>
              <Image
                contentUrl='https://s3-eu-west-1.amazonaws.com/miro-images-public/V0027000/V0027772.jpg'
                width={1600}
                alt='Portrait of Henry Wellcome'
                lazyload={true} />
              <Tasl
                contentUrl='https://s3-eu-west-1.amazonaws.com/miro-images-public/V0027000/V0027772.jpg'
                isFull={false}
                title='Sir Henry Solomon Wellcome. Photograph by Lafayette Ltd'
                sourceName='Wellcome Collection'
                sourceLink='https://wellcomecollection.org/works/a2d9ywt8' />
            </CaptionedImage>
          </div>
        </div>
      </div>
    </div>
  </Fragment>
);

export default StaticWorksContent;
