import CompactCard from '../CompactCard/CompactCard';
import { FunctionComponent } from 'react';
import { ArticleFormatIds } from '@weco/common/services/prismic/content-format-ids';
import HTMLDate from '@weco/common/views/components/HTMLDate/HTMLDate';
import Space from '@weco/common/views/components/styled/Space';
import WatchLabel from '@weco/common/views/components/WatchLabel/WatchLabel';
import { isNotUndefined } from '@weco/common/utils/array';
import PrismicImage from '../PrismicImage/PrismicImage';
import { Article } from '../../types/articles';
import linkResolver from '../../services/prismic/link-resolver';

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
  const url = linkResolver(article);
  const image = article.squareImage;

  const seriesWithSchedule = article.series.find(
    series => (series.schedule ?? []).length > 0
  );

  const indexInSeriesSchedule = article.promo?.caption
    ? seriesWithSchedule?.schedule
        ?.map(scheduleItem => scheduleItem.title)
        .indexOf(article.promo?.caption)
    : undefined;

  const seriesColor = seriesWithSchedule?.color ?? undefined;

  const positionInSeriesSchedule =
    isNotUndefined(indexInSeriesSchedule) && indexInSeriesSchedule !== -1
      ? indexInSeriesSchedule + 1
      : undefined;

  const isSerial = Boolean(seriesWithSchedule);
  const isPodcast = article.format?.id === ArticleFormatIds.Podcast;

  const labels = [article.format?.title, isSerial ? 'Serial' : undefined]
    .filter(isNotUndefined)
    .map(text => ({ text }));

  const publicationDate = article.datePublished;

  return (
    <CompactCard
      url={url}
      title={article.title}
      partNumber={showPosition ? positionInSeriesSchedule : undefined}
      partDescription={isPodcast ? 'Episode' : 'Part'}
      color={seriesColor}
      primaryLabels={!isPodcast ? labels : []}
      secondaryLabels={[]}
      description={!isPodcast ? article.promo?.caption ?? undefined : undefined}
      Image={
        (image && (
          <PrismicImage
            image={image}
            sizes={{
              xlarge: 1 / 3,
              large: 1 / 3,
              medium: 1 / 2,
              small: 1,
            }}
          />
        )) ||
        undefined
      }
      xOfY={xOfY}
      postTitleChildren={
        isPodcast ? (
          <Space v={{ size: 's', properties: ['margin-top'] }}>
            <WatchLabel text={<HTMLDate date={new Date(publicationDate)} />} />
          </Space>
        ) : undefined
      }
    />
  );
};
export default ArticleCard;
