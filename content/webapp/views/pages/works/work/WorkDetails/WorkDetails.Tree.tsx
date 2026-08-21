import { FunctionComponent, PropsWithChildren } from 'react';

import { useAppContext } from '@weco/common/contexts/AppContext';
import { useKiosk } from '@weco/common/contexts/KioskContext';
import { treeInstructions } from '@weco/common/data/microcopy';
import {
  Tree,
  TreeContainer,
  TreeHeadings,
  TreeInstructions,
} from '@weco/content/views/pages/works/work/work.styles';

import { DownloadTable } from './WorkDetails.DownloadItem';

const WorksTree: FunctionComponent<
  PropsWithChildren<{
    isDarkMode?: boolean;
    hasStructures?: boolean;
  }>
> = ({ children, isDarkMode = false, hasStructures = true }) => {
  const { isEnhanced } = useAppContext();
  const { isKiosk } = useKiosk();

  return (
    <div style={{ overflowX: 'auto', width: '100%' }}>
      <div style={{ display: 'inline-table', minWidth: '100%' }}>
        <TreeHeadings aria-hidden="true" $isDarkMode={isDarkMode}>
          <DownloadTable $padFirstHeading={hasStructures}>
            <thead>
              <tr>
                <th>Name</th>
                <th>File format</th>
                <th>Size</th>
                {!isKiosk && <th>Download</th>}
              </tr>
            </thead>
          </DownloadTable>
        </TreeHeadings>
        <TreeContainer $isDarkMode={isDarkMode}>
          <Tree
            $isEnhanced={isEnhanced}
            $isDarkMode={isDarkMode}
            $showFirstLevelGuideline
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
