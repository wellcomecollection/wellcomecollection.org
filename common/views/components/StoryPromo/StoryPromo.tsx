import { FunctionComponent } from 'react';
import { font, classNames } from '../../../utils/classnames';
import { trackEvent } from '../../../utils/ga';
import {
  getPositionInSeries,
  getArticleColor,
  Article,
} from '../../../model/articles';
import { UiImage } from '../Images/Images';
import LabelsList from '../LabelsList/LabelsList';
import PartNumberIndicator from '../PartNumberIndicator/PartNumberIndicator';
import Space from '../styled/Space';
import { CardOuter, CardBody, CardPostBody } from '../Card/Card';

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
  sizesQueries = `(min-width: 1420px) 386px, (min-width: 960px) calc(28.64vw - 15px), (min-width: 600px) calc(50vw - 54px), calc(100vw - 36px)`,
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
          // $FlowFixMe
          <UiImage
            {...item.promoImage}
            alt=""
            sizesQueries={sizesQueries}
            showTasl={false}
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
