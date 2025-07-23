import { FunctionComponent } from 'react';
import styled, { css } from 'styled-components';

import { font } from '@weco/common/utils/classnames';
import { convertIiifImageUri } from '@weco/common/utils/convert-image-uri';
import LabelsList from '@weco/common/views/components/LabelsList';
import { ContaineredLayout } from '@weco/common/views/components/Layout';
import { SizeMap } from '@weco/common/views/components/styled/Grid';
import Space from '@weco/common/views/components/styled/Space';
import ScrollContainer from '@weco/content/views/components/ScrollContainer';
import WorkLink from '@weco/content/views/components/WorkLink';
import { ContentAPILinkedWork } from '@weco/content/views/pages/stories/story/tempMockData';

const FullWidthRow = styled(Space).attrs({
  $v: { size: 'l', properties: ['padding-top', 'padding-bottom'] },
})`
  background-color: ${props => props.theme.color('warmNeutral.300')};
`;

const clampLineStyles = css<{ $linesToClamp: number }>`
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: ${props => props.$linesToClamp};
`;

const Card = styled.a`
  display: flex;
  padding: ${props => props.theme.spacingUnits['3']}px;
  background-color: ${props => props.theme.color('white')};
  border-radius: ${props => props.theme.borderRadiusUnit}px;
  flex-wrap: wrap;
  text-decoration: none;

  ${props => props.theme.media('medium')`
    max-height: 10rem;
    flex-wrap: nowrap;
    justify-content: space-between;
  `}

  ${props => props.theme.media('large')`
    max-height: unset;
    height: 10rem;
  `}
`;

const TextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  container-type: inline-size;
  container-name: text-wrapper;

  ${props => props.theme.media('medium')`
    padding-top: 0;
  `}

  ul {
    flex-wrap: nowrap;
  }

  li > div {
    justify-content: space-between;

    @container text-wrapper (min-width: 0) {
      /*
      The line below allows us to truncated the labels based on their lengths so that
      e.g. 'Archives and manuscripts' is truncated but 'Digital images' is not.
      */
      max-width: calc(100cqw - calc(var(--label-length) * 0.25ch));
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
`;

const Title = styled.h2.attrs({
  className: font('intb', 5),
})<{ $linesToClamp: number }>`
  ${clampLineStyles};
  margin-top: ${props => props.theme.spacingUnits['1']}px;

  ${Card}:hover & {
    text-decoration: underline;
  }
`;

const LineClamp = styled.div<{ $linesToClamp: number }>`
  ${clampLineStyles};
`;

const ImageWrapper = styled.div`
  width: 100%;
  max-height: 250px;
  order: -1;
  margin-bottom: ${props => props.theme.spacingUnits['5']}px;
  display: flex;

  img {
    display: block;
    object-fit: contain;
    width: 100%;
    max-width: 200px; /* The size of the IIIF thumbnails */
    margin-left: auto;
    margin-right: auto;
    filter: url('#border-radius-mask');

    ${props =>
      props.theme.media('medium')(`
      margin-left: ${props.theme.spacingUnits['3']}px;
      margin-right: unset;
      width: unset;
      height: 100%;

      max-width: -webkit-fill-available; /* Chrome, Safari, Edge */
      max-width: -moz-available; /* Firefox */
      max-width: stretch; /* Future standard */

      /*
      This is a hack to target Safari only, because -webkit-fill-available is
      the property that _should_ work and is required for Chrome < 138 but causes
      Safari to hide images completely
      */
      @supports (-webkit-appearance: none) and (stroke-color: transparent) {
        max-width: 100%;
      }
    `)}
  }

  ${props => props.theme.media('medium')`
    max-height: unset;
    width: unset;
    max-width: 50%;
    order: unset;
    display: flex;
    justify-content: end;
    margin-bottom: 0;
  `}
`;

const MetaContainer = styled.div.attrs({
  className: font('intr', 6),
})`
  color: ${props => props.theme.color('neutral.600')};
`;

type LinkedWorkCardProps = {
  work: ContentAPILinkedWork;
};

const LinkedWorkCard: FunctionComponent<LinkedWorkCardProps> = ({
  work,
}: LinkedWorkCardProps) => {
  return (
    <WorkLink id={work.id} source={`works_search_result_${work.id}`} passHref>
      <Card>
        <TextWrapper>
          <div>
            {/* TODO add isOnline */}
            <LabelsList labels={[{ text: work.type }]} />
            <Title $linesToClamp={3}>{work.title}</Title>
          </div>

          <MetaContainer>
            {work.mainContributor && (
              <LineClamp $linesToClamp={1}>{work.mainContributor}</LineClamp>
            )}
            {work.date && (
              <LineClamp $linesToClamp={1}>Date: {work.date}</LineClamp>
            )}
          </MetaContainer>
        </TextWrapper>

        {work.thumbnailUrl && (
          <ImageWrapper>
            <img
              src={convertIiifImageUri(work.thumbnailUrl, 120)}
              alt={work.title}
              loading="lazy"
              width="200"
              height="200"
            />
          </ImageWrapper>
        )}
      </Card>
    </WorkLink>
  );
};

const Shim = styled.li<{ $gridValues: number[] }>`
  --container-padding: ${props => props.theme.containerPadding.small}px;
  --number-of-columns: ${props => (12 - props.$gridValues[0]) / 2};
  --gap-value: ${props => props.theme.gutter.small}px;

  padding-left: var(--container-padding);
  min-width: calc(
    var(--number-of-columns) *
      (((100% - var(--container-padding)) / 12) + (var(--gap-value) * 11 / 12))
  );

  ${props =>
    props.theme.media('medium')(`
      --container-padding: ${props.theme.containerPadding.medium}px;
      --number-of-columns: ${(12 - props.$gridValues[1]) / 2};
      --gap-value: ${props.theme.gutter.medium}px;
  `)}

  /* TODO consider margin: 0 auto */
  ${props =>
    props.theme.media('large')(`
      --container-padding: ${props.theme.containerPadding.large}px;
      --number-of-columns: ${(12 - props.$gridValues[2]) / 2};
      --gap-value: ${props.theme.gutter.large}px;
  `)}
`;

type LinkedWorkProps = {
  linkedWorks: ContentAPILinkedWork[];
  gridSizes: SizeMap;
};

const ScrollableLinkedWorks: FunctionComponent<LinkedWorkProps> = ({
  linkedWorks,
  gridSizes,
}: LinkedWorkProps) => {
  if (!linkedWorks || linkedWorks.length === 0) return null;
  const gridValues = Object.values(gridSizes).map(v => v[0]);

  return (
    // TODO remove this id
    <FullWidthRow id="featured-works">
      <ContaineredLayout gridSizes={gridSizes as SizeMap}>
        <h2 className={font('wb', 3)}>Featured in this article</h2>
      </ContaineredLayout>

      <ScrollContainer
        label={`${linkedWorks.length} works from our catalogue`}
        gridSizes={gridSizes}
      >
        <Shim $gridValues={gridValues}></Shim>
        {linkedWorks.map(work => (
          <li key={work.id} style={{ marginRight: '20px', flex: '0 0 33%' }}>
            <LinkedWorkCard work={work} />
          </li>
        ))}
      </ScrollContainer>
    </FullWidthRow>
  );
};

export default ScrollableLinkedWorks;
