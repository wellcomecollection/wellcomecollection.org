import NextLink from 'next/link';
import styled from 'styled-components';

import { subjectCategories } from '@weco/common/data/hardcoded-ids';
import { font } from '@weco/common/utils/classnames';
import PlainList from '@weco/common/views/components/styled/PlainList';

const SubCategoriesList = styled(PlainList)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(88px, 1fr));
  gap: ${props => props.theme.gutter.medium};
`;

const SubjectImage = styled.img`
  max-width: 90%;
  margin-bottom: 5px;
  border-radius: 4px;
  transition: transform ${props => props.theme.transitionProperties};
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
}: {
  path: string;
  title: string;
}) => {
  const basePath = '/collections/subjects';

  return (
    <li>
      <CardLink href={{ pathname: `${basePath}/${path}` }}>
        <SubjectImage
          src="https://api.images.cat/150/150/958cc734-06e2-433d-a82d-cbb32b02f3e5"
          alt="TODO?"
        />
        <span className={font('sans-bold', -1)}>{title}</span>
      </CardLink>
    </li>
  );
};

const SubjectsMenu = () => {
  return (
    <SubCategoriesList>
      {subjectCategories.map(({ path, title }) => (
        <SubCategoryListItem key={path} path={path} title={title} />
      ))}
    </SubCategoriesList>
  );
};

export default SubjectsMenu;
