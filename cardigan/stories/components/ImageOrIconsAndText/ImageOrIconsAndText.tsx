import ImageOrIconsAndText from '@weco/content/components/ImageOrIconsAndText/ImageOrIconsAndText';
import Readme from '@weco/content/components/ImageOrIconsAndText/README.md';
import { ReadmeDecorator } from '@weco/cardigan/config/decorators';
import { mockIcons } from '@weco/common/test/fixtures/components/icons-and-text';
// import { mockImage } from '@weco/common/test/fixtures/components/compact-card';

const Template = args => (
  <ReadmeDecorator
    WrappedComponent={ImageOrIconsAndText}
    args={args}
    Readme={Readme}
  />
);

export const icons = Template.bind({});
icons.args = {
  items: [
    {
      type: 'icons',
      icons: mockIcons,
      text: 'Sit amet consectetur adipisicing elit. Reiciendis porro, officiis ut quia libero, numquam, id saepe aperiam rem ex nemo tempore laboriosam. Officiis facilis assumenda corporis magni dolores illo.',
    },
    {
      type: 'icons',
      icons: mockIcons,
      text: 'Dolorem recusandae distinctio magni aperiam itaque voluptas delectus tempora nostrum sed aliquid quis fugiat alias vitae velit, saepe, voluptatum nihil, impedit ratione.',
    },
  ],
};
icons.storyName = 'basic';

// export const image = Template.bind({});
// image.args = {
//   items: [
//     {
//       type: 'image',
//       image: mockImage,
//       text: 'Non saepe maxime quasi quos doloribus dolorum praesentium obcaecati officiis qui repellat, nihil esse corrupti dolores iusto ab quod libero ullam hic.',
//     },
//   ],
// };
// image.storyName = 'ImageAndText';
