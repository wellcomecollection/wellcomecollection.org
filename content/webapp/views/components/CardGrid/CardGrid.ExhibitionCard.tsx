import { FunctionComponent } from 'react';
import styled from 'styled-components';

import linkResolver from '@weco/common/services/prismic/link-resolver';
import { font } from '@weco/common/utils/classnames';
import { isNotUndefined } from '@weco/common/utils/type-guards';
import PrismicImage from '@weco/common/views/components/PrismicImage';
import Space from '@weco/common/views/components/styled/Space';
import { ExhibitionBasic } from '@weco/content/types/exhibitions';
import {
  CardBody,
  CardImageWrapper,
  CardLabels,
  CardOuter,
  CardTitle,
} from '@weco/content/views/components/Card';
import DateRange from '@weco/content/views/components/DateRange';
import StatusIndicator from '@weco/content/views/components/StatusIndicator';

const DateWrapper = styled(Space).attrs({
  className: font('sans', -1),
  $v: { size: 'sm', properties: ['margin-bottom'] },
})`
  padding: 0;
`;

type Props = {
  exhibition: ExhibitionBasic;
  position?: number;
};

const ExhibitionCard: FunctionComponent<Props> = ({
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
      data-component="exhibition-promo"
      data-component-state={JSON.stringify({ position })}
      id={exhibition.id}
      href={url}
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
              lg: 1 / 3,
              md: 1 / 3,
              sm: 1 / 2,
              zero: 1,
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

export default ExhibitionCard;
