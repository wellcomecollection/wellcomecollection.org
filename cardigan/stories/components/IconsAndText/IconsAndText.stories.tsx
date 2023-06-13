import IconsAndText from '@weco/content/components/IconsAndText/IconsAndText';
import Readme from '@weco/content/components/IconsAndText/README.md';
import { ReadmeDecorator } from '@weco/cardigan/config/decorators';
import { mockIcons } from '@weco/common/test/fixtures/components/icons-and-text';

const Template = args => (
  <ReadmeDecorator
    WrappedComponent={IconsAndText}
    args={args}
    Readme={Readme}
  />
);

export const basic = Template.bind({});
basic.args = {
  items: [
    {
      icons: mockIcons,
      text: 'Sit amet consectetur adipisicing elit. Reiciendis porro, officiis ut quia libero, numquam, id saepe aperiam rem ex nemo tempore laboriosam. Officiis facilis assumenda corporis magni dolores illo.',
    },
    {
      icons: mockIcons,
      text: 'Dolorem recusandae distinctio magni aperiam itaque voluptas delectus tempora nostrum sed aliquid quis fugiat alias vitae velit, saepe, voluptatum nihil, impedit ratione.',
    },
  ],
};
basic.storyName = 'IconsAndText';
