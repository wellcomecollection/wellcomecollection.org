// @flow
import {font, spacing} from '../../../utils/classnames';
import Image from '../Image/Image';
import PrismicHtmlBlock from '../PrismicHtmlBlock/PrismicHtmlBlock';
import type {Contributor as ContributorType} from '../../../model/contributors';
import type {Props as ImageProps} from '../Image/Image';

const Contributor = ({ contributor, role, description }: ContributorType) => {
  const width = 64;
  const imageProps: ImageProps = contributor.type === 'organisations' ? {
    width,
    contentUrl: contributor.image && contributor.image.contentUrl,
    alt: `Logo for ${contributor.name}`,
    lazyload: true
  } : {
    width,
    contentUrl: contributor.image && contributor.image.contentUrl,
    alt: `Photograph of ${contributor.name}`,
    lazyload: true
  };
  return (
    <div className='flex'>
      {/*
        This definitely passes as it is explicitly `ImageProps`,
        but because of an error in flow, it fails.
        There is a fix going into flow, so we can remove this when it hits
        a stable release.

        https://github.com/facebook/flow/issues/2405
      */}
      {/* $FlowFixMe */}
      {imageProps.contentUrl &&
        <div
          style={{ width, height: width }}
          className={`${spacing({s: 2}, {margin: ['right']})}`}>
          <Image {...imageProps} />
        </div>
      }
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
