import Pagination, {
  PaginatedResultsProps,
} from '@weco/common/views/components/Pagination/Pagination';

const Template = (args: PaginatedResultsProps) => (
  <Pagination
    paginationRoot={{
      href: { pathname: '/example' },
      as: { pathname: '/example' },
    }}
    paginatedResults={args}
  />
);

export const middleOfPagination = Template.bind({});
middleOfPagination.args = {
  currentPage: 5,
  totalPages: 10,
};
middleOfPagination.storyName = 'Midway through pagination';

export const startOfPagination = Template.bind({});
startOfPagination.args = {
  currentPage: 1,
  totalPages: 10,
};
startOfPagination.storyName = 'Start of pagination';
