// @flow
import type { ComponentType } from 'react';
import NextLink from 'next/link';
import styled from 'styled-components';
import { type Work } from '@weco/common/model/work';
import { classNames, font } from '@weco/common/utils/classnames';
import Icon from '@weco/common/views/components/Icon/Icon';
import LinkLabels from '@weco/common/views/components/LinkLabels/LinkLabels';
import { getProductionDates, getWorkTypeIcon } from '@weco/common/utils/works';
import { trackEvent } from '@weco/common/utils/ga';
import { workLink } from '@weco/common/services/catalogue/routes';
import IIIFResponsiveImage from '@weco/common/views/components/IIIFResponsiveImage/IIIFResponsiveImage';
import { convertImageUri } from '@weco/common/utils/convert-image-uri';
import { imageSizes } from '@weco/common/utils/image-sizes';
import Space, {
  type SpaceComponentProps,
} from '@weco/common/views/components/styled/Space';

type Props = {|
  work: Work,
|};

const Container = styled.div`
  ${props => props.theme.media.medium`
    display: flex;
  `}
`;
const Details = styled.div`
  ${props => props.theme.media.medium`
    flex-grow: 1;
  `}
`;
const Preview: ComponentType<SpaceComponentProps> = styled(Space).attrs(() => ({
  className: classNames({
    'text-align-center': true,
  }),
}))`
  flex-grow: 0;
  flex-shrink: 0;
  flex-basis: 178px;
  height: 178px;
  margin-top: ${props => props.theme.spacingUnit * 2}px;

  ${props => props.theme.media.medium`
    margin-top: 0;
  `}

  img {
    width: auto;
    height: auto;
    max-width: 100%;
    max-height: 100%;
  }
`;

// TODO: remove, hack to handle the fact that we are pulling through PDF thumbnails.
// These will be removed from the API at some stage.
function isPdfThumbnail(thumbnail): boolean {
  // e.g. https://dlcs.io/iiif-img/wellcome/5/b28820769_WG_2006_PAAG-implementing-persistent-identifiers_EN.pdf/full/!200,200/0/default.jpg
  return Boolean(thumbnail.url.match('.pdf/full'));
}

const WorkCard = ({ work }: Props) => {
  const productionDates = getProductionDates(work);
  const workTypeIcon = getWorkTypeIcon(work);
  return (
    <div
      className={classNames({
        'border-color-pumice': true,
        'border-top-width-1': true,
      })}
    >
      <NextLink {...workLink({ id: work.id })} passHref>
        <Space
          as="a"
          v={{
            size: 'm',
            properties: ['padding-top', 'padding-bottom'],
          }}
          className={classNames({
            'plain-link': true,
            block: true,
            'card-link': true,
          })}
          onClick={() => {
            trackEvent({
              category: 'WorkCard',
              action: 'follow link',
              label: work.id,
            });
          }}
        >
          <Container>
            <Details>
              <Space
                v={{
                  size: 's',
                  properties: ['margin-bottom'],
                }}
                className={classNames({
                  flex: true,
                  'flex--v-center': true,
                  [font('hnl', 5)]: true,
                })}
              >
                {workTypeIcon && (
                  <Space
                    as="span"
                    h={{ size: 's', properties: ['margin-right'] }}
                  >
                    <Icon name={workTypeIcon} />
                  </Space>
                )}
                {work.workType.label}
              </Space>
              <h2
                className={classNames({
                  [font('hnm', 4)]: true,
                  'card-link__title': true,
                })}
              >
                {work.title}
              </h2>
              <div
                className={classNames({
                  flex: true,
                })}
              >
                {work.contributors.length > 0 && (
                  <Space h={{ size: 'm', properties: ['margin-right'] }}>
                    <LinkLabels
                      items={[
                        {
                          text: work.contributors[0].agent.label,
                          url: null,
                        },
                      ]}
                    />
                  </Space>
                )}
                {productionDates.length > 0 && (
                  <LinkLabels
                    heading={'Date'}
                    items={[
                      {
                        text: productionDates[0],
                        url: null,
                      },
                    ]}
                  />
                )}
              </div>
            </Details>
            {work.thumbnail &&
            !isPdfThumbnail(work.thumbnail) &&
            ['k', 'q'].includes(work.workType.id) && ( // Only show thumbnails for 'Pictures' and 'Digital Images' for now
                <Preview h={{ size: 'm', properties: ['margin-left'] }}>
                  <IIIFResponsiveImage
                    width={178}
                    src={convertImageUri(work.thumbnail.url, 178)}
                    srcSet={imageSizes(2048)
                      .map(width => {
                        return `${convertImageUri(
                          work.thumbnail.url,
                          width
                        )} ${width}w`;
                      })
                      .join(',')}
                    sizes={`178px`}
                    alt={''}
                    lang={null}
                    extraClasses={classNames({
                      'h-center': true,
                    })}
                    isLazy={true}
                  />
                </Preview>
              )}
          </Container>
        </Space>
      </NextLink>
    </div>
  );
};
export default WorkCard;
