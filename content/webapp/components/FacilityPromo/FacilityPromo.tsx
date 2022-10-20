import { font } from '@weco/common/utils/classnames';
import { trackEvent } from '@weco/common/utils/ga';
import Icon from '@weco/common/views/components/Icon/Icon';
import PrismicImage from '@weco/common/views/components/PrismicImage/PrismicImage';
import Space from '@weco/common/views/components/styled/Space';
import { CardOuter, CardBody } from '../Card/Card';
import { FacilityPromo as FacilityPromoType } from '../../types/facility-promo';
import { FunctionComponent } from 'react';
import styled from 'styled-components';

const ImageWrapper = styled.div.attrs({
  className: 'rounded-corners',
})`
  overflow: hidden;
`;

const FacilityPromo: FunctionComponent<FacilityPromoType> = ({
  id,
  url,
  title,
  image,
  description,
  metaText,
  metaIcon,
}: FacilityPromoType) => {
  const uiImageProps = {
    ...image,
  };
  return (
    <CardOuter
      data-component="FacilityPromo"
      onClick={() => {
        trackEvent({
          category: 'FacilityPromo',
          action: 'follow link',
          label: title,
        });
      }}
      id={id}
      href={url}
    >
      <div>
        <ImageWrapper>
          <PrismicImage
            image={uiImageProps}
            sizes={{
              xlarge: 1 / 4,
              large: 1 / 3,
              medium: 1 / 2,
              small: 1,
            }}
            quality="low"
          />
        </ImageWrapper>

        <CardBody>
          <div>
            <h2 className={`promo-link__title ${font('wb', 4)}`}>{title}</h2>
            <p className={`${font('intr', 5)} no-margin no-padding`}>
              {description}
            </p>

            {metaText && (
              <Space v={{ size: 'm', properties: ['margin-top'] }}>
                <div className={`${font('intb', 6)} flex flex--v-center`}>
                  {metaIcon && (
                    <Space
                      as="span"
                      h={{ size: 's', properties: ['margin-right'] }}
                    >
                      <Icon icon={metaIcon} />
                    </Space>
                  )}
                  <span>{metaText}</span>
                </div>
              </Space>
            )}
          </div>
        </CardBody>
      </div>
    </CardOuter>
  );
};
export default FacilityPromo;
