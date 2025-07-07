import { FunctionComponent } from 'react';

import { getCrop } from '@weco/common/model/image';
import { font } from '@weco/common/utils/classnames';
import {
  ContaineredLayout,
  gridSize12,
} from '@weco/common/views/components/Layout';
import { Container } from '@weco/common/views/components/styled/Container';
import { Grid, GridCell } from '@weco/common/views/components/styled/Grid';
import Space from '@weco/common/views/components/styled/Space';
import Card from '@weco/content/components/Card';
import FeaturedCard from '@weco/content/components/FeaturedCard';
import { Card as CardType } from '@weco/content/types/card';

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

const SimpleCardGrid: FunctionComponent<Props> = ({
  items,
  isFeaturedFirst,
}: Props) => {
  const cards = items.filter(item => item.type === 'card');
  const threeCards = isFeaturedFirst ? cards.slice(1) : cards.slice(0, 3);
  const featuredCard = isFeaturedFirst ? cards[0] : cards[3];

  return (
    <>
      {featuredCard && isFeaturedFirst && (
        <CardGridFeaturedCard item={featuredCard} />
      )}
      <Container>
        <Grid>
          {threeCards.map((item, i) => (
            <GridCell
              key={i}
              $sizeMap={{
                s: [12],
                m: [4],
                l: [4],
                xl: [4],
              }}
            >
              <Card item={item} />
            </GridCell>
          ))}
        </Grid>
      </Container>
      {featuredCard && !isFeaturedFirst && (
        <Space $v={{ size: 'l', properties: ['padding-top'] }}>
          <CardGridFeaturedCard item={featuredCard} />
        </Space>
      )}
    </>
  );
};

export default SimpleCardGrid;
