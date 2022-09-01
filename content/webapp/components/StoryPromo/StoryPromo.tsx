import { FunctionComponent } from 'react';
import { font, classNames } from '@weco/common/utils/classnames';
import { trackEvent } from '@weco/common/utils/ga';
import LabelsList from '@weco/common/views/components/LabelsList/LabelsList';
import PartNumberIndicator from '../PartNumberIndicator/PartNumberIndicator';
import Space from '@weco/common/views/components/styled/Space';
import { CardOuter, CardBody, CardPostBody } from '../Card/Card';
import PrismicImage from '@weco/common/views/components/PrismicImage/PrismicImage';
import { ArticleBasic } from '../../types/articles';
import { isNotUndefined } from '@weco/common/utils/array';
import linkResolver from '@weco/common/services/prismic/link-resolver';

type Props = {
  article: ArticleBasic;
  position: number;
  hidePromoText?: boolean;
  hasTransparentBackground?: boolean;
  sizesQueries?: string;
};

const StoryPromo: FunctionComponent<Props> = ({
  article,
  position,
  hidePromoText = false,
  hasTransparentBackground = false,
}: Props) => {
  const image = article.promo?.image;
  const url = linkResolver(article);

  // This is a bit of nastiness as we can't access the articles within a series i.e.
  // `thisArticle.series.schedule.articles.map(article => article.id === thisArticle.id)`
  // So this only works on series that have a schedule, and a schedule where the titles
  // match exactly with the schedule items. This wouldn't work with any series.
  const seriesWithSchedule = article.series.find(series =>
    (series.schedule ?? []).find(schedule => schedule.publishDate)
  );

  const seriesColor = seriesWithSchedule?.color ?? undefined;

  const seriesTitles =
    seriesWithSchedule?.schedule?.map(scheduleItem => scheduleItem.title) || [];
  const indexInSeriesSchedule = seriesTitles.indexOf(article.title);

  const positionInSeriesSchedule =
    isNotUndefined(indexInSeriesSchedule) && indexInSeriesSchedule !== -1
      ? indexInSeriesSchedule + 1
      : undefined;

  const isSerial = Boolean(seriesWithSchedule);

  const labels = [article.format?.title, isSerial ? 'Serial' : undefined]
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
      href={url}
      className={classNames({
        'bg-cream': !hasTransparentBackground,
      })}
    >
      <div className="relative">
        {isNotUndefined(image) && (
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
        )}

        {labels.length > 0 && (
          <div style={{ position: 'absolute', bottom: 0 }}>
            <LabelsList labels={labels} />
          </div>
        )}
      </div>

      <CardBody>
        <div>
          {positionInSeriesSchedule && (
            <PartNumberIndicator
              number={positionInSeriesSchedule}
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
            {article.title}
          </Space>
          {!hidePromoText && isNotUndefined(article.promo?.caption) && (
            <p
              className={classNames({
                'inline-block no-margin': true,
                [font('intr', 5)]: true,
              })}
            >
              {article.promo?.caption}
            </p>
          )}
        </div>
      </CardBody>
      {article.series.length > 0 && (
        <CardPostBody>
          {article.series.map(series => (
            <p key={series.id} className={`${font('intb', 6)} no-margin`}>
              <span className={font('intr', 6)}>Part of</span> {series.title}
            </p>
          ))}
        </CardPostBody>
      )}
    </CardOuter>
  );
};

export default StoryPromo;
