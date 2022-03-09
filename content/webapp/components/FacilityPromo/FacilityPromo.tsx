import { font, classNames } from '@weco/common/utils/classnames';
import { trackEvent } from '@weco/common/utils/ga';
import Icon from '@weco/common/views/components/Icon/Icon';
import { UiImage } from '@weco/common/views/components/Images/Images';
import { ImageType } from '@weco/common/model/image';
import Space from '@weco/common/views/components/styled/Space';
import { CardOuter, CardBody } from '../Card/Card';
import { IconSvg } from '@weco/common/icons';

type Props = {
  id: string;
  url: string;
  title: string;
  imageProps: ImageType;
  description: string;
  metaText?: string;
  metaIcon?: IconSvg;
};

const sizesQueries =
  '(min-width: 1420px) 475px, (min-width: 960px) 34.32vw, (min-width: 600px) calc(50vw - 54px), calc(100vw - 36px)';

const FacilityPromo = ({
  id,
  url,
  title,
  imageProps,
  description,
  metaText,
  metaIcon,
}: Props) => {
  const uiImageProps = {
    ...imageProps,
    sizesQueries,
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
          <UiImage {...uiImageProps} />
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
