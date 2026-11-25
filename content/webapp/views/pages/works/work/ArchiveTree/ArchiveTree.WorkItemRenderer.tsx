import { FunctionComponent } from 'react';
import styled from 'styled-components';

import { useAppContext } from '@weco/common/contexts/AppContext';
import { chevron } from '@weco/common/icons';
import { classNames, typography } from '@weco/common/utils/classnames';
import { dataGtmPropsToAttributes } from '@weco/common/utils/gtm';
import Icon from '@weco/common/views/components/Icon';
import { toWorkLink } from '@weco/content/views/components/WorkLink';
import WorkTitle from '@weco/content/views/components/WorkTitle';
import { TreeControl } from '@weco/content/views/pages/works/work/NestedList';
import {
  TreeDataWork,
  UiTreeNode,
} from '@weco/content/views/pages/works/work/work.types';

import { StyledLink } from './ArchiveTree.styles';

const RefNumber = styled.span.attrs({
  className: typography('body', 'sm', 'regular'),
})`
  line-height: 1;
  display: block;
  color: ${props => props.theme.color('neutral.600')};
  text-decoration: none;
`;

export type WorkItemRendererProps = {
  item: UiTreeNode;
  hasControl: boolean;
  level: number;
  isSelected: boolean;
  currentWorkId: string;
  highlightCondition: 'primary' | 'secondary' | undefined;
  showFirstLevelGuideline: boolean;
  isDarkMode?: boolean;
};

const WorkItem: FunctionComponent<WorkItemRendererProps> = ({
  item,
  hasControl,
  level,
  isSelected,
  currentWorkId,
  highlightCondition,
  showFirstLevelGuideline,
  isDarkMode,
}) => {
  const { isEnhanced } = useAppContext();
  // Safe assertion: WorkItem is only used in archive contexts where data is always TreeDataWork
  const data = item.data as TreeDataWork;

  return (
    <div
      style={{ display: 'flex', width: '100%' }}
      className={typography('body', 'sm', 'regular')}
    >
      {isEnhanced && (level > 1 || showFirstLevelGuideline) && hasControl && (
        <TreeControl
          $highlightCondition={highlightCondition}
          $isDarkMode={isDarkMode}
        >
          <Icon rotate={item.openStatus ? undefined : 270} icon={chevron} />
        </TreeControl>
      )}

      <StyledLink
        {...toWorkLink({ id: data.id, scroll: false })}
        className={classNames({
          [typography('body', 'sm', 'strong')]: level === 1,
          [typography('body', 'sm', 'regular')]: level > 1,
        })}
        tabIndex={isEnhanced ? (isSelected ? 0 : -1) : 0}
        $isCurrent={currentWorkId === data.id}
        $hasControl={hasControl}
        onClick={event => {
          // We don't want to open the branch, when the work link is activated
          event.stopPropagation();
        }}
        {...dataGtmPropsToAttributes({
          trigger: 'tree_link',
          label: `${data.title}${data.referenceNumber ? ` (${data.referenceNumber})` : ''}`,
          'data-tree-level': String(level),
        })}
      >
        <WorkTitle title={data.title} />

        {data.referenceNumber && <RefNumber>{data.referenceNumber}</RefNumber>}
      </StyledLink>
    </div>
  );
};

export default WorkItem;
