// @flow
import { font, grid, classNames } from '../../../utils/classnames';
import Image from '../Image/Image';
// $FlowFixMe (tsx)
import Avatar from '../Avatar/Avatar';
// $FlowFixMe (tsx)
import LinkLabels from '../LinkLabels/LinkLabels';
import PrismicHtmlBlock from '../PrismicHtmlBlock/PrismicHtmlBlock';
import type { Contributor as ContributorType } from '../../../model/contributors';
import type { Props as ImageProps } from '../Image/Image';
// $FlowFixMe (tsx)
import Space from '../styled/Space';

const Contributor = ({ contributor, role, description }: ContributorType) => {
  const descriptionToRender = description || contributor.description;
  const imageProps: ImageProps =
    contributor.type === 'organisations'
      ? {
          width: 78,
          contentUrl: contributor.image && contributor.image.contentUrl,
          alt: `Logo for ${contributor.name}`,
          tasl: null,
        }
      : {
          width: 78,
          height: 78,
          contentUrl: contributor.image && contributor.image.contentUrl,
          alt: `Photograph of ${contributor.name}`,
          tasl: null,
        };

  return (
    <div className="grid">
      <div className={`flex ${grid({ s: 12, m: 12, l: 12, xl: 12 })}`}>
        <Space
          style={{ minWidth: '78px' }}
          h={{ size: 'm', properties: ['margin-right'] }}
        >
          {contributor.type === 'people' && <Avatar imageProps={imageProps} />}
          {contributor.type !== 'people' && (
            <div style={{ width: '72px' }}>
              <Image {...imageProps} extraClasses={'width-inherit'} />
            </div>
          )}
        </Space>
        <div>
          {contributor.type === 'organisations' && contributor.url && (
            <h3
              className={classNames({
                [font('hnb', 4)]: true,
                'no-margin': true,
              })}
            >
              <a className="plain-link" href={contributor.url}>
                {contributor.name}
              </a>
            </h3>
          )}
          {!contributor.url && (
            <div className={`flex flex--h-baseline`}>
              <h3
                className={classNames({
                  [font('hnb', 4)]: true,
                  'no-margin': true,
                })}
              >
                {contributor.name}
              </h3>
              {contributor.pronouns && (
                <Space
                  h={{ size: 's', properties: ['margin-left'] }}
                  className={classNames({
                    [font('hnr', 5)]: true,
                    'font-pewter': true,
                  })}
                >
                  ({contributor.pronouns})
                </Space>
              )}
            </div>
          )}
          {role && role.title && (
            <div className={'font-pewter ' + font('hnb', 5)}>{role.title}</div>
          )}

          {contributor.sameAs.length > 0 && (
            <LinkLabels
              items={contributor.sameAs.map(({ link, title }) => ({
                url: link,
                text: title,
              }))}
            />
          )}

          {descriptionToRender && (
            <Space
              v={{
                size: 's',
                properties: ['margin-top'],
              }}
              className={classNames({
                [font('hnr', 5)]: true,
                'spaced-text': true,
              })}
            >
              <PrismicHtmlBlock html={descriptionToRender} />
            </Space>
          )}
        </div>
      </div>
    </div>
  );
};

export default Contributor;
