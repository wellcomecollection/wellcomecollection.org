import { font } from '@weco/common/utils/classnames';
import Icon from '@weco/common/views/components/Icon/Icon';
import PrismicImage from '@weco/common/views/components/PrismicImage/PrismicImage';
import Space from '@weco/common/views/components/styled/Space';
import { CardOuter, CardBody } from '../Card/Card';
import { FacilityPromo as FacilityPromoType } from '../../types/facility-promo';
import { FunctionComponent } from 'react';
import styled from 'styled-components';

const ImageWrapper = styled.div`
  border-radius: ${props => props.theme.borderRadiusUnit}px;
  overflow: hidden;
`;

const Description = styled.p.attrs({
  className: font('intr', 5),
})`
  margin: 0;
  padding: 0;
`;

const Meta = styled.div.attrs({
  className: font('intb', 6),
})`
  display: flex;
  align-items: center;
`;

const FacilityPromo: FunctionComponent<FacilityPromoType> = ({
  id,
  url,
  title,
  image,
  description,
  metaText,
  metaIcon,
}) => {
  return (
    <CardOuter data-component="FacilityPromo" id={id} href={url}>
      <div>
        <ImageWrapper>
          <PrismicImage
            image={{ ...image, alt: '' }}
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
            <h3 className={font('wb', 4)}>{title}</h3>
            <Description>{description}</Description>

            {metaText && (
              <Space v={{ size: 'm', properties: ['margin-top'] }}>
                <Meta>
                  {metaIcon && (
                    <Space
                      as="span"
                      h={{ size: 's', properties: ['margin-right'] }}
                    >
                      <Icon icon={metaIcon} />
                    </Space>
                  )}
                  <span>{metaText}</span>
                </Meta>
              </Space>
            )}
          </div>
        </CardBody>
      </div>
    </CardOuter>
  );
};
export default FacilityPromo;
