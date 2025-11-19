import { FunctionComponent } from 'react';
import styled from 'styled-components';

import { getCrop } from '@weco/common/model/image';
import linkResolver from '@weco/common/services/prismic/link-resolver';
import { transformImage } from '@weco/common/services/prismic/transformers/images';
import { font } from '@weco/common/utils/classnames';
import HTMLDateAndTime from '@weco/common/views/components/HTMLDateAndTime';
import LabelsList from '@weco/common/views/components/LabelsList';
import PrismicImage, {
  BreakpointSizes,
} from '@weco/common/views/components/PrismicImage';
import { Grid, GridCell } from '@weco/common/views/components/styled/Grid';
import Space from '@weco/common/views/components/styled/Space';
import { Article } from '@weco/content/services/wellcome/content/types/api';

const StoryWrapper = styled(Space).attrs({
  $v: { size: 'xl', properties: ['padding-bottom'] },
})`
  display: block;
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

const ImageWrapper = styled(GridCell).attrs({
  $sizeMap: { s: [12], m: [6], l: [4], xl: [4] },
})`
  position: relative;
  margin-bottom: ${props => props.theme.spacingUnit * 2}px;
`;

const DesktopLabel = styled(Space).attrs({
  $v: { size: 's', properties: ['margin-bottom'] },
})`
  ${props => props.theme.media('medium', 'max-width')`
      display: none;
    `}
`;

const MobileLabel = styled.div`
  position: absolute;
  bottom: 0;
  left: 18px;

  ${props => props.theme.media('medium')`
      display: none;
    `}
`;

const StoryInformation = styled(Space).attrs({
  className: font('intr', 5),
  $v: { size: 'xs', properties: ['margin-bottom'] },
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
  articles: Article[];
  dynamicImageSizes?: BreakpointSizes;
};

const StoriesGrid: FunctionComponent<Props> = ({
  articles,
  dynamicImageSizes,
}: Props) => {
  return (
    <div>
      {articles.map((article, index) => {
        const image = transformImage(article.image);
        const croppedImage = getCrop(image, '16:9');

        return (
          <StoryWrapper
            key={article.id}
            as="a"
            href={linkResolver({ ...article, type: 'articles' })}
            data-testid="story-search-result"
            data-gtm-trigger="stories_search_result"
            data-gtm-position-in-list={index + 1}
          >
            <Grid>
              {croppedImage && (
                <ImageWrapper $sizeMap={{ s: [12], m: [6], l: [4], xl: [4] }}>
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
                  <MobileLabel>
                    <LabelsList labels={[{ text: article.format.label }]} />
                  </MobileLabel>
                </ImageWrapper>
              )}
              <GridCell $sizeMap={{ s: [12], m: [6], l: [8], xl: [8] }}>
                <DesktopLabel>
                  <LabelsList labels={[{ text: article.format.label }]} />
                </DesktopLabel>

                <h3 className={font('wb', 4)}>{article.title}</h3>

                {(article.publicationDate || !!article.contributors.length) && (
                  <StoryInformation>
                    {article.publicationDate && (
                      <StoryInformationItem className="searchable-selector">
                        <HTMLDateAndTime
                          variant="date"
                          date={new Date(article.publicationDate)}
                        />
                      </StoryInformationItem>
                    )}
                    {!!article.contributors.length && (
                      <>
                        <StoryInformationItemSeparator>
                          {' | '}
                        </StoryInformationItemSeparator>
                        <StoryInformationItem>
                          {article.contributors.map(contributor => (
                            <span key={contributor.contributor?.id}>
                              {contributor.contributor?.label}
                            </span>
                          ))}
                        </StoryInformationItem>
                      </>
                    )}
                  </StoryInformation>
                )}
                {article.caption && (
                  <p className={font('intr', 5)}>{article.caption}</p>
                )}
              </GridCell>
            </Grid>
          </StoryWrapper>
        );
      })}
    </div>
  );
};

export default StoriesGrid;
