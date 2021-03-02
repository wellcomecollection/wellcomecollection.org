import CompactCard from '../CompactCard/CompactCard';
import Image from '../Image/Image';
import { Article } from '../../../model/articles';
import { FunctionComponent } from 'react';
import { ArticleFormatIds } from '@weco/common/model/content-format-id';
import HTMLDate from '../HTMLDate/HTMLDate';
import Space from '../styled/Space';
import WatchLabel from '../WatchLabel/WatchLabel';

type Props = {
  article: Article;
  showPosition: boolean;
  xOfY: {
    x: number;
    y: number;
  };
};

const ArticleCard: FunctionComponent<Props> = ({
  article,
  showPosition,
  xOfY,
}: Props) => {
  const partOfSerial = showPosition
    ? article.series
        .map(series => {
          const titles = series.schedule.map(item => item.title);
          const positionInSerial = titles.indexOf(article.title);
          return positionInSerial + 1;
        })
        .find(_ => _)
    : undefined;

  const isPodcast =
    article.format && article.format.id === ArticleFormatIds.Podcast;

  if (isPodcast) {
    return (
      <CompactCard
        url={`/articles/${article.id}`}
        title={article.title || ''}
        partNumber={partOfSerial}
        partDescription={isPodcast ? 'Episode' : 'Part'}
        color={article.color}
        primaryLabels={!isPodcast ? article.labels : []}
        secondaryLabels={[]}
        description={!isPodcast ? article.promoText : null}
        urlOverride={article.promo?.link || null}
        Image={
          (article.image?.crops?.square && (
            <Image {...article.image.crops.square} />
          )) ||
          null
        }
        DateInfo={null}
        StatusIndicator={null}
        xOfY={xOfY}
        postTitleChildren={
          <Space v={{ size: 's', properties: ['margin-top'] }}>
            <WatchLabel
              text={
                article.datePublished && (
                  <HTMLDate date={new Date(article.datePublished)} />
                )
              }
            />
          </Space>
        }
      />
    );
  } else {
    return (
      <CompactCard
        url={`/articles/${article.id}`}
        title={article.title || ''}
        partNumber={partOfSerial}
        partDescription={isPodcast ? 'Episode' : 'Part'}
        color={article.color}
        primaryLabels={!isPodcast ? article.labels : []}
        secondaryLabels={[]}
        description={!isPodcast ? article.promoText : null}
        urlOverride={article.promo?.link || null}
        Image={
          (article.image?.crops?.square && (
            <Image {...article.image.crops.square} />
          )) ||
          null
        }
        DateInfo={null}
        StatusIndicator={null}
        xOfY={xOfY}
      />
    );
  }
};
export default ArticleCard;
