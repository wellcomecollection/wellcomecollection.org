// @flow
import { classNames, cssGrid } from '../../../utils/classnames';
import type { Card as CardType } from '@weco/common/model/card';
import FeaturedCard from '../FeaturedCard/FeaturedCard';
// $FlowFixMe (tsx)
import Card from '../Card/Card';
// $FlowFixMe (tsx)
import Layout12 from '../Layout12/Layout12';
// $FlowFixMe (tsx)
import Space from '@weco/common/views/components/styled/Space';

type Props = {|
  items: $ReadOnlyArray<CardType>,
  isFeaturedFirst?: boolean,
|};

type CardGridFeaturedCardProps = {|
  item: CardType,
|};

const CardGridFeaturedCard = ({ item }: CardGridFeaturedCardProps) => (
  <Layout12>
    <FeaturedCard
      id={`featured-card`}
      image={{
        ...item.image,
        sizesQueries:
          '(min-width: 1420px) 698px, (min-width: 960px) 50.23vw, (min-width: 600px) calc(100vw - 84px), 100vw',
        showTasl: false,
      }}
      labels={item.format ? [{ url: null, text: item.format.title }] : []}
      link={{
        url: item.link || '',
        text: item.title || '',
      }}
      background="charcoal"
      color="white"
    >
      {item.title && <h2 className="font-wb font-size-2">{item.title}</h2>}
      {item.description && (
        <p className="font-hnl font-size-5">{item.description}</p>
      )}
    </FeaturedCard>
  </Layout12>
);

const CardGrid = ({ items, isFeaturedFirst }: Props) => {
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
      <div className="css-grid__container">
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
      </div>
      {featuredCard && !isFeaturedFirst && (
        <Space v={{ size: 'l', properties: ['padding-top'] }}>
          <CardGridFeaturedCard item={featuredCard} />
        </Space>
      )}
    </>
  );
};

export default CardGrid;
