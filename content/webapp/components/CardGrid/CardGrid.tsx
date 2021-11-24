import { FunctionComponent } from 'react';
import Moment from 'moment';
import { classNames, cssGrid } from '@weco/common/utils/classnames';
import { Link } from '@weco/common/model/link';
import { convertItemToCardProps } from '@weco/common/model/card';
import { ArticleScheduleItem } from '@weco/common/model/article-schedule-items';
import { Exhibition, UiExhibition } from '@weco/common/model/exhibitions';
import { UiEvent } from '@weco/common/model/events';
import { Book } from '@weco/common/model/books';
import { Article } from '@weco/common/model/articles';
import { Page } from '@weco/common/model/pages';
import { ArticleSeries } from '@weco/common/model/article-series';
import EventPromo from '@weco/common/views/components/EventPromo/EventPromo';
import BookPromo from '@weco/common/views/components/BookPromo/BookPromo';
import Layout12 from '@weco/common/views/components/Layout12/Layout12';
import MoreLink from '@weco/common/views/components/MoreLink/MoreLink';
import Space from '@weco/common/views/components/styled/Space';
import CssGridContainer from '@weco/common/views/components/styled/CssGridContainer';
import Card from '@weco/common/views/components/Card/Card';
import ExhibitionPromo from '../ExhibitionPromo/ExhibitionPromo';
import StoryPromo from '../StoryPromo/StoryPromo';

import DailyTourPromo from './DailyTourPromo';

// TODO: This should be MultiContent
type ContentTypes =
  | UiEvent
  | UiExhibition
  | Exhibition
  | Book
  | Article
  | Page
  | ArticleSeries
  | ArticleScheduleItem;

type Props = {
  items: readonly ContentTypes[];
  hidePromoText?: boolean;
  itemsPerRow: number;
  itemsHaveTransparentBackground?: boolean;
  links?: Link[];
  fromDate?: typeof Moment;
};

const CardGrid: FunctionComponent<Props> = ({
  items,
  hidePromoText,
  itemsPerRow,
  itemsHaveTransparentBackground = false,
  links,
  fromDate,
}: Props) => {
  const gridColumns = itemsPerRow === 4 ? 3 : 4;
  return (
    <div>
      <CssGridContainer>
        <div className="css-grid">
          {items.map((item, i) => (
            <div
              key={item.id}
              className={classNames({
                [cssGrid({
                  s: 12,
                  m: 6,
                  l: gridColumns,
                  xl: gridColumns,
                })]: true,
                'card-theme card-theme--transparent':
                  itemsHaveTransparentBackground,
              })}
            >
              {item.id === 'tours' && <DailyTourPromo />}

              {item.type === 'exhibitions' && (
                <ExhibitionPromo
                  id={item.id}
                  url={`/exhibitions/${item.id}`}
                  title={item.title}
                  shortTitle={item.shortTitle}
                  format={item.format}
                  image={
                    item.promoImage
                      ? { ...item.promoImage, crops: {} }
                      : undefined
                  }
                  start={!item.isPermanent ? item.start : undefined}
                  end={!item.isPermanent ? item.end : undefined}
                  statusOverride={item.statusOverride}
                  position={i}
                />
              )}
              {item.id !== 'tours' && item.type === 'events' && (
                <EventPromo event={item} position={i} fromDate={fromDate} />
              )}
              {item.type === 'articles' && (
                <StoryPromo
                  item={item}
                  position={i}
                  hidePromoText={hidePromoText}
                />
              )}
              {item.type === 'books' && (
                <BookPromo
                  url={`/books/${item.id}`}
                  title={item.title}
                  subtitle={item.subtitle}
                  description={item.promoText}
                  image={item.cover}
                />
              )}
              {(item.type === 'pages' || item.type === 'series') && (
                <Card item={convertItemToCardProps(item)} />
              )}
            </div>
          ))}
        </div>
      </CssGridContainer>
      {links && links.length > 0 && (
        <Layout12>
          <Space v={{ size: 'l', properties: ['margin-top'] }}>
            {links.map(link => (
              <Space
                v={{ size: 'm', properties: ['margin-top'] }}
                key={link.url}
              >
                <MoreLink url={link.url} name={link.text} />
              </Space>
            ))}
          </Space>
        </Layout12>
      )}
    </div>
  );
};

export default CardGrid;
