import { Fragment } from 'react';
import { font, classNames } from '@weco/common/utils/classnames';
import { trackEvent } from '@weco/common/utils/ga';
import { formatDate } from '@weco/common/utils/format-date';
import { ExhibitionPromo as ExhibitionPromoProps } from '@weco/common/model/exhibitions';
import LabelsList from '@weco/common/views/components/LabelsList/LabelsList';
import StatusIndicator from '@weco/common/views/components/StatusIndicator/StatusIndicator';
import Space from '@weco/common/views/components/styled/Space';
import { CardOuter, CardBody } from '@weco/common/views/components/Card/Card';
import PrismicImage from '../PrismicImage/PrismicImage';

type Props = ExhibitionPromoProps & {
  position?: number;
};

const ExhibitionPromo = ({
  format,
  id,
  url,
  title,
  image,
  start,
  end,
  statusOverride,
  position = 0,
}: Props) => {
  return (
    <CardOuter
      data-component="ExhibitionPromo"
      data-component-state={JSON.stringify({ position: position })}
      id={id}
      href={url}
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
          <PrismicImage
            image={{
              url: image.contentUrl,
              dimensions: {
                width: image.width,
                height: image.height || 0,
              },
              alt: image.alt,
              copyright: '',
            }}
            sizes={{
              xlarge: 1 / 3,
              large: 1 / 3,
              medium: 1 / 2,
              small: 1,
            }}
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
                      text: `${
                        format.title === 'Permanent'
                          ? 'Permanent exhibition'
                          : format.title
                      }`,
                    },
                  ]
                : [{ text: 'Exhibition' }]
            }
          />
        </div>
      </div>

      <CardBody>
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
              className={`${font('hnr', 5)} no-padding`}
            >
              <Fragment>
                <time dateTime={formatDate(start)}>{formatDate(start)}</time>—
                <time dateTime={formatDate(end)}>{formatDate(end)}</time>
              </Fragment>
            </Space>
          )}

          <StatusIndicator
            start={start}
            end={end || new Date()}
            statusOverride={statusOverride}
          />
        </div>
      </CardBody>
    </CardOuter>
  );
};

export default ExhibitionPromo;
