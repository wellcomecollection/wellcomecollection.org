import { FunctionComponent, ReactElement } from 'react';

import { classNames } from '@weco/common/utils/classnames';
import {
  ContaineredLayout,
  gridSize12,
} from '@weco/common/views/components/Layout';
import { Container } from '@weco/common/views/components/styled/Container';
import { Grid, GridCell } from '@weco/common/views/components/styled/Grid';
import Space from '@weco/common/views/components/styled/Space';
import { Article } from '@weco/content/services/wellcome/content/types/api';
import { convertItemToCardProps } from '@weco/content/types/card';
import { Link } from '@weco/content/types/link';
import { MultiContent } from '@weco/content/types/multi-content';
import Card from '@weco/content/views/components/Card';
import EventCard from '@weco/content/views/components/EventCard';
import MoreLink from '@weco/content/views/components/MoreLink';
import StoryCard from '@weco/content/views/components/StoryCard';

import BookCard from './CardGrid.BookCard';
import DailyTourCard from './CardGrid.DailyTourCard';
import ExhibitionCard from './CardGrid.ExhibitionCard';
import ExhibitionGuideCard from './CardGrid.ExhibitionGuideCard';
import ExhibitionGuideLinksCard from './CardGrid.ExhibitionGuideLinksCard';

type Props = {
  items: readonly MultiContent[] | Article[];
  hidePromoText?: boolean;
  itemsPerRow: number;
  itemsHaveTransparentBackground?: boolean;
  links?: Link[];
  fromDate?: Date;
  optionalComponent?: ReactElement;
  isInPastListing?: boolean;
};

const CardGrid: FunctionComponent<Props> = ({
  items,
  hidePromoText,
  itemsPerRow,
  itemsHaveTransparentBackground = false,
  links,
  fromDate,
  optionalComponent,
  isInPastListing,
}: Props) => {
  const gridColumns = itemsPerRow === 4 ? 3 : 4;

  return (
    <div data-component="card-grid">
      <Container>
        <Grid>
          {items.map((item, i) => (
            <GridCell
              className={classNames({
                'card-theme card-theme--transparent':
                  itemsHaveTransparentBackground,
              })}
              key={item.id}
              $sizeMap={{
                s: [12],
                m: [6],
                l: [gridColumns],
                xl: [gridColumns],
              }}
            >
              {item.id === 'tours' && <DailyTourCard />}

              {item.type === 'exhibitions' && (
                <ExhibitionCard exhibition={item} position={i} />
              )}
              {item.id !== 'tours' && item.type === 'events' && (
                <EventCard
                  event={item}
                  position={i}
                  fromDate={fromDate}
                  isInPastListing={isInPastListing}
                />
              )}
              {item.type === 'Article' && (
                <StoryCard
                  variant="contentApi"
                  article={item}
                  hidePromoText={hidePromoText}
                />
              )}
              {item.type === 'articles' && (
                <StoryCard
                  variant="prismic"
                  article={item}
                  hidePromoText={hidePromoText}
                />
              )}
              {(item.type === 'exhibition-guides' ||
                item.type === 'exhibition-highlight-tours' ||
                item.type === 'exhibition-texts') && (
                <ExhibitionGuideCard exhibitionGuide={item} />
              )}
              {item.type === 'exhibition-guides-links' && (
                <ExhibitionGuideLinksCard exhibitionGuide={item} />
              )}
              {item.type === 'books' && <BookCard book={item} />}
              {(item.type === 'pages' ||
                item.type === 'series' ||
                item.type === 'projects' ||
                item.type === 'guides') && (
                <Card item={convertItemToCardProps(item)} />
              )}
              {item.type === 'visual-stories' && (
                <Card item={convertItemToCardProps(item)} />
              )}
            </GridCell>
          ))}
        </Grid>
      </Container>
      {links && links.length > 0 && (
        <ContaineredLayout gridSizes={gridSize12()}>
          <Space $v={{ size: 'l', properties: ['margin-top'] }}>
            {optionalComponent}
            {links.map(link => (
              <Space
                key={link.url}
                $v={{
                  size: `${optionalComponent ? 'l' : 'm'}`,
                  properties: ['margin-top'],
                }}
              >
                <MoreLink url={link.url} name={link.text} />
              </Space>
            ))}
          </Space>
        </ContaineredLayout>
      )}
    </div>
  );
};

export default CardGrid;
