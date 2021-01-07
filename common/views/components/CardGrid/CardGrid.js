// @flow
import { classNames, cssGrid } from '../../../utils/classnames';
import ExhibitionPromo from '../ExhibitionPromo/ExhibitionPromo';
import EventPromo from '../EventPromo/EventPromo';
import DailyTourPromo from '../DailyTourPromo/DailyTourPromo';
// $FlowFixMe(tsx)
import BookPromo from '../BookPromo/BookPromo';
// $FlowFixMe (tsx)
import Layout12 from '../Layout12/Layout12';
import StoryPromo from '../StoryPromo/StoryPromo';
// $FlowFixMe
import MoreLink from '../MoreLink/MoreLink';
import { type Link } from '../../../model/link';
import { type UiExhibition } from '../../../model/exhibitions';
import { type UiEvent } from '../../../model/events';
import { type Book } from '../../../model/books';
import { type Article } from '../../../model/articles';
import { type Page } from '../../../model/pages';
import { type ArticleSeries } from '../../../model/article-series';
import Space from '../styled/Space';
import type Moment from 'moment';
import Card from '../Card/Card';
import { convertItemToCardProps } from '@weco/common/model/card';

// TODO: This should be MultiContent
type ContentTypes =
  | UiEvent
  | UiExhibition
  | Book
  | Article
  | Page
  | ArticleSeries;

type Props = {|
  items: $ReadOnlyArray<ContentTypes>,
  hidePromoText?: boolean,
  itemsPerRow: number,
  itemsHaveTransparentBackground?: boolean,
  links?: Link[],
  fromDate?: Moment,
|};

const CardGrid = ({
  items,
  hidePromoText,
  itemsPerRow,
  itemsHaveTransparentBackground = false,
  links,
  fromDate,
}: Props) => {
  const gridColumns = itemsPerRow === 4 ? 3 : 4;
  const spaceVLinks = { size: 'm', properties: ['margin-top'] };
  return (
    <div>
      <div className="css-grid__container">
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

              {item.type === 'exhibitions' && (
                // TODO: (remove Picture type)
                // $FlowFixMe
                <ExhibitionPromo
                  id={item.id}
                  url={`/exhibitions/${item.id}`}
                  title={item.title}
                  shortTitle={item.shortTitle}
                  format={item.format}
                  // TODO: (remove Picture type)
                  // $FlowFixMe
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
      </div>
      {links && links.length > 0 && (
        <Layout12>
          <Space v={spaceVLinks}>
            {links.map(link => (
              <Space v={spaceVLinks} key={link.url}>
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
