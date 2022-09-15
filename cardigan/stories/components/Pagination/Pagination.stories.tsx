import Pagination from '@weco/common/views/components/Pagination/Pagination';

const Template = args => <Pagination {...args} />;
export const basic = Template.bind({});
basic.args = {
  prevPage: 1,
  currentPage: 2,
  totalPages: 10,
  nextPage: 3,
  prevQueryString: '#',
  nextQueryString: '#',
};
basic.storyName = 'Pagination';
