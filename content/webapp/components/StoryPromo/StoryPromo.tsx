import { FunctionComponent } from 'react';
import { font } from '@weco/common/utils/classnames';
import { trackGaEvent } from '@weco/common/utils/ga';
import PartNumberIndicator from '../PartNumberIndicator/PartNumberIndicator';
import Space from '@weco/common/views/components/styled/Space';
import {
  CardOuter,
  CardBody,
  CardPostBody,
  CardLabels,
  CardImageWrapper,
} from '../Card/Card';
import PrismicImage from '@weco/common/views/components/PrismicImage/PrismicImage';
import {
  ArticleBasic,
  getArticleColor,
  getPartNumberInSeries,
} from '../../types/articles';
import { isNotUndefined } from '@weco/common/utils/type-guards';
import linkResolver from '@weco/common/services/prismic/link-resolver';
import styled from 'styled-components';

const Caption = styled.p.attrs({
  className: font('intr', 5),
})`
  display: inline-block;
  margin: 0;
`;

const PartOf = styled.div.attrs({
  className: font('intb', 6),
})`
  margin: 0;
`;

type Props = {
  article: ArticleBasic;
  position: number;
  hidePromoText?: boolean;
  sizesQueries?: string;
};

const StoryPromo: FunctionComponent<Props> = ({
  article,
  position,
  hidePromoText = false,
}) => {
  const image = article.promo?.image;
  const url = linkResolver(article);

  const seriesColor = getArticleColor(article);

  const partNumber = getPartNumberInSeries(article);

  const isSerial = article.series.some(series => series.schedule.length > 0);

  const labels = [article.format?.title, isSerial ? 'Serial' : undefined]
    .filter(isNotUndefined)
    .map(text => ({ text }));

  return (
    <CardOuter
      onClick={() => {
        trackGaEvent({
          category: 'StoryPromo',
          action: 'follow link',
          label: `${article.id} | position: ${position}`,
        });
      }}
      href={url}
    >
      <CardImageWrapper>
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

        {labels.length > 0 && <CardLabels labels={labels} />}
      </CardImageWrapper>

      <CardBody>
        <div>
          {partNumber && (
            <PartNumberIndicator
              number={partNumber}
              backgroundColor={seriesColor}
            />
          )}
          <Space
            v={{
              size: 's',
              properties: ['margin-bottom'],
            }}
            as="h2"
            className={`promo-link__title ${font('wb', 3)}`}
          >
            {article.title}
          </Space>
          {!hidePromoText && isNotUndefined(article.promo?.caption) && (
            <Caption>{article.promo?.caption}</Caption>
          )}
        </div>
      </CardBody>
      {article.series.length > 0 && (
        <CardPostBody>
          {article.series.map(series => (
            <PartOf key={series.id}>
              <span className={font('intr', 6)}>Part of</span> {series.title}
            </PartOf>
          ))}
        </CardPostBody>
      )}
    </CardOuter>
  );
};

export default StoryPromo;
