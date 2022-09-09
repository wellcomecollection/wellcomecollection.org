import { font, grid, classNames } from '@weco/common/utils/classnames';
import { Contributor as ContributorType } from '../../types/contributors';
import LinkLabels from '@weco/common/views/components/LinkLabels/LinkLabels';
import PrismicHtmlBlock from '@weco/common/views/components/PrismicHtmlBlock/PrismicHtmlBlock';
import Space from '@weco/common/views/components/styled/Space';
import PrismicImage from '@weco/common/views/components/PrismicImage/PrismicImage';
import { getCrop } from '@weco/common/model/image';
import { FC } from 'react';

const Contributor: FC<ContributorType> = ({
  contributor,
  role,
  description,
}: ContributorType) => {
  const descriptionToRender = description || contributor.description;

  // Contributor images should always be square.
  //
  // We prefer the explicit square crop if it's available, but we can't rely on it --
  // it's not defined on all contributors.  If there's no explicit crop, we fall back
  // to the default image (which is often square for contributors anyway).
  const contributorImage =
    getCrop(contributor.image, 'square') || contributor.image;

  return (
    <div className="grid">
      <div className={`flex ${grid({ s: 12, m: 12, l: 12, xl: 12 })}`}>
        <Space
          style={{ minWidth: '78px' }}
          h={{ size: 'm', properties: ['margin-right'] }}
        >
          {contributorImage && contributor.type === 'people' && (
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
                <PrismicImage
                  image={contributorImage}
                  maxWidth={72}
                  quality="low"
                />
              </div>
            </div>
          )}
          {contributorImage && contributor.type === 'organisations' && (
            <div style={{ width: '72px' }}>
              <PrismicImage
                image={contributorImage}
                maxWidth={72}
                quality="low"
              />
            </div>
          )}
        </Space>
        <div>
          <div className="flex flex--h-baseline">
            <h3
              className={classNames({
                [font('intb', 4)]: true,
                'no-margin': true,
              })}
            >
              {contributor.name}
            </h3>
            {contributor.type === 'people' && contributor.pronouns && (
              <Space
                h={{ size: 's', properties: ['margin-left'] }}
                className={classNames({
                  [font('intr', 5)]: true,
                  'font-pewter': true,
                })}
              >
                ({contributor.pronouns})
              </Space>
            )}
          </div>

          {role && role.title && (
            <div className={'font-pewter ' + font('intb', 5)}>{role.title}</div>
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
                [font('intr', 5)]: true,
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
