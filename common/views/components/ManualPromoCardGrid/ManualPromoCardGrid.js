// @flow
import { classNames, cssGrid } from '../../../utils/classnames';
import type { ManualPromo as ManualPromoType } from '@weco/common/model/manual-promo';
import FeaturedCard from '../FeaturedCard/FeaturedCard';
import ManualPromo from '../ManualPromo/ManualPromo';
import Space from '@weco/common/views/components/styled/Space';

type Props = {|
  items: $ReadOnlyArray<ManualPromoType>,
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
              key={i}
              className={classNames({
                [cssGrid({
                  s: 12,
                  m: 4,
                  l: 4,
                  xl: 4,
                })]: true,
              })}
            >
              <ManualPromo item={item} />
            </div>
          ))}
        </div>
      </div>
      {fourthPromo && (
        <Space v={{ size: 'l', properties: ['padding-top'] }}>
          <FeaturedCard
            id={`featured-card-manual-promo`}
            image={fourthPromo.image}
            labels={
              fourthPromo.format
                ? [{ url: null, text: fourthPromo.format.title }]
                : []
            }
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
        </Space>
      )}
    </>
  );
};

export default ManualPromoCardGrid;
