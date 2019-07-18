// @flow
import { font, classNames } from '../../../utils/classnames';
import { trackEvent } from '../../../utils/ga';
import Icon from '../Icon/Icon';
import { UiImage } from '../Images/Images';
import type { ImageType } from '../../../model/image';
import VerticalSpace from '../styled/VerticalSpace';

type Props = {|
  id: string,
  url: string,
  title: string,
  imageProps: ImageType,
  description: string,
  metaText: ?string,
  metaIcon: ?string,
|};

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
    <a
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
      className="plain-link promo-link"
    >
      <div>
        <div className="rounded-corners overflow-hidden">
          <UiImage {...uiImageProps} />
        </div>

        <VerticalSpace
          as="h2"
          size="s"
          properties={['margin-top']}
          className={classNames({
            'promo-link__title': true,
            [font({ s: 'WB6' })]: true,
          })}
        >
          {title}
        </VerticalSpace>
        <p className={`${font({ s: 'HNL5' })} no-margin no-padding`}>
          {description}
        </p>

        {metaText && (
          <VerticalSpace size="m" properties={['padding-top']}>
            <div className={`${font({ s: 'HNM5' })} flex flex--v-center`}>
              {metaIcon && (
                <Icon name={metaIcon} extraClasses="margin-right-s1" />
              )}
              <span>{metaText}</span>
            </div>
          </VerticalSpace>
        )}
      </div>
    </a>
  );
};
export default FacilityPromo;
