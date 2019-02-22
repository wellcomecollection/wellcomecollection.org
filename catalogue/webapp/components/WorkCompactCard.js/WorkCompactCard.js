// @flow
import NextLink from 'next/link';
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
import { workUrl } from '../../services/catalogue/urls';

type Props = {|
  work: Work,
  query: ?string,
  page: ?number,
  workType: string[],
  itemsLocationsLocationType: string[],
|};

const WorkCompactCard = ({
  work,
  query,
  page,
  workType,
  itemsLocationsLocationType,
}: Props) => {
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
        href={
          workUrl({
            id: work.id,
            query,
            page,
            workType,
            itemsLocationsLocationType,
          }).href
        }
        as={
          workUrl({
            id: work.id,
            query,
            page,
            workType,
            itemsLocationsLocationType,
          }).as
        }
      >
        <a
          className={classNames({
            'plain-link': true,
            block: true,
            [spacing({ s: 3 }, { padding: ['bottom', 'top'] })]: true,
            'card-link': true,
          })}
        >
          <div className="flex">
            <div style={{ flexGrow: 1 }}>
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
                  <LinkLabels
                    items={work.contributors.map(({ agent }) => ({
                      text: agent.label,
                      url: null,
                    }))}
                  />
                )}
                {productionDates.length > 0 && (
                  <div
                    className={classNames({
                      [spacing({ s: 2 }, { margin: ['left'] })]: true,
                    })}
                  >
                    <LinkLabels
                      heading={'Date'}
                      items={productionDates.map(date => ({
                        text: date,
                        url: null,
                      }))}
                    />
                  </div>
                )}
              </div>
            </div>
            {/**/}
            <div
              className={classNames({
                [spacing({ s: 2 }, { margin: ['left'] })]: true,
                'text-align-center': true,
              })}
              style={{
                flexGrow: 0,
                flexShrink: 0,
                flexBasis: '178px',
                height: '178px',
              }}
            >
              {work.thumbnail && (
                <img
                  src={work.thumbnail.url}
                  className={classNames({
                    'h-center': true,
                  })}
                  style={{
                    width: 'auto',
                    height: 'auto',
                    maxWidth: '100%',
                    maxHeight: '100%',
                  }}
                />
              )}
            </div>
          </div>

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
                            text: 'Open Shelves + Closed Stores',
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
export default WorkCompactCard;
