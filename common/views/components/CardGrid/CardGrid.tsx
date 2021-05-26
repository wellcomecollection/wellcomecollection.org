import { classNames, cssGrid } from '../../../utils/classnames';
import ExhibitionPromo from '../ExhibitionPromo/ExhibitionPromo';
import EventPromo from '../EventPromo/EventPromo';
import DailyTourPromo from '../DailyTourPromo/DailyTourPromo';

import BookPromo from '../BookPromo/BookPromo';

import Layout12 from '../Layout12/Layout12';
import StoryPromo from '../StoryPromo/StoryPromo';

import MoreLink from '../MoreLink/MoreLink';
import { Link } from '../../../model/link';
import { Exhibition, UiExhibition } from '../../../model/exhibitions';
import { UiEvent } from '../../../model/events';
import { Book } from '../../../model/books';
import { Article } from '../../../model/articles';
import { Page } from '../../../model/pages';
import { ArticleSeries } from '../../../model/article-series';

import Space from '../styled/Space';
import CssGridContainer from '../styled/CssGridContainer';
import Moment from 'moment';
import Card from '../Card/Card';
import { convertItemToCardProps } from '@weco/common/model/card';
import { FunctionComponent } from 'react';

// TODO: This should be MultiContent
type ContentTypes =
  | UiEvent
  | UiExhibition
  | Exhibition
  | Book
  | Article
  | Page
  | ArticleSeries;

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
                'card-theme card-theme--transparent': itemsHaveTransparentBackground,
              })}
            >
              {item.id === 'tours' && <DailyTourPromo />}

              {item.type === 'exhibitions' && ( // TODO: (remove Picture type)
                <ExhibitionPromo
                  id={item.id}
                  url={`/exhibitions/${item.id}`}
                  title={item.title}
                  shortTitle={item.shortTitle}
                  format={item.format} // TODO: (remove Picture type)
                  image={item.promoImage}
                  start={!item.isPermanent ? item.start : null}
                  end={!item.isPermanent ? item.end : null}
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
          <Space v={{ size: 'm', properties: ['margin-top'] }}>
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
