import { font, grid, classNames } from '@weco/common/utils/classnames';
import { Contributor as ContributorType } from '../../types/contributors';
import LinkLabels from '@weco/common/views/components/LinkLabels/LinkLabels';
import PrismicHtmlBlock from '@weco/common/views/components/PrismicHtmlBlock/PrismicHtmlBlock';
import Space from '@weco/common/views/components/styled/Space';
import PrismicImage from '../PrismicImage/PrismicImage';
import { HTMLString } from '@weco/common/services/prismic/types';

const Contributor = ({ contributor, role, description }: ContributorType) => {
  const descriptionToRender = description || contributor.description;

  return (
    <div className="grid">
      <div className={`flex ${grid({ s: 12, m: 12, l: 12, xl: 12 })}`}>
        <Space
          style={{ minWidth: '78px' }}
          h={{ size: 'm', properties: ['margin-right'] }}
        >
          {contributor.image && contributor.type === 'people' && (
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: 6,
                transform: 'rotateZ(-6deg)',
                overflow: `hidden`,
              }}
            >
              <div
                style={{
                  transform: 'rotateZ(6deg) scale(1.2)',
                }}
              >
                <PrismicImage image={contributor.image} maxWidth={72} />
              </div>
            </div>
          )}
          {contributor.image && contributor.type === 'organisations' && (
            <div style={{ width: '72px' }}>
              <PrismicImage image={contributor.image} maxWidth={72} />
            </div>
          )}
        </Space>
        <div>
          <div className={`flex flex--h-baseline`}>
            <h3
              className={classNames({
                [font('hnb', 4)]: true,
                'no-margin': true,
              })}
            >
              {contributor.name}
            </h3>
            {contributor.type === 'people' && contributor.pronouns && (
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
              <PrismicHtmlBlock html={descriptionToRender as HTMLString} />
            </Space>
          )}
        </div>
      </div>
    </div>
  );
};

export default Contributor;
