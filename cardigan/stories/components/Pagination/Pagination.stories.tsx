import Pagination from '@weco/common/views/components/Pagination/Pagination';

const Template = args => <Pagination {...args} />;
export const basic = Template.bind({});

const templateArgs = {
  pageSize: 10,
  totalResults: 1000,
  results: [],
};

export const bothButtons = Template.bind({});
bothButtons.args = {
  ...templateArgs,
  currentPage: 5,
  totalPages: 10,
};
bothButtons.args = 'Pagination in the middle of a list';

export const startOfList = Template.bind({});
startOfList.args = {
  ...templateArgs,
  currentPage: 1,
  totalPages: 10,
};
startOfList.args = 'Pagination in the middle of a list';

export const endOfList = Template.bind({});
endOfList.args = {
  ...templateArgs,
  currentPage: 10,
  totalPages: 10,
};
endOfList.args = 'Pagination at the end of a list';
