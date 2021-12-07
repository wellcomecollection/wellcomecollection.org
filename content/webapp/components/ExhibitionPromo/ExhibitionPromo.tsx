import { Fragment } from 'react';
import * as prismicH from 'prismic-helpers-beta';
import { font, classNames } from '@weco/common/utils/classnames';
import { trackEvent } from '@weco/common/utils/ga';
import { formatDate } from '@weco/common/utils/format-date';
import LabelsList from '@weco/common/views/components/LabelsList/LabelsList';
import StatusIndicator from '@weco/common/views/components/StatusIndicator/StatusIndicator';
import Space from '@weco/common/views/components/styled/Space';
import { CardOuter, CardBody } from '@weco/common/views/components/Card/Card';
import PrismicImage from '../PrismicImage/PrismicImage';
import { ExhibitionPrismicDocument } from '../../services/prismic/types/exhibitions';
import { transformMeta } from '../../services/prismic/transformers';
import {
  InferDataInterface,
  isFilledLinkToDocumentWithData,
} from '../../services/prismic/types';

type Props = {
  exhibition: ExhibitionPrismicDocument;
  position?: number;
};

function transformLabels(
  format: InferDataInterface<ExhibitionPrismicDocument>['format']
) {
  if (isFilledLinkToDocumentWithData(format)) {
    const title = prismicH.asText(format.data.title);
    return [{ text: title }];
  }

  return [{ text: 'Exhibition' }];
}

const ExhibitionPromo = ({ exhibition, position = 0 }: Props) => {
  const meta = transformMeta(exhibition);
  const { format } = exhibition.data;

  const start = exhibition.data.start
    ? new Date(exhibition.data.start)
    : undefined;

  const end = exhibition.data.end ? new Date(exhibition.data.end) : undefined;

  const statusOverride = exhibition.data.statusOverride
    ? prismicH.asText(exhibition.data.statusOverride)
    : undefined;

  const isPermanent = exhibition.data.isPermanent === 'yes';

  return (
    <CardOuter
      data-component="ExhibitionPromo"
      data-component-state={JSON.stringify({ position: position })}
      id={exhibition.id}
      href={meta.url}
      onClick={() => {
        trackEvent({
          category: 'ExhibitionPromo',
          action: 'follow link',
          label: `${exhibition.id} | position: ${position}`,
        });
      }}
    >
      <div className="relative">
        {meta.image?.['16:9'] && (
          <PrismicImage
            image={meta.image['16:9']}
            sizes={{
              xlarge: 1 / 3,
              large: 1 / 3,
              medium: 1 / 2,
              small: 1,
            }}
          />
        )}

        <div style={{ position: 'absolute', bottom: 0 }}>
          <LabelsList labels={transformLabels(format)} />
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
            {meta.title}
          </Space>

          {!statusOverride && !isPermanent && start && end && (
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
            start={start ?? new Date()}
            end={end ?? new Date()}
            statusOverride={statusOverride}
          />
        </div>
      </CardBody>
    </CardOuter>
  );
};

export default ExhibitionPromo;
