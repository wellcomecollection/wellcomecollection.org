// @flow
import { type Work } from '../../../model/work';
import { font, classNames, spacing, grid } from '../../../utils/classnames';
import {
  getDigitalLocations,
  getPhysicalLocations,
  getProductionDates,
  getWorkTypeIcon,
} from '../../../utils/works';
import Icon from '../Icon/Icon';
import SpacingComponent from '../SpacingComponent/SpacingComponent';
import LinkLabels from '../LinkLabels/LinkLabels';

type Props = {|
  work: Work,
|};

const WorkHeader = ({ work }: Props) => {
  const digitalLocations = getDigitalLocations(work);
  const physicalLocations = getPhysicalLocations(work);
  const productionDates = getProductionDates(work);
  const workTypeIcon = getWorkTypeIcon(work);
  return (
    <div className={`row ${spacing({ s: 6 }, { padding: ['top', 'bottom'] })}`}>
      <div className="container">
        <div className="grid">
          <div
            className={classNames([
              grid({ s: 12, m: 12, l: 10, xl: 10 }),
              spacing({ s: 4 }, { margin: ['bottom'] }),
            ])}
          >
            <SpacingComponent>
              <div
                className={classNames({
                  flex: true,
                  'flex--v-center': true,
                  [font({ s: 'HNL3' })]: true,
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

              <h1
                id="work-info"
                className={classNames([
                  font({ s: 'HNM3', m: 'HNM2', l: 'HNM1' }),
                  spacing({ s: 0 }, { margin: ['top'] }),
                ])}
              >
                {work.title}
              </h1>

              <div
                className={classNames({
                  flex: true,
                })}
              >
                {work.contributors.length > 0 && (
                  <LinkLabels
                    items={work.contributors.map(({ agent }) => ({
                      text: agent.label,
                      url: `/works?query="${agent.label}"`,
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

              {(digitalLocations.length > 0 ||
                physicalLocations.length > 0) && (
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
                            text: 'Wellcome Library',
                            url: null,
                          }
                        : null,
                    ].filter(Boolean)}
                  />
                </div>
              )}
            </SpacingComponent>
          </div>
        </div>
      </div>
    </div>
  );
};
export default WorkHeader;
