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
import EventPromo from '@weco/content/views/components/EventPromo';
import MoreLink from '@weco/content/views/components/MoreLink';
import StoryPromo from '@weco/content/views/components/StoryPromo';

import BookPromo from './CardGrid.BookPromo';
import DailyTourPromo from './CardGrid.DailyTourPromo';
import ExhibitionGuideLinksPromo from './CardGrid.ExhibitionGuideLinksPromo';
import ExhibitionGuidePromo from './CardGrid.ExhibitionGuidePromo';
import ExhibitionPromo from './CardGrid.ExhibitionPromo';

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
    <div>
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
              {item.id === 'tours' && <DailyTourPromo />}

              {item.type === 'exhibitions' && (
                <ExhibitionPromo exhibition={item} position={i} />
              )}
              {item.id !== 'tours' && item.type === 'events' && (
                <EventPromo
                  event={item}
                  position={i}
                  fromDate={fromDate}
                  isInPastListing={isInPastListing}
                />
              )}
              {item.type === 'Article' && (
                <StoryPromo
                  variant="contentApi"
                  article={item}
                  hidePromoText={hidePromoText}
                />
              )}
              {item.type === 'articles' && (
                <StoryPromo
                  variant="prismic"
                  article={item}
                  hidePromoText={hidePromoText}
                />
              )}
              {(item.type === 'exhibition-guides' ||
                item.type === 'exhibition-highlight-tours' ||
                item.type === 'exhibition-texts') && (
                <ExhibitionGuidePromo exhibitionGuide={item} />
              )}
              {item.type === 'exhibition-guides-links' && (
                <ExhibitionGuideLinksPromo exhibitionGuide={item} />
              )}
              {item.type === 'books' && <BookPromo book={item} />}
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
