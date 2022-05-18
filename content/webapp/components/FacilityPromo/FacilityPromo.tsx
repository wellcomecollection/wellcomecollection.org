import { font, classNames } from '@weco/common/utils/classnames';
import { trackEvent } from '@weco/common/utils/ga';
import Icon from '@weco/common/views/components/Icon/Icon';
import PrismicImage from '@weco/common/views/components/PrismicImage/PrismicImage';
import Space from '@weco/common/views/components/styled/Space';
import { CardOuter, CardBody } from '../Card/Card';
import { FacilityPromo as FacilityPromoType } from '../../types/facility-promo';
import { FC } from 'react';

const FacilityPromo: FC<FacilityPromoType> = ({
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
        <div className="rounded-corners overflow-hidden">
          <PrismicImage
            image={uiImageProps}
            sizes={{
              xlarge: 1 / 4,
              large: 1 / 3,
              medium: 1 / 2,
              small: 1,
            }}
          />
        </div>

        <CardBody>
          <div>
            <h2
              className={classNames({
                'promo-link__title': true,
                [font('wb', 4)]: true,
              })}
            >
              {title}
            </h2>
            <p className={`${font('hnr', 5)} no-margin no-padding`}>
              {description}
            </p>

            {metaText && (
              <Space v={{ size: 'm', properties: ['margin-top'] }}>
                <div className={`${font('hnb', 6)} flex flex--v-center`}>
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
