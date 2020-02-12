// @flow
import { type Work } from '../../../model/work';
import { font, classNames, grid } from '../../../utils/classnames';
import { getProductionDates, getWorkTypeIcon } from '../../../utils/works';
import Icon from '../Icon/Icon';
import SpacingComponent from '../SpacingComponent/SpacingComponent';
import LinkLabels from '../LinkLabels/LinkLabels';
import Space from '../styled/Space';
import Number from '@weco/common/views/components/Number/Number';
import styled from 'styled-components';

const WorkHeaderContainer = styled.div.attrs(props => ({
  className: classNames({
    flex: true,
  }),
}))`
  width: 100%;
  align-content: flex-start;
`;

type Props = {|
  work: Work,
  childManifestsCount?: number,
|};

const WorkHeader = ({ work, childManifestsCount = 0 }: Props) => {
  const productionDates = getProductionDates(work);
  const workTypeIcon = getWorkTypeIcon(work);
  return (
    <WorkHeaderContainer>
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
              <Space as="span" h={{ size: 's', properties: ['margin-right'] }}>
                <Icon name={workTypeIcon} />
              </Space>
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
            </Space>
          )}

          {childManifestsCount > 0 && (
            <Space v={{ size: 'm', properties: ['margin-top'] }}>
              <p
                className={classNames({
                  [font('hnm', 5)]: true,
                  'no-margin': true,
                })}
              >
                <Number color="yellow" number={childManifestsCount} /> volumes
                online
              </p>
            </Space>
          )}
        </SpacingComponent>
      </Space>
    </WorkHeaderContainer>
  );
};
export default WorkHeader;
