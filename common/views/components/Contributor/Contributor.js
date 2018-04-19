// @flow
import {font, spacing} from '../../../utils/classnames';
import Image from '../Image/Image';
import PrismicHtmlBlock from '../PrismicHtmlBlock/PrismicHtmlBlock';
import type {Contributor as ContributorType} from '../../../model/contributors';

const Contributor = ({ contributor, role, description }: ContributorType) => {
  const width = 64;
  const imageProps = contributor.type === 'organisations' ? {
    width,
    contentUrl: contributor.image.url,
    alt: `Logo for ${contributor.name}`,
    lazyload: false
  } : {
    width,
    contentUrl: contributor.image && contributor.image.contentUrl,
    alt: `Photograph of ${contributor.name}`,
    lazyload: false
  };
  return (
    <div className='flex'>
      {imageProps.contentUrl && <div className={`${spacing({s: 2}, {margin: ['right']})}`}><Image {...imageProps} /></div>}
      <div style={{ flexGrow: 1 }}>
        <div className={font({s: 'WB6'})}>
          {contributor.name}
        </div>
        {description &&
          <div className={font({s: 'HNL4'})}>
            <PrismicHtmlBlock html={description} />
          </div>
        }
      </div>
    </div>
  );
};

export default Contributor;
