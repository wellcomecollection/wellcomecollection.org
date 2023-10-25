import { FunctionComponent } from 'react';
import styled from 'styled-components';
import { font } from '@weco/common/utils/classnames';
import { trackGaEvent } from '@weco/common/utils/ga';
import StatusIndicator from '@weco/content/components/StatusIndicator/StatusIndicator';
import Space from '@weco/common/views/components/styled/Space';
import {
  CardOuter,
  CardBody,
  CardLabels,
  CardImageWrapper,
  CardTitle,
} from '../Card/Card';
import PrismicImage from '@weco/common/views/components/PrismicImage/PrismicImage';
import { ExhibitionBasic } from '@weco/content/types/exhibitions';
import linkResolver from '@weco/common/services/prismic/link-resolver';
import { isNotUndefined } from '@weco/common/utils/type-guards';
import DateRange from '@weco/content/components/DateRange/DateRange';

const DateWrapper = styled(Space).attrs({
  className: font('intr', 5),
  $v: { size: 'm', properties: ['margin-bottom'] },
})`
  padding: 0;
`;

type Props = {
  exhibition: ExhibitionBasic;
  position?: number;
};

const ExhibitionPromo: FunctionComponent<Props> = ({
  exhibition,
  position = 0,
}) => {
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
        trackGaEvent({
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
          <CardTitle>{exhibition.title}</CardTitle>

          {!statusOverride && !isPermanent && start && end && (
            <DateWrapper as="p">
              <DateRange start={start} end={end} />
            </DateWrapper>
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
