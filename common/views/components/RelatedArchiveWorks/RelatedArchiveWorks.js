// @flow
import { type Work } from '@weco/common/model/work';
import styled from 'styled-components';
import NextLink from 'next/link';
import { classNames, cssGrid, font } from '../../../utils/classnames';
import { type ArchiveNode } from '@weco/common/utils/works';
import { workLink } from '@weco/common/services/catalogue/routes';
import Layout12 from '@weco/common/views/components/Layout12/Layout12';
import Space from '@weco/common/views/components/styled/Space';
// import Icon from '@weco/common/views/components/Icon/Icon';
import Divider from '@weco/common/views/components/Divider/Divider';
import SpacingComponent from '@weco/common/views/components/SpacingComponent/SpacingComponent';
// $FlowFixMe (tsx)
import WorkTitle from '@weco/common/views/components/WorkTitle/WorkTitle';

const WorkLink = styled.a`
  display: block;
  border: 1px solid ${props => props.theme.color('pewter')};
  border-radius: ${props => `${props.theme.borderRadiusUnit}px`};
  padding: ${props => `${props.theme.spacingUnit * 2}px`};
  cursor: pointer;
  min-height: 100px;
  text-decoration: none;
  &:hover,
  &:focus {
    background: ${props => props.theme.color('charcoal')};
    color: ${props => props.theme.color('white')};
  }
`;

type WorksGridProps = {|
  title: string,
  works: ArchiveNode[],
|};

const WorksGrid = ({ title, works }: WorksGridProps) => {
  return (
    <Space v={{ size: 'xl', properties: ['margin-bottom'] }}>
      <Layout12>
        <h2
          className={classNames({
            [font('wb', 4)]: true,
          })}
        >
          <WorkTitle title={title} />
        </h2>
      </Layout12>
      <div className="css-grid__container">
        <div className="css-grid">
          {works.map(item => (
            <div
              key={item.id}
              className={classNames({
                [cssGrid({
                  s: 12,
                  m: 6,
                  l: 4,
                  xl: 4,
                })]: true,
              })}
            >
              <NextLink {...workLink({ id: item.id })} scroll={true} passHref>
                <WorkLink selected={false}>
                  {/* {item.path.level !== 'Item' && ( // TODO - there is no way of know if it has children now
                      <Space
                        as="span"
                        h={{ size: 'xs', properties: ['margin-right'] }}
                      >
                        <Icon
                          extraClasses={`icon--match-text icon--currentColor`}
                          name="folder"
                        />
                      </Space>
                    )} */}
                  <WorkTitle title={item.title} />
                  <br />
                  {item.referenceNumber}
                </WorkLink>
              </NextLink>
            </div>
          ))}
        </div>
      </div>
    </Space>
  );
};

type Props = {| work: Work |};
const RelatedArchiveWorks = ({ work }: Props) => {
  return work ? (
    <>
      {work.parts.length > 0 && (
        <>
          <Layout12>
            <Divider extraClasses="divider--pumice divider--keyline" />
            <SpacingComponent />
          </Layout12>
          <WorksGrid
            title={`${work.title || 'Unknown (not available)'} ${
              work.referenceNumber
            } contains:`}
            works={work.parts}
          />
        </>
      )}
      {work.partOf.length > 0 && (
        <>
          <Layout12>
            <Divider extraClasses="divider--pumice divider--keyline" />
            <SpacingComponent />
          </Layout12>
          <WorksGrid
            title={`Siblings of ${work.title || 'Unknown (not available)'} ${
              work.referenceNumber
            }:`}
            works={[
              ...work.precededBy,
              {
                id: work.id,
                title: work.title,
                alternativeTitles: work.alternativeTitles,
                referenceNumber: work.referenceNumber,
              },
              ...work.succeededBy,
            ]}
          />
        </>
      )}
    </>
  ) : null;
};

export default RelatedArchiveWorks;
