import { FunctionComponent } from 'react';
import styled from 'styled-components';

import Space from '@weco/common/views/components/styled/Space';
import LabelsList from '@weco/common/views/components/LabelsList/LabelsList';
import { font } from '@weco/common/utils/classnames';
import HTMLDate from '@weco/common/views/components/HTMLDate/HTMLDate';
import { Story } from '@weco/catalogue/services/prismic/types/story';
import PrismicImage, {
  BreakpointSizes,
} from '@weco/common/views/components/PrismicImage/PrismicImage';

const StoriesContainer = styled.div<{ isDetailed?: boolean }>`
  display: flex;
  flex-direction: ${props => (props.isDetailed ? 'column' : 'row')};
  flex-wrap: wrap;

  ${props => props.theme.media('large')`
      flex-wrap: nowrap;
  `}
`;

const StoryWrapper = styled(Space).attrs<{
  isDetailed?: boolean;
}>(props => ({
  v: { size: 'xl', properties: [props.isDetailed ? 'padding-bottom' : ''] },
}))<{ isDetailed?: boolean }>`
  display: flex;
  flex-direction: ${props => (props.isDetailed ? 'row' : 'column')};
  align-items: flex-start;

  ${props =>
    props.isDetailed
      ? `flex-wrap: wrap;`
      : `
        margin-right: 20px; 
        flex-basis: calc(50% - 10px);

        &:nth-child(2n) {
            margin-right: 0;
        }
    `};

  text-decoration: none;

  &:last-child {
    padding-bottom: 0;
  }

  &:hover {
    h3 {
      text-decoration: underline;
    }
  }

  ${props =>
    props.theme.media('medium')(`
        flex-wrap: nowrap;
  `)}

  ${props =>
    props.theme.media('large')(`
    ${
      props.isDetailed
        ? ``
        : `
              margin-right: 30px; 
              flex-basis: calc(25% - 20px);

              &:nth-child(2n) {
                  margin-right: 20px;
              }

              &:last-child {
                  margin-right: 0;
              }     
          `
    };
    `)}
`;

const ImageWrapper = styled.div<{ isDetailed?: boolean }>`
  position: relative;
  flex: 1 1 auto;
  margin-bottom: ${props => props.theme.spacingUnit * 2}px;

  height: ${props => (props.isDetailed ? 'auto' : '160px')};
  max-height: ${props => (props.isDetailed ? '250px' : '160px')};
  width: ${props => (props.isDetailed ? 'auto' : '100%')};
  max-width: 100%;

  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;

  & > div {
    height: 100%;
    width: 100%;

    ${props =>
      props.isDetailed
        ? ``
        : `
          img {
              object-fit: cover;
              height: 100%;
          }
      `}
  }

  ${props =>
    props.theme.media('medium')(`
      max-height: 155px;
      width: 100%;
      
      ${
        props.isDetailed
          ? `
        flex: 1 0 40%;
        margin-right: 1rem; 
        max-width: 275px;
      `
          : ``
      };
      
    `)}
`;

const Details = styled.div`
  flex: 1 1 auto;

  ${props => props.theme.media('medium')`
      max-width: 820px;
    `}
`;

const DesktopLabel = styled(Space).attrs({
  v: { size: 's', properties: ['margin-bottom'] },
})`
  ${props => props.theme.media('medium', 'max-width')`
      display:none;
    `}
`;

const MobileLabel = styled(Space)`
  position: absolute;
  bottom: 0;
  left: 0;

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
      {stories.map(story => (
        <StoryWrapper
          key={story.id}
          as="a"
          href={story.url}
          isDetailed={isDetailed}
        >
          <ImageWrapper isDetailed={isDetailed}>
            <PrismicImage
              image={{
                contentUrl: story.image.url,
                alt: '',
                width: story.image.width,
                height: story.image.height,
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
          <Details>
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
      ))}
    </StoriesContainer>
  );
};

export default StoriesGrid;
