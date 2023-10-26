import { FunctionComponent } from 'react';
import { font } from '@weco/common/utils/classnames';
import { ExhibitionGuideBasic } from '@weco/content/types/exhibition-guides';
import Space from '@weco/common/views/components/styled/Space';
import { CardOuter, CardBody, CardImageWrapper, CardTitle } from '../Card/Card';
import PrismicImage from '@weco/common/views/components/PrismicImage/PrismicImage';

type Props = {
  exhibitionGuide: ExhibitionGuideBasic;
};

const ExhibitionGuidePromo: FunctionComponent<Props> = ({
  exhibitionGuide,
}) => {
  return (
    <CardOuter
      data-component="ExhibitionGuidePromo"
      href={
        exhibitionGuide.promo?.link ||
        `/guides/exhibitions/${exhibitionGuide.id}`
      }
    >
      {exhibitionGuide.promo?.image && (
        <CardImageWrapper>
          <PrismicImage
            // We intentionally omit the alt text on promos, so screen reader
            // users don't have to listen to the alt text before hearing the
            // title of the item in the list.
            image={{
              ...exhibitionGuide.promo.image,
              alt: '',
            }}
            sizes={{
              xlarge: 1 / 4,
              large: 1 / 3,
              medium: 1 / 2,
              small: 1,
            }}
            quality="low"
          />
        </CardImageWrapper>
      )}

      <CardBody>
        <div>
          <CardTitle>{exhibitionGuide.title}</CardTitle>
          {exhibitionGuide.promo?.caption && (
            <Space $v={{ size: 's', properties: ['margin-top'] }}>
              <p className={font('intr', 5)} style={{ marginBottom: 0 }}>
                {exhibitionGuide.promo.caption}
              </p>
            </Space>
          )}
        </div>
      </CardBody>
    </CardOuter>
  );
};

export default ExhibitionGuidePromo;
