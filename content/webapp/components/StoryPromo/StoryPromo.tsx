import { FunctionComponent } from 'react';
import { font, classNames } from '@weco/common/utils/classnames';
import { trackEvent } from '@weco/common/utils/ga';
import {
  getPositionInSeries,
  getArticleColor,
  Article,
} from '@weco/common/model/articles';
import LabelsList from '@weco/common/views/components/LabelsList/LabelsList';
import PartNumberIndicator from '@weco/common/views/components/PartNumberIndicator/PartNumberIndicator';
import Space from '@weco/common/views/components/styled/Space';
import {
  CardOuter,
  CardBody,
  CardPostBody,
} from '@weco/common/views/components/Card/Card';
import PrismicImage from 'components/PrismicImage/PrismicImage';

type Props = {
  item: Article;
  position: number;
  hidePromoText?: boolean;
  hasTransparentBackground?: boolean;
  sizesQueries?: string;
};

const StoryPromo: FunctionComponent<Props> = ({
  item,
  position,
  hidePromoText = false,
  hasTransparentBackground = false,
}: Props) => {
  const positionInSeries = getPositionInSeries(item);
  return (
    <CardOuter
      onClick={() => {
        trackEvent({
          category: 'StoryPromo',
          action: 'follow link',
          label: `${item.id} | position: ${position}`,
        });
      }}
      href={(item.promo && item.promo.link) || `/articles/${item.id}`}
      className={classNames({
        'bg-cream': !hasTransparentBackground,
      })}
    >
      <div className="relative">
        {/* FIXME: Image type tidy */}
        {item.promoImage && (
          <PrismicImage
            image={{
              url: item.promoImage.contentUrl,
              dimensions: {
                width: item.promoImage.width,
                height: item.promoImage.height || 0,
              },
              alt: item.promoImage.alt,
              copyright: '',
            }}
            sizes={{
              xlarge: 1 / 3,
              large: 1 / 3,
              medium: 1 / 2,
              small: 1,
            }}
          />
        )}

        {item.labels.length > 0 && (
          <div style={{ position: 'absolute', bottom: 0 }}>
            <LabelsList labels={item.labels} />
          </div>
        )}
      </div>

      <CardBody>
        <div>
          {positionInSeries && (
            <PartNumberIndicator
              number={positionInSeries}
              color={getArticleColor(item)}
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
            {item.title}
          </Space>
          {!hidePromoText && (
            <p
              className={classNames({
                'inline-block no-margin': true,
                [font('hnr', 5)]: true,
              })}
            >
              {item.promoText}
            </p>
          )}
        </div>
      </CardBody>
      {item.series.length > 0 && (
        <CardPostBody>
          {item.series.map(series => (
            <p key={series.title} className={`${font('hnb', 6)} no-margin`}>
              <span className={font('hnr', 6)}>Part of</span> {series.title}
            </p>
          ))}
        </CardPostBody>
      )}
    </CardOuter>
  );
};

export default StoryPromo;
