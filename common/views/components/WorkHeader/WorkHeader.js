// @flow
import { type Work } from '../../../model/work';
import { font, classNames, grid } from '../../../utils/classnames';
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
import Space from '../styled/Space';
import Number from '@weco/common/views/components/Number/Number';

type Props = {|
  work: Work,
  childManifestsCount?: number,
|};

const WorkHeader = ({ work, childManifestsCount = 0 }: Props) => {
  const digitalLocations = getDigitalLocations(work);
  const physicalLocations = getPhysicalLocations(work);
  const productionDates = getProductionDates(work);
  const workTypeIcon = getWorkTypeIcon(work);
  return (
    <Space
      v={{
        size: 'l',
        properties: ['margin-bottom'],
      }}
      className={classNames([grid({ s: 12, m: 12, l: 10, xl: 10 })])}
    >
      <SpacingComponent>
        <div
          className={classNames({
            flex: true,
            'flex--v-center': true,
            [font('hnl', 5)]: true,
          })}
        >
          {workTypeIcon && (
            <Icon
              name={workTypeIcon}
              extraClasses={classNames({
                'margin-right-6': true,
              })}
            />
          )}
          <div className="line-height-1">{work.workType.label}</div>
        </div>

        <h1
          id="work-info"
          className={classNames({
            'no-margin': true,
            [font('hnm', 2)]: true,
          })}
          lang={work.language && work.language.id}
        >
          {work.title}
        </h1>

        {(work.contributors.length > 0 || productionDates.length > 0) && (
          <Space
            v={{
              size: 'l',
              properties: ['margin-top'],
            }}
            className={classNames({
              'flex flex--wrap flex--v-center': true,
            })}
          >
            {work.contributors.length > 0 && (
              <div
                className={classNames({
                  'margin-right-12': true,
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
          </Space>
        )}
        <TogglesContext.Consumer>
          {toggles =>
            toggles.showWorkLocations &&
            (digitalLocations.length > 0 || physicalLocations.length > 0) && (
              <Space v={{ size: 'm', properties: ['margin-top'] }}>
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
              </Space>
            )
          }
        </TogglesContext.Consumer>
        {childManifestsCount > 0 && (
          <Space v={{ size: 'm', properties: ['margin-top'] }}>
            <p
              className={classNames({
                [font('hnm', 5)]: true,
                'no-margin': true,
              })}
            >
              <Number color="yellow" number={childManifestsCount} /> Volumes
              online
            </p>
          </Space>
        )}
      </SpacingComponent>
    </Space>
  );
};
export default WorkHeader;
