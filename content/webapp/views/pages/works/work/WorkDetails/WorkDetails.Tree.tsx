import { FunctionComponent, PropsWithChildren } from 'react';
import styled from 'styled-components';

import { useAppContext } from '@weco/common/contexts/AppContext';
import { treeInstructions } from '@weco/common/data/microcopy';
import Space from '@weco/common/views/components/styled/Space';
import { controlDimensions } from '@weco/content/views/pages/works/work/work.helpers';
import {
  Tree,
  TreeInstructions,
} from '@weco/content/views/pages/works/work/work.styles';

import { DownloadTable } from './WorkDetails.DownloadItem';

export const TreeHeadings = styled(Space).attrs({
  $v: { size: 'xl', properties: ['margin-top'] },
})`
  background: ${props => props.theme.color('warmNeutral.300')};
`;

const TreeContainer = styled.div`
  background: linear-gradient(
    to bottom,
    ${props => props.theme.color('warmNeutral.200')},
    ${props => props.theme.color('warmNeutral.200')} 50%,
    ${props => props.theme.color('white')} 50%,
    ${props => props.theme.color('white')}
  );
  background-size: 100% ${controlDimensions.controlHeight * 2}px;
`;

const WorksTree: FunctionComponent<PropsWithChildren> = ({ children }) => {
  const { isEnhanced } = useAppContext();

  return (
    <div style={{ overflow: 'visible' }}>
      <div style={{ display: 'inline-table', minWidth: '100%' }}>
        <TreeHeadings aria-hidden="true">
          <DownloadTable>
            <thead>
              <tr>
                <th>Name</th>
                <th>File format</th>
                <th>Size</th>
                <th>Download</th>
              </tr>
            </thead>
          </DownloadTable>
        </TreeHeadings>
        <TreeContainer>
          <Tree $isEnhanced={isEnhanced} $showFirstLevelGuideline={true}>
            {isEnhanced && (
              <TreeInstructions>{`Download tree: ${treeInstructions}`}</TreeInstructions>
            )}
            {children}
          </Tree>
        </TreeContainer>
      </div>
    </div>
  );
};

export default WorksTree;
