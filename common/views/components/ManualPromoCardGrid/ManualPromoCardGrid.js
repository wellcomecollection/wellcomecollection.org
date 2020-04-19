// @flow
import { classNames, cssGrid } from '../../../utils/classnames';
import FeaturedCard from '../FeaturedCard/FeaturedCard';
import ManualPromo from '@weco/common/model/manual-promo';

type Props = {|
  items: $ReadOnlyArray<ManualPromo>,
|};

const ManualPromoCardGrid = ({ items }: Props) => {
  const manualPromos = items.filter(item => item.type === 'manualPromo');
  const firstThreePromos = manualPromos.slice(0, 3);
  const fourthPromo = manualPromos[4];

  return (
    <>
      <div className="css-grid__container">
        <div className="css-grid">
          {firstThreePromos.map((item, i) => (
            <div
              key={item.id}
              className={classNames({
                [cssGrid({
                  s: 12,
                  m: 4,
                  l: 4,
                  xl: 4,
                })]: true,
              })}
            >
              {' '}
              <pre
                style={{
                  maxWidth: '600px',
                  margin: '0 auto 24px',
                  fontSize: '14px',
                }}
              >
                <code
                  style={{
                    display: 'block',
                    padding: '24px',
                    backgroundColor: '#EFE1AA',
                    color: '#000',
                    border: '4px solid #000',
                    borderRadius: '6px',
                  }}
                >
                  {JSON.stringify(item, null, 1)}
                </code>
              </pre>
            </div>
          ))}
        </div>
      </div>
      {fourthPromo && (
        <FeaturedCard
          id={`featured-card-${fourthPromo.title.trim()}`}
          image={fourthPromo.image}
          labels={[]}
          link={{
            url: '#',
            text: 'Remote diagnosis from wee to the web',
          }}
          background="charcoal"
          color="white"
        >
          {fourthPromo.title && (
            <h2 className="font-wb font-size-2">{fourthPromo.title}</h2>
          )}
          {fourthPromo.summary && (
            <p className="font-hnl font-size-5">{fourthPromo.summary}</p>
          )}
        </FeaturedCard>
      )}
    </>
  );
};

export default ManualPromoCardGrid;
