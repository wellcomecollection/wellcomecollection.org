// @flow
import {font, grid, spacing} from '../../../utils/classnames';
import Image from '../Image/Image';
import Avatar from '../Avatar/Avatar';
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
      <div className={`flex ${grid({ s: 12, m: 12, l: 12, xl: 12 })}`}>
        <div style={{width: '78px'}} className={spacing({ s: 2 }, { margin: ['right'] })}>
          {contributor.type === 'people' && <Avatar imageProps={imageProps} />}
          {contributor.type !== 'people' &&
            <Image {...imageProps} extraClasses={'width-inherit'} />
          }
        </div>
        <div>
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
              {role.title}
            </div>
          }
          {descriptionToRender &&
            <div className={[spacing({s: 1}, {margin: ['top']}), font({s: 'HNL4'})].join(' ')}>
              <PrismicHtmlBlock html={descriptionToRender} />
            </div>
          }
        </div>
      </div>
    </div>
  );
};

export default Contributor;
