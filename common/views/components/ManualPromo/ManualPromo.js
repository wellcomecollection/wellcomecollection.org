// @flow
import type { ManualPromo as ManualPromoType } from '@weco/common/model/manual-promo';
import { font, classNames } from '../../../utils/classnames';
import { trackEvent } from '../../../utils/ga';
import { UiImage } from '../Images/Images';
// import LabelsList from '../LabelsList/LabelsList';
import Space from '../styled/Space';

type Props = {|
  item: ManualPromoType,
|};

const ManualPromo = ({ item }: Props) => {
  return (
    <a
      data-component="ManualPromo"
      href={item.url}
      className="plain-link promo-link bg-cream rounded-corners overflow-hidden flex-ie-block flex--column"
      onClick={() => {
        trackEvent({
          category: 'ManualPromo',
          action: 'follow link',
          label: `${item.title || ''}`,
        });
      }}
    >
      <div className="relative">
        {item.image && (
          <UiImage
            {...item.image}
            sizesQueries="(min-width: 1420px) 386px, (min-width: 960px) calc(28.64vw - 15px), (min-width: 600px) calc(50vw - 54px), calc(100vw - 36px)"
            showTasl={false}
          />
        )}
        {/*
        {labels.length > 0 && (
          <div style={{ position: 'absolute', bottom: 0 }}>
            <LabelsList labels={labels} />
          </div>
        )} */}
      </div>

      <Space
        v={{
          size: 'm',
          properties: ['padding-top', 'padding-bottom'],
        }}
        h={{ size: 'm', properties: ['padding-left', 'padding-right'] }}
        className={classNames({
          {item.title && (
            olumn flex-1 flex--h-space-between': true,
        })}
        >
        <div>
          {i  tem.title && (
              <Space
                v={{
                  size: 's',
                  properties: ['margin-bottom'],
                }}
                as="h2"
                className={classNames({
            </Space>
          )romo-link__title': true,
                [font('wb', 3)]: true,
              })}
            >
              {item.title}
            </Space>
          )}

          {item.summary && (
            <p className={`${font('hnl', 5)} no-padding no-margin`}>
              {item.summary}
            </p>
          )}
        </div>
      </Space>
    </a>
  );
};

export default ManualPromo;
