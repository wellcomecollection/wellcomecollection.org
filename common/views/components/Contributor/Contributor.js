// @flow
import {font, grid, spacing, classNames} from '../../../utils/classnames';
import Image from '../Image/Image';
import Avatar from '../Avatar/Avatar';
import LinkLabels from '../LinkLabels/LinkLabels';
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
        <div style={{minWidth: '78px'}} className={spacing({ s: 2 }, { margin: ['right'] })}>
          {contributor.type === 'people' && <Avatar imageProps={imageProps} />}
          {contributor.type !== 'people' &&
            <div style={{width: '72px'}}>
              <Image {...imageProps} extraClasses={'width-inherit'} />
            </div>
          }
        </div>
        <div>
          {contributor.type === 'organisations' && contributor.url &&
            <h3 className={classNames({
              [font({s: 'HNM3'})]: true,
              'no-margin': true
            })}>
              <a className='plain-link' href={contributor.url}>{contributor.name}</a>
            </h3>
          }
          {!contributor.url &&
            <h3 className={classNames({
              [font({s: 'HNM3'})]: true,
              'no-margin': true
            })}>
              {contributor.name}
            </h3>
          }
          {role && role.title &&
            <div className={'font-pewter ' + font({s: 'HNM4'})}>
              {role.title}
            </div>
          }

          {contributor.sameAs.length > 0 &&
            <LinkLabels items={
              contributor.sameAs.map(({link, title}) => ({ url: link, text: title }))
            } />
          }

          {descriptionToRender &&
            <div className={classNames({
              [spacing({s: 1}, {margin: ['top']})]: true,
              [font({s: 'HNL4'})]: true,
              'spaced-text': true})}>
              <PrismicHtmlBlock html={descriptionToRender} />
            </div>
          }
        </div>
      </div>
    </div>
  );
};

export default Contributor;
