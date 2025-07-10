import { FunctionComponent } from 'react';
import styled from 'styled-components';

import linkResolver from '@weco/common/services/prismic/link-resolver';
import { transformImage } from '@weco/common/services/prismic/transformers/images';
import { font } from '@weco/common/utils/classnames';
import { isNotUndefined } from '@weco/common/utils/type-guards';
import PrismicImage from '@weco/common/views/components/PrismicImage';
import { Article } from '@weco/content/services/wellcome/content/types/api';
import {
  CardBody,
  CardImageWrapper,
  CardLabels,
  CardOuter,
  CardPostBody,
  CardTitle,
} from '@weco/content/views/components/Card';

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

export type Props = {
  article: Article;
  hidePromoText?: boolean;
  sizesQueries?: string;
};

const StoryPromoContentApi: FunctionComponent<Props> = ({
  article,
  hidePromoText = false,
}) => {
  const { title, caption, seriesTitle, format, uid } = article;
  const rawImage = article.image?.['16:9'] || article.image;
  const image = transformImage(rawImage);
  const url = linkResolver({ uid, type: 'articles' });

  const labels = format?.label ? [{ text: format.label }] : [];

  return (
    <CardOuter href={url}>
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
          <CardTitle>{title}</CardTitle>
          {!hidePromoText && caption && <Caption>{caption}</Caption>}
        </div>
      </CardBody>
      {seriesTitle && (
        <CardPostBody>
          <PartOf>
            <span className={font('intr', 6)}>Part of</span> {seriesTitle}
          </PartOf>
        </CardPostBody>
      )}
    </CardOuter>
  );
};

export default StoryPromoContentApi;
