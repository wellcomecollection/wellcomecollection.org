// @flow
import { classNames, cssGrid } from '../../../utils/classnames';
import FeaturedCard from '../FeaturedCard/FeaturedCard';
// import ManualPromoType from '';

type Props = {|
  items: $ReadOnlyArray<any>, // TODO ManualPromoType
|};

const CardGrid = ({ items }: Props) => {
  const manualPromos = items
    .filter(item => item.type === 'manualPromo')
    .slice(0, 4);

  return (
    <div>
      <div className="css-grid__container">
        <div className="css-grid">
          {manualPromos.map((item, i) => (
            <div
              key={item.id}
              className={classNames({
                [cssGrid({
                  s: 12,
                  m: 6,
                  l: i < 3 ? 4 : 12,
                  xl: i < 3 ? 4 : 12,
                })]: true,
              })}
            >
              <FeaturedCard
                id={`featured-card-${item.title.trim()}`}
                image={item.image}
                labels={[]}
                link={{
                  url: '#',
                  text: 'Remote diagnosis from wee to the web',
                }}
                background="charcoal"
                color="white"
              >
                {item.title && (
                  <h2 className="font-wb font-size-2">{item.title}</h2>
                )}
                {item.summary && (
                  <p className="font-hnl font-size-5">{item.summary}</p>
                )}
              </FeaturedCard>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CardGrid;
