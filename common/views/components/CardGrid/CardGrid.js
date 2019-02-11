// @flow
import { classNames, cssGrid } from '../../../utils/classnames';
import ExhibitionPromo from '../ExhibitionPromo/ExhibitionPromo';
import EventPromo from '../EventPromo/EventPromo';
import DailyTourPromo from '../DailyTourPromo/DailyTourPromo';
import BookPromo from '../BookPromo/BookPromo';
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
|};

const CardGrid = ({ items, hidePromoText }: Props) => {
  return (
    <div className="css-grid__container">
      <div className="css-grid">
        {items.map((item, i) => (
          <div
            key={item.id}
            className={classNames({
              [cssGrid({ s: 12, m: 6, l: 4, xl: 4 })]: true,
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
                // TODO: Make this logic a little more sound
                // This is to replicate what we have with installations at the
                // moment
                description={
                  item.format && item.format.title === 'Installation'
                    ? item.promoText
                    : ''
                }
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
  );
};

export default CardGrid;
