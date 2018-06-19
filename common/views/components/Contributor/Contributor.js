// @flow
import {font, grid} from '../../../utils/classnames';
import Image from '../Image/Image';
import PrismicHtmlBlock from '../PrismicHtmlBlock/PrismicHtmlBlock';
import type {Contributor as ContributorType} from '../../../model/contributors';
import type {Props as ImageProps} from '../Image/Image';

const Contributor = ({
  contributor,
  role,
  description
}: ContributorType) => {
  const imageProps: ImageProps = contributor.type === 'organisations' ? {
    width: 64,
    height: 64,
    contentUrl: contributor.image && contributor.image.contentUrl,
    alt: `Logo for ${contributor.name}`
  } : {
    width: 64,
    height: 64,
    contentUrl: contributor.image && contributor.image.contentUrl,
    alt: `Photograph of ${contributor.name}`
  };
  return (
    <div className='grid'>
      {imageProps.contentUrl &&
        <div className={`${grid({ s: 2, m: 2, l: 2, xl: 2 })}`}>
          {/*
            This definitely passes as it is explicitly `ImageProps`,
            but because of an error in flow, it fails.
            There is a fix going into flow, so we can remove this when it hits
            a stable release.

            https://github.com/facebook/flow/issues/2405
          */}
          {/* $FlowFixMe */}
          <Image {...imageProps} />
        </div>
      }
      <div className={`${grid({ s: 10, m: 10, l: 10, xl: 10 })}`}>
        {contributor.type === 'organisations' && contributor.url &&
          <div className={font({s: 'WB6'})}>
            <a href={contributor.url}>{contributor.name}</a>
          </div>
        }
        {!contributor.url &&
          <div className={font({s: 'WB6'})}>
            {contributor.name}
          </div>
        }
        {role && role.title &&
          <div className={font({s: 'HNL4'})}>
            {role.title}
          </div>
        }
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
