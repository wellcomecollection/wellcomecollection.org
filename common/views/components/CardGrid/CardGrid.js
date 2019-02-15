// @flow
import { type Node } from 'react';
import { classNames, cssGrid, spacing } from '../../../utils/classnames';
import ExhibitionPromo from '../ExhibitionPromo/ExhibitionPromo';
import EventPromo from '../EventPromo/EventPromo';
import DailyTourPromo from '../DailyTourPromo/DailyTourPromo';
import BookPromo from '../BookPromo/BookPromo';
import Layout12 from '../Layout12/Layout12';
import StoryPromo from '../StoryPromo/StoryPromo';
import { type UiExhibition } from '../../../model/exhibitions';
import { type UiEvent } from '../../../model/events';
import { type Book } from '../../../model/books';
import { type Article } from '../../../model/articles';

// TODO: This should be MultiContent
type ContentTypes = UiEvent | UiExhibition | Book | Article;

type Props = {|
  items: $ReadOnlyArray<ContentTypes>,
  hidePromoText?: boolean,
  children?: Node,
  itemsPerRow: number,
  itemsHaveTransparentBackground?: boolean,
|};

const CardGrid = ({
  items,
  hidePromoText,
  itemsPerRow,
  itemsHaveTransparentBackground = false,
  children,
}: Props) => {
  const gridColumns = itemsPerRow === 4 ? 3 : 4;

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
                <EventPromo event={item} position={i} />
              )}
              {item.type === 'articles' && (
                <StoryPromo
                  item={item}
                  position={i}
                  hidePromoText={hidePromoText}
                  hasTransparentBackground={itemsHaveTransparentBackground}
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
            </div>
          ))}
        </div>
      </div>
      <Layout12>
        <div
          className={classNames({
            [spacing({ s: 3 }, { margin: ['top'] })]: true,
          })}
        >
          {children}
        </div>
      </Layout12>
    </div>
  );
};

export default CardGrid;
