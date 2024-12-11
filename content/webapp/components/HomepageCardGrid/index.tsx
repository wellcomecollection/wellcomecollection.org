import { getCrop } from '@weco/common/model/image';
import { cssGrid, font } from '@weco/common/utils/classnames';
import {
  ContaineredLayout,
  gridSize12,
} from '@weco/common/views/components/Layout';
import CssGridContainer from '@weco/common/views/components/styled/CssGridContainer';
import Card from '@weco/content/components/Card/Card';
import FeaturedCard from '@weco/content/components/FeaturedCard';
import {
  Card as CardType,
  convertItemToCardProps,
  ItemType,
} from '@weco/content/types/card';

export const HomepageFeaturedCard = ({ item }) => {
  const image = getCrop(item.image, '16:9');

  return (
    <ContaineredLayout gridSizes={gridSize12()}>
      <FeaturedCard
        image={
          image && {
            ...image,
            // We intentionally omit the alt text on promos, so screen reader
            // users don't have to listen to the alt text before hearing the
            // title of the item in the list.
            //
            // See https://github.com/wellcomecollection/wellcomecollection.org/issues/6007
            alt: '',
          }
        }
        labels={
          item.format
            ? [
                {
                  text: item.format.title,
                  labelColor:
                    item.format.title === 'Season'
                      ? 'accent.salmon'
                      : undefined,
                },
              ]
            : []
        }
        link={{
          url: item.link || '',
          text: item.title || '',
        }}
        background="neutral.700"
        textColor="white"
      >
        {item.title && <h2 className={font('wb', 2)}>{item.title}</h2>}
        {item.description && (
          <p className={font('intr', 5)}>{item.description}</p>
        )}
      </FeaturedCard>
    </ContaineredLayout>
  );
};

type Props = {
  items: (ItemType | CardType)[];
};

export const HomepageCardGrid = ({ items }: Props) => {
  const threeCards = items.slice(0, 3);

  return (
    <CssGridContainer>
      <div className="css-grid">
        {threeCards.map((item, i) => {
          const cardItem =
            item.type !== 'card' ? convertItemToCardProps(item) : item;

          return (
            <div key={i} className={cssGrid({ s: 12, m: 4, l: 4, xl: 4 })}>
              <Card item={cardItem} />
            </div>
          );
        })}
      </div>
    </CssGridContainer>
  );
};
