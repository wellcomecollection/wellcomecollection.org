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

export const TreeHeadings = styled(Space)<{ $darkMode?: boolean }>`
  ${props =>
    !props.$darkMode && `background: ${props.theme.color('warmNeutral.300')};`}
`;

const TreeContainer = styled.div<{ $darkMode?: boolean }>`
  ${props =>
    !props.$darkMode &&
    `
    background: linear-gradient(
      to bottom,
      ${props.theme.color('warmNeutral.200')},
      ${props.theme.color('warmNeutral.200')} 50%,
      ${props.theme.color('white')} 50%,
      ${props.theme.color('white')}
    );
    background-size: 100% ${controlDimensions.controlHeight * 2}px;
  `}
`;

const WorksTree: FunctionComponent<
  PropsWithChildren<{ darkMode?: boolean; hasStructures?: boolean }>
> = ({ children, darkMode = false, hasStructures = true }) => {
  const { isEnhanced } = useAppContext();

  return (
    <div style={{ overflow: 'visible' }}>
      <div style={{ display: 'inline-table', minWidth: '100%' }}>
        <TreeHeadings aria-hidden="true" $darkMode={darkMode}>
          <DownloadTable $padFirstHeading={hasStructures}>
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
        <TreeContainer $darkMode={darkMode}>
          <Tree
            $isEnhanced={isEnhanced}
            $showFirstLevelGuideline={true}
            $darkMode={darkMode}
          >
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
