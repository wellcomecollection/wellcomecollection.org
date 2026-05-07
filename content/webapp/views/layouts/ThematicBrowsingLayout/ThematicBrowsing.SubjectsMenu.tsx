import NextLink from 'next/link';
import styled from 'styled-components';

import { subjectCategories } from '@weco/common/data/hardcoded-ids';
import { font } from '@weco/common/utils/classnames';
import { dataGtmPropsToAttributes } from '@weco/common/utils/gtm';
import PlainList from '@weco/common/views/components/styled/PlainList';

const SubCategoriesList = styled(PlainList)`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: ${props => props.theme.getSpaceValue('md', 'zero')};

  ${props =>
    props.theme.media('sm')(`
      grid-template-columns: repeat(20, 1fr);
      gap: ${props.theme.getSpaceValue('md', 'sm')};
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

const ImageContainer = styled.div`
  border-radius: 4px;
  overflow: hidden;
  aspect-ratio: 1 / 1;
  width: 100%;
  margin-bottom: 5px;
`;

const SubjectImage = styled.img`
  object-fit: cover;
  width: 100%;
  height: 100%;
  display: block;
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
  line-height: 1.3;

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
        <ImageContainer>
          <SubjectImage
            src="https://api.images.cat/150/150/958cc734-06e2-433d-a82d-cbb32b02f3e5"
            alt=""
          />
        </ImageContainer>
        <span className={font('sans-bold', -1)}>{title}</span>
      </CardLink>
    </CardListItem>
  );
};

const SubjectsMenu = () => {
  return (
    <nav aria-label="Subject sub-categories">
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
    </nav>
  );
};

export default SubjectsMenu;
