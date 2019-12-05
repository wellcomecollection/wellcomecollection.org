// @flow
import { Fragment } from 'react';
import { font, classNames } from '../../../utils/classnames';
import { trackEvent } from '../../../utils/ga';
import { formatDate } from '../../../utils/format-date';
import { UiImage } from '../Images/Images';
import LabelsList from '../LabelsList/LabelsList';
import { type ExhibitionPromo as ExhibitionPromoProps } from '../../../model/exhibitions';
import StatusIndicator from '../StatusIndicator/StatusIndicator';
import Space from '../styled/Space';

type Props = {|
  ...ExhibitionPromoProps,
  position?: number,
|};

const ExhibitionPromo = ({
  format,
  id,
  url,
  title,
  shortTitle,
  image,
  start,
  end,
  statusOverride,
  position = 0,
}: Props) => {
  return (
    <a
      data-component="ExhibitionPromo"
      data-component-state={JSON.stringify({ position: position })}
      id={id}
      href={url}
      className="plain-link promo-link bg-cream rounded-corners overflow-hidden flex--column flex-ie-block"
      onClick={() => {
        trackEvent({
          category: 'ExhibitionPromo',
          action: 'follow link',
          label: `${id} | position: ${position}`,
        });
      }}
    >
      <div className="relative">
        {image && image.contentUrl && (
          <UiImage
            {...image}
            sizesQueries="(min-width: 1420px) 386px, (min-width: 960px) calc(28.64vw - 15px), (min-width: 600px) calc(50vw - 54px), calc(100vw - 36px)"
            showTasl={false}
          />
        )}

        <div style={{ position: 'absolute', bottom: 0 }}>
          {/*
            TODO: Change the format label in Prismic to Permanent exhibition,
            and remove this hack
          */}
          <LabelsList
            labels={
              format
                ? [
                    {
                      url: null,
                      text: `${
                        format.title === 'Permanent'
                          ? 'Permanent exhibition'
                          : format.title
                      }`,
                    },
                  ]
                : [{ url: null, text: 'Exhibition' }]
            }
          />
        </div>
      </div>

      <Space
        v={{
          size: 'm',
          properties: ['padding-top', 'padding-bottom'],
        }}
        h={{ size: 'm', properties: ['padding-left', 'padding-right'] }}
        className={`
          flex flex--column flex-1 flex--h-space-between
        `}
      >
        <div>
          <Space
            v={{
              size: 's',
              properties: ['margin-bottom'],
            }}
            className={classNames({
              'promo-link__title': true,
              [font('wb', 3)]: true,
            })}
          >
            {title}
          </Space>

          {!statusOverride && start && end && (
            <Space
              as="p"
              v={{ size: 'm', properties: ['margin-bottom'] }}
              className={`${font('hnl', 5)} no-padding`}
            >
              <Fragment>
                <time dateTime={start}>{formatDate(start)}</time>—
                <time dateTime={end}>{formatDate(end)}</time>
              </Fragment>
            </Space>
          )}

          <StatusIndicator
            start={start}
            end={end || new Date()}
            statusOverride={statusOverride}
          />
        </div>
      </Space>
    </a>
  );
};

export default ExhibitionPromo;
