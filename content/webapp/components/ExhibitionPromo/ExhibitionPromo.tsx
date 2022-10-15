import { FC } from 'react';
import { font } from '@weco/common/utils/classnames';
import { trackEvent } from '@weco/common/utils/ga';
import StatusIndicator from '../../components/StatusIndicator/StatusIndicator';
import Space from '@weco/common/views/components/styled/Space';
import {
  CardOuter,
  CardBody,
  CardLabels,
  CardImageWrapper,
} from '../Card/Card';
import PrismicImage from '@weco/common/views/components/PrismicImage/PrismicImage';
import { ExhibitionBasic } from '../../types/exhibitions';
import linkResolver from '@weco/common/services/prismic/link-resolver';
import { isNotUndefined } from '@weco/common/utils/array';
import HTMLDate from '@weco/common/views/components/HTMLDate/HTMLDate';

type Props = {
  exhibition: ExhibitionBasic;
  position?: number;
};

const ExhibitionPromo: FC<Props> = ({ exhibition, position = 0 }) => {
  const { start, end, statusOverride, isPermanent, hideStatus } = exhibition;
  const url = linkResolver(exhibition);
  const image = exhibition.promo?.image;

  const labels = exhibition.format?.title
    ? [{ text: exhibition.format.title }]
    : [{ text: 'Exhibition' }];

  return (
    <CardOuter
      data-component="ExhibitionPromo"
      data-component-state={JSON.stringify({ position })}
      id={exhibition.id}
      href={url}
      onClick={() => {
        trackEvent({
          category: 'ExhibitionPromo',
          action: 'follow link',
          label: `${exhibition.id} | position: ${position}`,
        });
      }}
    >
      <CardImageWrapper>
        {isNotUndefined(image) ? (
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
        ) : undefined}

        <CardLabels labels={labels} />
      </CardImageWrapper>

      <CardBody>
        <div>
          <Space
            v={{
              size: 's',
              properties: ['margin-bottom'],
            }}
            className={`promo-link__title ${font('wb', 3)}`}
          >
            {exhibition.title}
          </Space>

          {!statusOverride && !isPermanent && start && end && (
            <Space
              as="p"
              v={{ size: 'm', properties: ['margin-bottom'] }}
              className={`${font('intr', 5)} no-padding`}
            >
              <HTMLDate date={start} />
              {' – '}
              <HTMLDate date={end} />
            </Space>
          )}

          {!hideStatus && (
            <StatusIndicator
              start={start}
              end={end ?? new Date()}
              statusOverride={statusOverride}
            />
          )}
        </div>
      </CardBody>
    </CardOuter>
  );
};

export default ExhibitionPromo;
