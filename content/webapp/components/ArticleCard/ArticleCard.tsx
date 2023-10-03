import CompactCard from '../CompactCard/CompactCard';
import { FunctionComponent } from 'react';
import { ArticleFormatIds } from '@weco/content/data/content-format-ids';
import HTMLDate from '@weco/common/views/components/HTMLDate/HTMLDate';
import Space from '@weco/common/views/components/styled/Space';
import WatchLabel from '@weco/content/components/WatchLabel/WatchLabel';
import { isNotUndefined, isUndefined } from '@weco/common/utils/type-guards';
import PrismicImage from '@weco/common/views/components/PrismicImage/PrismicImage';
import { ArticleBasic, getArticleColor } from '../../types/articles';
import linkResolver from '@weco/common/services/prismic/link-resolver';
import { getCrop } from '@weco/common/model/image';
import { getPartNumberInSeries } from '@weco/content/types/articles';

type Props = {
  article: ArticleBasic;
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
}) => {
  const url = linkResolver(article);
  const image = getCrop(article.image, 'square');

  const isSerial = article.series.some(series => series.schedule.length > 0);
  const isPodcast = article.format?.id === ArticleFormatIds.Podcast;

  const labels = [article.format?.title, isSerial ? 'Serial' : undefined]
    .filter(isNotUndefined)
    .map(text => ({ text }));

  const publicationDate = article.datePublished;

  const partNumber = showPosition ? getPartNumberInSeries(article) : undefined;

  return (
    <CompactCard
      url={url}
      title={article.title}
      partNumber={partNumber}
      partDescription={isPodcast ? 'Episode' : 'Part'}
      partNumberColor={getArticleColor(article)}
      primaryLabels={!isPodcast && isUndefined(partNumber) ? labels : []}
      secondaryLabels={[]}
      description={!isPodcast ? article.promo?.caption ?? undefined : undefined}
      Image={
        image && (
          <PrismicImage
            // We intentionally omit the alt text on promos, so screen reader
            // users don't have to listen to the alt text before hearing the
            // title of the item in the list.
            //
            // See https://github.com/wellcomecollection/wellcomecollection.org/issues/6007
            image={{ ...image, alt: '' }}
            sizes={{
              xlarge: 1 / 3,
              large: 1 / 3,
              medium: 1 / 2,
              small: 1,
            }}
            quality="low"
          />
        )
      }
      xOfY={xOfY}
      postTitleChildren={
        isPodcast ? (
          <Space v={{ size: 's', properties: ['margin-top'] }}>
            <WatchLabel text={<HTMLDate date={publicationDate} />} />
          </Space>
        ) : undefined
      }
    />
  );
};
export default ArticleCard;
