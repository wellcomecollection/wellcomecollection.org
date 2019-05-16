// @flow
import NextLink from 'next/link';
import styled from 'styled-components';
import { type Work } from '@weco/common/model/work';
import { classNames, spacing, font } from '@weco/common/utils/classnames';
import Icon from '@weco/common/views/components/Icon/Icon';
import LinkLabels from '@weco/common/views/components/LinkLabels/LinkLabels';
import TogglesContext from '@weco/common/views/components/TogglesContext/TogglesContext';
import {
  getPhysicalLocations,
  getDigitalLocations,
  getProductionDates,
  getWorkTypeIcon,
} from '@weco/common/utils/works';
import { trackEvent } from '@weco/common/utils/ga';
import { workUrl } from '@weco/common/services/catalogue/urls';
import IIIFResponsiveImage from '@weco/common/views/components/IIIFResponsiveImage/IIIFResponsiveImage';
import { convertImageUri } from '@weco/common/utils/convert-image-uri';
import { imageSizes } from '@weco/common/utils/image-sizes';

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
const Preview = styled.div.attrs(() => ({
  className: classNames({
    [spacing({ s: 2 }, { margin: ['left'] })]: true,
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

const WorkCard = ({ work }: Props) => {
  const digitalLocations = getDigitalLocations(work);
  const physicalLocations = getPhysicalLocations(work);
  const productionDates = getProductionDates(work);
  const workTypeIcon = getWorkTypeIcon(work);
  return (
    <div
      className={classNames({
        'border-color-pumice': true,
        'border-top-width-1': true,
      })}
    >
      <NextLink
        {...workUrl({
          id: work.id,
        })}
      >
        <a
          className={classNames({
            'plain-link': true,
            block: true,
            [spacing({ s: 3 }, { padding: ['bottom', 'top'] })]: true,
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
              <div
                className={classNames({
                  flex: true,
                  'flex--v-center': true,
                  [font({ s: 'HNL4' })]: true,
                  [spacing({ s: 1 }, { margin: ['bottom'] })]: true,
                })}
              >
                {workTypeIcon && (
                  <Icon
                    name={workTypeIcon}
                    extraClasses={classNames({
                      [spacing({ s: 1 }, { margin: ['right'] })]: true,
                    })}
                  />
                )}
                {work.workType.label}
              </div>
              <h2
                className={classNames({
                  [font({ s: 'HNM3' })]: true,
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
                  <div
                    className={classNames({
                      [spacing({ s: 2 }, { margin: ['right'] })]: true,
                    })}
                  >
                    <LinkLabels
                      items={[
                        {
                          text: work.contributors[0].agent.label,
                          url: null,
                        },
                      ]}
                    />
                  </div>
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

            {work.thumbnail && (
              <Preview>
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

          <TogglesContext.Consumer>
            {({ showWorkLocations }) =>
              showWorkLocations &&
              (digitalLocations.length > 0 || physicalLocations.length > 0) && (
                <div
                  className={classNames({
                    [spacing({ s: 2 }, { margin: ['top'] })]: true,
                  })}
                >
                  <LinkLabels
                    heading={'See it'}
                    icon={'eye'}
                    items={[
                      digitalLocations.length > 0
                        ? {
                            text: 'Online',
                            url: null,
                          }
                        : null,
                      physicalLocations.length > 0
                        ? {
                            text: 'Wellcome library',
                            url: null,
                          }
                        : null,
                    ].filter(Boolean)}
                  />
                </div>
              )
            }
          </TogglesContext.Consumer>
        </a>
      </NextLink>
    </div>
  );
};
export default WorkCard;
