import { storiesOf } from '@storybook/react';
import Pagination from '../../../common/views/components/Pagination/Pagination';
import Readme from '../../../common/views/components/Pagination/README.md';
import { boolean } from '@storybook/addon-knobs/react';

const PaginationExample = () => {
  const isOnFirstPage = boolean('Is on first page?', false);

  return (
    <Pagination
      prevPage={isOnFirstPage ? undefined : 1}
      currentPage={isOnFirstPage ? 1 : 2}
      pageCount={10}
      nextPage={isOnFirstPage ? 2 : 3}
      prevQueryString={'#'}
      nextQueryString={'#'}
    />
  );
};

const stories = storiesOf('Components', module);
stories.add('Pagination', PaginationExample, { info: Readme });
