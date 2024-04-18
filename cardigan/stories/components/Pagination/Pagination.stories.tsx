import Pagination, {
  Props,
} from '@weco/content/components/Pagination/Pagination';

const Template = (args: Props) => (
  <div
    style={{
      padding: '10px',
      backgroundColor: args.hasDarkBg ? 'black' : 'transparent',
      color: args.hasDarkBg ? 'white' : 'black',
    }}
  >
    <Pagination {...args} ariaLabel="Cardigan pagination" />
  </div>
);

export const middleOfPagination = Template.bind({});
middleOfPagination.args = {
  totalPages: 10,
  hasDarkBg: false,
  isHiddenMobile: false,
};
middleOfPagination.argTypes = {
  totalPages: {
    options: [5, 10, 250],
    control: { type: 'radio' },
  },
  hasDarkBg: { control: 'boolean' },
  ariaLabel: {
    table: {
      disable: true,
    },
  },
};
middleOfPagination.storyName = 'Midway or end of pagination';
middleOfPagination.parameters = {
  nextRouter: {
    query: {
      page: '5',
    },
  },
};

export const startOfPagination = Template.bind({});
startOfPagination.args = {
  totalPages: 10,
  hasDarkBg: false,
  isHiddenMobile: false,
};
startOfPagination.storyName = 'On first page';
startOfPagination.argTypes = {
  totalPages: {
    options: [1, 5, 10, 250],
    control: { type: 'radio' },
  },
  hasDarkBg: { control: 'boolean' },
  ariaLabel: {
    table: {
      disable: true,
    },
  },
};
