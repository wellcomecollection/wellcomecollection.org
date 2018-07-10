// @flow
import {font, grid, spacing} from '../../../utils/classnames';
import Image from '../Image/Image';
import PrismicHtmlBlock from '../PrismicHtmlBlock/PrismicHtmlBlock';
import type {Contributor as ContributorType} from '../../../model/contributors';
import type {Props as ImageProps} from '../Image/Image';

const Contributor = ({
  contributor,
  role,
  description
}: ContributorType) => {
  const descriptionToRender = description || contributor.description;
  const imageProps: ImageProps = contributor.type === 'organisations' ? {
    width: 78,
    height: 78,
    contentUrl: contributor.image && contributor.image.contentUrl,
    alt: `Logo for ${contributor.name}`
  } : {
    width: 78,
    height: 78,
    contentUrl: contributor.image && contributor.image.contentUrl,
    alt: `Photograph of ${contributor.name}`
  };

  return (
    <div className='grid'>
      {imageProps.contentUrl &&
        <div className={`${grid({ s: 2, m: 2, l: 2, xl: 2 })}`}>
          <div className={contributor.type === 'people' ? 'rotated-rounded-corners' : ''}>
            <Image {...imageProps} />
          </div>
        </div>
      }
      <div className={`${grid({ s: 10, m: 10, l: 10, xl: 10 })}`}>
        {contributor.type === 'organisations' && contributor.url &&
          <div className={font({s: 'HNM3'})}>
            <a className='plain-link' href={contributor.url}>{contributor.name}</a>
          </div>
        }
        {!contributor.url &&
          <div className={font({s: 'HNM3'})}>
            {contributor.name}
          </div>
        }
        {role && role.title &&
          <div className={'font-pewter ' + font({s: 'HNM4'})}>
            <b>{role.title}</b>
          </div>
        }
        {descriptionToRender &&
          <div className={[spacing({s: 1}, {margin: ['top']}), font({s: 'HNL4'})].join(' ')}>
            <PrismicHtmlBlock html={descriptionToRender} />
          </div>
        }
      </div>
    </div>
  );
};

export default Contributor;
