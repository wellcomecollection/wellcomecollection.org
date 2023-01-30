import { FunctionComponent } from 'react';
import styled from 'styled-components';

import Space from '@weco/common/views/components/styled/Space';
import LabelsList from '@weco/common/views/components/LabelsList/LabelsList';
import { font, grid } from '@weco/common/utils/classnames';
import HTMLDate from '@weco/common/views/components/HTMLDate/HTMLDate';
import { Story } from '@weco/catalogue/services/prismic/types/story';
import PrismicImage, {
  BreakpointSizes,
} from '@weco/common/views/components/PrismicImage/PrismicImage';
import { getCrop } from '@weco/common/model/image';

const StoriesContainer = styled.div.attrs<{ isDetailed?: boolean }>(props => ({
  className: props.isDetailed ? '' : 'grid',
}))<{ isDetailed?: boolean }>``;

const StoryWrapper = styled(Space).attrs<{
  isDetailed?: boolean;
}>(props => ({
  v: { size: 'xl', properties: [props.isDetailed ? 'padding-bottom' : ''] },
  className: props.isDetailed ? 'grid' : grid({ s: 6, m: 6, l: 3, xl: 3 }),
}))<{ isDetailed?: boolean }>`
  text-decoration: none;

  &:last-child {
    padding-bottom: 0;
  }

  &:hover {
    h3 {
      text-decoration: underline;
    }
  }
`;

const ImageWrapper = styled.div.attrs<{ isDetailed?: boolean }>(props => ({
  className: props.isDetailed ? grid({ s: 12, m: 6, l: 4, xl: 4 }) : '',
}))<{ isDetailed?: boolean }>`
  position: relative;
  margin-bottom: ${props => props.theme.spacingUnit * 2}px;
`;

const Details = styled.div.attrs<{ isDetailed?: boolean }>(props => ({
  className: props.isDetailed ? grid({ s: 12, m: 6, l: 8, xl: 8 }) : '',
}))<{ isDetailed?: boolean }>``;

const DesktopLabel = styled(Space).attrs({
  v: { size: 's', properties: ['margin-bottom'] },
})`
  ${props => props.theme.media('medium', 'max-width')`
      display: none;
    `}
`;

const MobileLabel = styled(Space)`
  position: absolute;
  bottom: 0;
  left: 18px;

  ${props => props.theme.media('medium')`
    display: none;
  `}
`;

const StoryInformation = styled(Space).attrs({
  className: font('intr', 5),
  v: { size: 'xs', properties: ['margin-bottom'] },
})`
  color: ${props => props.theme.color('neutral.600')};
`;

const StoryInformationItem = styled.span`
  span {
    &:not(:first-child)::before {
      content: ', ';
    }
  }
`;

// using the adjacent sibling combinator along with parent selector
// to create this thing that applies only if it is the immediate
// sibling after `searchable-selector`
const StoryInformationItemSeparator = styled.span`
  display: none;

  .searchable-selector + & {
    display: inline-block;
    margin: 0 4px;
  }
`;

type Props = {
  stories: Story[];
  dynamicImageSizes?: BreakpointSizes;
  isDetailed?: boolean;
};

const StoriesGrid: FunctionComponent<Props> = ({
  stories,
  dynamicImageSizes,
  isDetailed,
}: Props) => {
  return (
    <StoriesContainer isDetailed={isDetailed}>
      {stories.map(story => {
        const croppedImage = getCrop(
          story.image,
          isDetailed ? '16:9' : '32:15'
        );

        return (
          <StoryWrapper
            key={story.id}
            as="a"
            href={story.url}
            isDetailed={isDetailed}
          >
            {croppedImage && (
              <ImageWrapper isDetailed={isDetailed}>
                <PrismicImage
                  image={{
                    // We intentionally omit the alt text on promos, so screen reader
                    // users don't have to listen to the alt text before hearing the
                    // title of the item in the list.
                    //
                    // See https://github.com/wellcomecollection/wellcomecollection.org/issues/6007
                    ...croppedImage,
                    alt: '',
                  }}
                  sizes={dynamicImageSizes}
                  quality="low"
                />

                {story.type && (
                  <MobileLabel>
                    <LabelsList labels={[story.label]} />
                  </MobileLabel>
                )}
              </ImageWrapper>
            )}
            <Details isDetailed={isDetailed}>
              {story.label && (
                <DesktopLabel>
                  <LabelsList labels={[story.label]} />
                </DesktopLabel>
              )}
              <h3 className={font('wb', 4)}>{story.title}</h3>
              {isDetailed &&
                (story.firstPublicationDate || !!story.contributors.length) && (
                  <StoryInformation>
                    {story.firstPublicationDate && (
                      <StoryInformationItem className="searchable-selector">
                        <HTMLDate date={new Date(story.firstPublicationDate)} />
                      </StoryInformationItem>
                    )}
                    {!!story.contributors.length && (
                      <>
                        <StoryInformationItemSeparator>
                          {' | '}
                        </StoryInformationItemSeparator>
                        <StoryInformationItem>
                          {story.contributors.map(contributor => (
                            <span key={contributor}>{contributor}</span>
                          ))}
                        </StoryInformationItem>
                      </>
                    )}
                  </StoryInformation>
                )}
              {story.summary && (
                <p className={font('intr', 5)}>{story.summary}</p>
              )}
            </Details>
          </StoryWrapper>
        );
      })}
    </StoriesContainer>
  );
};

export default StoriesGrid;
