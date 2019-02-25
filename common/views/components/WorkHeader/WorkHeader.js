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
import TogglesContext from '../TogglesContext/TogglesContext';
import WorkTags from '../WorkTags/WorkTags';
import { worksUrl } from '../../../services/catalogue/urls';

type Props = {|
  work: Work,
|};

const WorkHeader = ({ work }: Props) => {
  const digitalLocations = getDigitalLocations(work);
  const physicalLocations = getPhysicalLocations(work);
  const productionDates = getProductionDates(work);
  const workTypeIcon = getWorkTypeIcon(work);
  return (
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
            [font({ s: 'HNL4' })]: true,
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
          <div className="line-height-1">{work.workType.label}</div>
        </div>

        <h1
          id="work-info"
          className={classNames({
            'no-margin': true,
            [font({ s: 'HNM3', m: 'HNM2', l: 'HNM1' })]: true,
          })}
        >
          {work.title}
        </h1>

        {(work.contributors.length > 0 || productionDates.length > 0) && (
          <div
            className={classNames({
              'flex flex--wrap flex--v-center': true,
              [spacing({ s: 3, m: 4 }, { margin: ['top'] })]: true,
            })}
          >
            {work.contributors.length > 0 && (
              <div
                className={classNames({
                  [spacing({ s: 2 }, { margin: ['right'] })]: true,
                })}
              >
                <WorkTags
                  tags={work.contributors.map(({ agent }) => {
                    return {
                      query: agent.label,
                      textParts: [agent.label],
                      linkAttributes: worksUrl({
                        query: `"${agent.label}"`,
                        page: 1,
                      }),
                    };
                  })}
                />
              </div>
            )}

            {productionDates.length > 0 && (
              <LinkLabels
                heading={'Date'}
                items={productionDates.map(date => ({
                  text: date,
                  url: null,
                }))}
              />
            )}
          </div>
        )}
        <TogglesContext.Consumer>
          {toggles =>
            toggles.showWorkLocations &&
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
                          text: 'Wellcome Library',
                          url: null,
                        }
                      : null,
                  ].filter(Boolean)}
                />
              </div>
            )
          }
        </TogglesContext.Consumer>
      </SpacingComponent>
    </div>
  );
};
export default WorkHeader;
