import NextLink from 'next/link';
import { FunctionComponent } from 'react';
import styled from 'styled-components';

import { prismicPageIds } from '@weco/common/data/hardcoded-ids';
import { DataGtmProps, dataGtmPropsToAttributes } from '@weco/common/utils/gtm';
import { AnimatedUnderlineProps } from '@weco/common/views/components/styled/AnimatedUnderline';
import PlainList from '@weco/common/views/components/styled/PlainList';
import {
  StyledInputCSS as SelectableTagCSS,
  SelectableTagsWrapper,
} from '@weco/content/views/components/SelectableTags';

import { ThematicBrowsingCategories } from '.';

const StyledInput = styled(NextLink)<
  AnimatedUnderlineProps & { $isSelected: boolean }
>`
  ${SelectableTagCSS}

  text-decoration: none;
`;

const ThematicBrowsingNavigation: FunctionComponent<{
  currentCategory: ThematicBrowsingCategories;
}> = ({ currentCategory }) => {
  const tagItems = [
    {
      id: 'people-and-organisations',
      label: 'People and organisations',
    },
    { id: 'types-and-techniques', label: 'Types and techniques' },
    { id: 'subjects', label: 'Subjects' },
    { id: 'places', label: 'Places' },
  ];

  return (
    <nav>
      <SelectableTagsWrapper as={PlainList}>
        {tagItems.map((tag, i) => {
          const dataGtmProps: DataGtmProps = {
            trigger: 'thematic_browsing_navigation_link',
            label: tag.label,
            'position-in-list': `${i + 1}`,
          };

          return (
            <li key={tag.id}>
              <StyledInput
                href={`/${prismicPageIds.collections}/${tag.id}`}
                aria-current={currentCategory === tag.id ? 'page' : undefined}
                {...dataGtmPropsToAttributes(dataGtmProps)}
                $isSelected={currentCategory === tag.id}
                $lineColor={currentCategory === tag.id ? 'white' : 'black'}
                $lineThickness={1.4}
              >
                <span>{tag.label}</span>
              </StyledInput>
            </li>
          );
        })}
      </SelectableTagsWrapper>
    </nav>
  );
};

export default ThematicBrowsingNavigation;
