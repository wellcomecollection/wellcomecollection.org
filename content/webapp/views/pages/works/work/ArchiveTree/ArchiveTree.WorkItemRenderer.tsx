import { FunctionComponent } from 'react';
import styled from 'styled-components';

import { useAppContext } from '@weco/common/contexts/AppContext';
import { chevron } from '@weco/common/icons';
import { classNames, font } from '@weco/common/utils/classnames';
import Icon from '@weco/common/views/components/Icon';
import { toWorkLink } from '@weco/content/views/components/WorkLink';
import WorkTitle from '@weco/content/views/components/WorkTitle';
import { UiTreeNode } from '@weco/content/views/pages/works/work/work.types';

import { isRelatedWork } from './ArchiveTree.helpers';
import { StyledLink, TreeControl } from './ArchiveTree.styles';

const RefNumber = styled.span.attrs({
  className: font('sans', -2),
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
  flatMode?: boolean;
};

const WorkItem: FunctionComponent<WorkItemRendererProps> = ({
  item,
  hasControl,
  level,
  isSelected,
  currentWorkId,
  highlightCondition,
}) => {
  const { isEnhanced } = useAppContext();
  return (
    <div
      style={{
        display: 'flex',
        width: '100%',
      }}
      className={font('sans', -2)}
    >
      {isEnhanced && level > 1 && hasControl && (
        <TreeControl
          data-gtm-trigger="tree_chevron"
          $highlightCondition={highlightCondition}
        >
          <Icon rotate={item.openStatus ? undefined : 270} icon={chevron} />
        </TreeControl>
      )}
      <StyledLink
        {...toWorkLink({ id: item.work.id, scroll: false })}
        className={classNames({
          [font('sans-bold', -2)]: level === 1,
          [font('sans', -2)]: level > 1,
        })}
        tabIndex={isEnhanced ? (isSelected ? 0 : -1) : 0}
        $isCurrent={currentWorkId === item.work.id}
        $hasControl={hasControl}
        data-gtm-trigger="tree_link"
        data-gtm-data-tree-level={level}
        onClick={event => {
          // We don't want to open the branch, when the work link is activated
          event.stopPropagation();
        }}
      >
        <WorkTitle title={item.work.title} />
        {isRelatedWork(item.work) && (
          <RefNumber>{item.work.referenceNumber}</RefNumber>
        )}
      </StyledLink>
    </div>
  );
};

export default WorkItem;
