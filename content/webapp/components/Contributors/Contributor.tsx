import { FunctionComponent } from 'react';
import styled from 'styled-components';
import { font, grid } from '@weco/common/utils/classnames';
import { Contributor as ContributorType } from '../../types/contributors';
import LinkLabels from '@weco/common/views/components/LinkLabels/LinkLabels';
import PrismicHtmlBlock from '@weco/common/views/components/PrismicHtmlBlock/PrismicHtmlBlock';
import Space from '@weco/common/views/components/styled/Space';
import PrismicImage from '@weco/common/views/components/PrismicImage/PrismicImage';
import { getCrop } from '@weco/common/model/image';

const ContributorInfoWrapper = styled(Space)`
  color: ${props => props.theme.color('neutral.600')};
`;

const ContributorNameWrapper = styled.div`
  display: flex;
  align-items: baseline;
`;

const Contributor: FunctionComponent<ContributorType> = ({
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
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  transform: 'rotateZ(6deg) scale(1.2)',
                }}
              >
                {/*
                  Contributor images should always be in black-and-white. Most
                  of them are uploaded this way in Prismic, but we can
                  additionally add a filter here to catch any that are missed.
                */}
                <PrismicImage
                  image={contributorImage}
                  maxWidth={72}
                  quality="low"
                  desaturate={true}
                />
              </div>
            </div>
          )}
          {contributorImage && contributor.type === 'organisations' && (
            <div style={{ width: '72px' }}>
              {/*
                For now don't desaturate organisation images, brands can be picky
                about that sort of thing.
              */}
              <PrismicImage
                image={contributorImage}
                maxWidth={72}
                quality="low"
                desaturate={false}
              />
            </div>
          )}
        </Space>
        <div>
          <ContributorNameWrapper>
            <h3 className={`${font('intb', 4)} no-margin`}>
              {contributor.name}
            </h3>
            {contributor.type === 'people' && contributor.pronouns && (
              <ContributorInfoWrapper
                h={{ size: 's', properties: ['margin-left'] }}
                className={font('intr', 5)}
              >
                ({contributor.pronouns})
              </ContributorInfoWrapper>
            )}
          </ContributorNameWrapper>

          {role && role.title && (
            <ContributorInfoWrapper className={font('intb', 5)}>
              {role.title}
            </ContributorInfoWrapper>
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
              className={`${font('intr', 5)} spaced-text`}
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
