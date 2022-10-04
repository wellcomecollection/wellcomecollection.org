import Pagination from '@weco/common/views/components/Pagination/Pagination';

type Args = {
  currentPage: number;
  totalPages: number;
};

const Template = (args: Args) => (
  <Pagination
    paginationRoot="/example"
    paginatedResults={{
      pageSize: 10,
      totalResults: 1000,
      results: [],
      ...args,
    }}
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
