// @flow
import {classNames, cssGrid} from '../../../utils/classnames';
import ExhibitionPromo from '../ExhibitionPromo/ExhibitionPromo';
import EventPromo from '../EventPromo/EventPromo';
import InstallationPromo from '../InstallationPromo/InstallationPromo';
import DailyTourPromo from '../DailyTourPromo/DailyTourPromo';
import BookPromo from '../BookPromo/BookPromo';
import StoryPromo from '../StoryPromo/StoryPromo';
import type {UiExhibition} from '../../../model/exhibitions';
import type {UiEvent} from '../../../model/events';
import type {Installation} from '../../../model/installations';
import type {Book} from '../../../model/books';
import type {Article} from '../../../model/articles';

// TODO: This should be MultiContent
type ContentTypes =
  | UiEvent
  | UiExhibition
  | Installation
  | Book
  | Article;

type Props = {|
  items: $ReadOnlyArray<ContentTypes>,
  hidePromoText?: boolean
|}

const CardGrid = ({
  items,
  hidePromoText
}: Props) => {
  return (
    <div className='css-grid__container'>
      <div className='css-grid'>
        {items.map((item, i) => (
          <div key={item.id} className={classNames({
            [cssGrid({s: 12, m: 6, l: 4, xl: 4})]: true
          })}>
            {item.id === 'tours' && <DailyTourPromo />}
            {item.type === 'installations' &&
              <InstallationPromo
                id={item.id}
                description={item.promoText}
                start={item.start}
                end={item.end}
                image={item.promoImage}
                title={item.title}
              />
            }
            {item.type === 'exhibitions' &&
              // TODO: (remove Picture type)
              // $FlowFixMe
              <ExhibitionPromo
                id={item.id}
                url={`/exhibitions/${item.id}`}
                title={item.title}
                description={item.promoText || ''}
                format={item.format}
                // TODO: (remove Picture type)
                // $FlowFixMe
                image={item.promoImage}
                start={item.start}
                end={item.end}
                statusOverride={item.statusOverride}
                position={i} />
            }
            {item.id !== 'tours' && item.type === 'events' &&
              // TODO: (remove Picture type)
              // $FlowFixMe
              <EventPromo
                event={item}
                position={i} />
            }
            {item.type === 'articles' &&
              // TODO: (remove Picture type)
              // $FlowFixMe
              <StoryPromo
                item={item}
                position={i}
                hidePromoText={hidePromoText} />
            }
            {item.type === 'books' &&
              <BookPromo
                url={`/books/${item.id}`}
                title={item.title}
                subtitle={item.subtitle}
                description={item.promoText}
                image={item.cover} />
            }
          </div>
        ))}
      </div>
    </div>
  );
};

export default CardGrid;
