import { classNames, cssGrid } from '@weco/common/utils/classnames';
import { Card as CardType } from '../../types/card';
import Card from '../Card/Card';
import Layout12 from '@weco/common/views/components/Layout12/Layout12';
import Space from '@weco/common/views/components/styled/Space';
import CssGridContainer from '@weco/common/views/components/styled/CssGridContainer';
import FeaturedCard from '../FeaturedCard/FeaturedCard';
import { getCrop } from '@weco/common/model/image';
import { FC } from 'react';

type Props = {
  items: readonly CardType[];
  isFeaturedFirst?: boolean;
};

type CardGridFeaturedCardProps = {
  item: CardType;
};

const CardGridFeaturedCard = ({ item }: CardGridFeaturedCardProps) => {
  const image = getCrop(item.image, '16:9');

  return (
    <Layout12>
      <FeaturedCard
        id={`featured-card`}
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
                    item.format.title === 'Season' ? 'orange' : undefined,
                },
              ]
            : []
        }
        link={{
          url: item.link || '',
          text: item.title || '',
        }}
        background="charcoal"
        color="white"
      >
        {item.title && <h2 className="font-wb font-size-2">{item.title}</h2>}
        {item.description && (
          <p className="font-hnr font-size-5">{item.description}</p>
        )}
      </FeaturedCard>
    </Layout12>
  );
};

const CardGrid: FC<Props> = ({ items, isFeaturedFirst }: Props) => {
  const cards = items.filter(item => item.type === 'card');
  const threeCards = isFeaturedFirst ? cards.slice(1) : cards.slice(0, 3);
  const featuredCard = isFeaturedFirst ? cards[0] : cards[3];

  return (
    <>
      {featuredCard && isFeaturedFirst && (
        <Space v={{ size: 'l', properties: ['padding-bottom'] }}>
          <CardGridFeaturedCard item={featuredCard} />
        </Space>
      )}
      <CssGridContainer>
        <div className="css-grid">
          {threeCards.map((item, i) => (
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
              <Card item={item} />
            </div>
          ))}
        </div>
      </CssGridContainer>
      {featuredCard && !isFeaturedFirst && (
        <Space v={{ size: 'l', properties: ['padding-top'] }}>
          <CardGridFeaturedCard item={featuredCard} />
        </Space>
      )}
    </>
  );
};

export default CardGrid;
