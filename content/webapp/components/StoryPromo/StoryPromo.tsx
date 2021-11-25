import { FunctionComponent } from 'react';
import { font, classNames } from '@weco/common/utils/classnames';
import { trackEvent } from '@weco/common/utils/ga';
import LabelsList from '@weco/common/views/components/LabelsList/LabelsList';
import PartNumberIndicator from '@weco/common/views/components/PartNumberIndicator/PartNumberIndicator';
import Space from '@weco/common/views/components/styled/Space';
import { CardOuter, CardBody } from '@weco/common/views/components/Card/Card';
import { ArticlePrismicDocument } from '../../services/prismic/articles';
import { transformMeta } from '../../services/prismic/transformers';
import PrismicImage from '../PrismicImage/PrismicImage';
import { isFilledLinkToDocument } from 'services/prismic/types';
import * as prismicH from 'prismic-helpers-beta';
import { isNotUndefined } from '@weco/common/utils/array';

type Props = {
  article: ArticlePrismicDocument;
  position: number;
  hidePromoText?: boolean;
  hasTransparentBackground?: boolean;
  sizesQueries?: string;
};

function transformSeries(article: ArticlePrismicDocument) {
  return article.data.series
    .map(({ series }) => series)
    .filter(isFilledLinkToDocument);
}

function transformSeriesWithSchedule(article: ArticlePrismicDocument) {
  return transformSeries(article).find(series => {
    return (series.data?.schedule ?? []).length > 0;
  });
}

function transformFormat(article: ArticlePrismicDocument) {
  const { format } = article.data;

  if (isFilledLinkToDocument(format) && format.data) {
    return prismicH.asText(format.data.title);
  }
}

const StoryPromo: FunctionComponent<Props> = ({
  article,
  position,
  hidePromoText = false,
  hasTransparentBackground = false,
}: Props) => {
  const meta = transformMeta(article);
  const seriesWithSchedule = transformSeriesWithSchedule(article);
  const seriesColor = seriesWithSchedule?.data?.color ?? undefined;

  // This is a bit of nastiness as we can't access the articles within a series i.e.
  // `thisArticle.series.schedule.articles.map(article => article.id === thisArticle.id)`
  // So this only works on series that have a schedule, and a schedule where the titles
  // match exactly with the schedule items. This wouldn't work with any series.
  const indexInSeriesSchedule = seriesWithSchedule?.data?.schedule
    ?.map(scheduleItem => prismicH.asText(scheduleItem.title))
    .indexOf(meta.title);

  const format = transformFormat(article);
  const isSerial = Boolean(seriesWithSchedule);
  const labels = [format, isSerial ? 'Serial' : undefined]
    .filter(isNotUndefined)
    .map(text => ({ text }));

  return (
    <CardOuter
      onClick={() => {
        trackEvent({
          category: 'StoryPromo',
          action: 'follow link',
          label: `${article.id} | position: ${position}`,
        });
      }}
      href={meta.url}
      className={classNames({
        'bg-cream': !hasTransparentBackground,
      })}
    >
      <div className="relative">
        {meta.image?.['16:9'] && (
          <PrismicImage
            image={meta.image['16:9']}
            sizes={{
              xlarge: 1 / 3,
              large: 1 / 3,
              medium: 1 / 2,
              small: 1,
            }}
          />
        )}

        {labels.length > 0 && (
          <div style={{ position: 'absolute', bottom: 0 }}>
            <LabelsList labels={labels} />
          </div>
        )}
      </div>

      <CardBody>
        <div>
          {indexInSeriesSchedule && (
            <PartNumberIndicator
              number={indexInSeriesSchedule + 1}
              color={seriesColor}
            />
          )}
          <Space
            v={{
              size: 's',
              properties: ['margin-bottom'],
            }}
            as="h2"
            className={`
            promo-link__title
            ${font('wb', 3)}
          `}
          >
            {meta.title}
          </Space>
          {!hidePromoText && (
            <p
              className={classNames({
                'inline-block no-margin': true,
                [font('hnr', 5)]: true,
              })}
            >
              {/* {item.promoText} */}
            </p>
          )}
        </div>
      </CardBody>
      {/* {item.series.length > 0 && (
        <CardPostBody>
          {item.series.map(series => (
            <p key={series.title} className={`${font('hnb', 6)} no-margin`}>
              <span className={font('hnr', 6)}>Part of</span> {series.title}
            </p>
          ))}
        </CardPostBody>
      )} */}
    </CardOuter>
  );
};

export default StoryPromo;
