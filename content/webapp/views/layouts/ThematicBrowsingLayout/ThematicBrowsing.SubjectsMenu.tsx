import NextLink from 'next/link';
import styled from 'styled-components';

import { subjectCategories } from '@weco/common/data/hardcoded-ids';
import PlainList from '@weco/common/views/components/styled/PlainList';

const CardWrapper = styled.li`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
`;

const SubjectImage = styled.img`
  max-width: 150px;
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
    <CardWrapper>
      <NextLink href={{ pathname: `${basePath}/${path}` }}>
        <SubjectImage
          src="https://api.images.cat/150/150/958cc734-06e2-433d-a82d-cbb32b02f3e5"
          alt="TODO?"
        />
        <span>{title}</span>
      </NextLink>
    </CardWrapper>
  );
};

const SubjectsMenu = () => {
  return (
    <PlainList style={{ display: 'flex' }}>
      {subjectCategories.map(({ path, title }) => (
        <SubCategoryListItem key={path} path={path} title={title} />
      ))}
    </PlainList>
  );
};

export default SubjectsMenu;
