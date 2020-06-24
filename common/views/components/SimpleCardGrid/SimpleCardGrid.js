// @flow
import { classNames, cssGrid } from '../../../utils/classnames';
import type { Card as CardType } from '@weco/common/model/card';
import FeaturedCard from '../FeaturedCard/FeaturedCard';
import Card from '../Card/Card';
import Space from '@weco/common/views/components/styled/Space';

type Props = {|
  items: $ReadOnlyArray<CardType>,
|};

const CardGrid = ({ items }: Props) => {
  const cards = items.filter(item => item.type === 'card');
  const firstThreeCards = cards.slice(0, 3);
  const fourthCard = cards[3];
  return (
    <>
      <div className="css-grid__container">
        <div className="css-grid">
          {firstThreeCards.map((item, i) => (
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
      {fourthCard && (
        <Space v={{ size: 'l', properties: ['padding-top'] }}>
          <FeaturedCard
            id={`featured-card`}
            image={{
              ...fourthCard.image,
              sizesQueries:
                '(min-width: 1420px) 698px, (min-width: 960px) 50.23vw, (min-width: 600px) calc(100vw - 84px), 100vw',
              showTasl: false,
            }}
            labels={
              fourthCard.format
                ? [{ url: null, text: fourthCard.format.title }]
                : []
            }
            link={{
              url: fourthCard.link || '',
              text: fourthCard.title || '',
            }}
            background="charcoal"
            color="white"
          >
            {fourthCard.title && (
              <h2 className="font-wb font-size-2">{fourthCard.title}</h2>
            )}
            {fourthCard.description && (
              <p className="font-hnl font-size-5">{fourthCard.description}</p>
            )}
          </FeaturedCard>
        </Space>
      )}
    </>
  );
};

export default CardGrid;
