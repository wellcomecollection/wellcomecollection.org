import NextLink from 'next/link';
import styled from 'styled-components';

import { subjectCategories } from '@weco/common/data/hardcoded-ids';
import { font } from '@weco/common/utils/classnames';
import { dataGtmPropsToAttributes } from '@weco/common/utils/gtm';
import PlainList from '@weco/common/views/components/styled/PlainList';

const SubCategoriesList = styled(PlainList)`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: ${props => props.theme.gutter.small};

  ${props =>
    props.theme.media('sm')(`
      grid-template-columns: repeat(20, 1fr);
      gap: ${props.theme.gutter.medium};
  `)}

  ${props =>
    props.theme.media('md')`
      grid-template-columns: repeat(12 , 1fr);
  `}

  ${props =>
    props.theme.media('lg')`
      grid-template-columns: repeat(9 , 1fr);
  `}
`;

const SubjectImage = styled.img`
  max-width: 90%;
  margin-bottom: 5px;
  border-radius: 4px;
  transition: transform ${props => props.theme.transitionProperties};
`;

const CardListItem = styled.li`
  ${props => props.theme.media('sm')`
    grid-column: auto / span 4;
    
    &:nth-child(6) {
      grid-column-start: 3;
    }
  `}

  ${props => props.theme.media('md')`
    grid-column: auto / span 2;
    
    &:nth-child(7) {
      grid-column-start: 4;
    }
    &:nth-child(6) {
      grid-column-start: inherit;
    }
  `}

  ${props => props.theme.media('lg')`
    grid-column: span 1;
    
    &:nth-child(7) {
      grid-column-start: inherit;
    }
  `}
`;

const CardLink = styled(NextLink)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;

  text-decoration: none;
  text-align: center;

  &:hover {
    text-decoration: underline;

    ${SubjectImage} {
      transform: scale(1.04);
    }
  }
`;

const SubCategoryListItem = ({
  path,
  title,
  index,
}: {
  path: string;
  title: string;
  index: number;
}) => {
  const basePath = '/collections/subjects';

  return (
    <CardListItem>
      <CardLink
        href={{ pathname: `${basePath}/${path}` }}
        {...dataGtmPropsToAttributes({
          'category-label': 'Subjects',
          label: title,
          'position-in-list': String(index + 1),
        })}
      >
        <SubjectImage
          src="https://api.images.cat/150/150/958cc734-06e2-433d-a82d-cbb32b02f3e5"
          alt=""
        />
        <span className={font('sans-bold', -1)}>{title}</span>
      </CardLink>
    </CardListItem>
  );
};

const SubjectsMenu = () => {
  return (
    <SubCategoriesList data-component="thematic-subjects-menu">
      {subjectCategories.map(({ path, title }, index) => (
        <SubCategoryListItem
          key={path}
          path={path}
          title={title}
          index={index}
        />
      ))}
    </SubCategoriesList>
  );
};

export default SubjectsMenu;
