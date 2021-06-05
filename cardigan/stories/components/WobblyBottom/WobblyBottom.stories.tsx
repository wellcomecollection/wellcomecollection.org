import WobblyBottom from '@weco/common/views/components/WobblyBottom/WobblyBottom';
import { UiImage } from '@weco/common/views/components/Images/Images';
import { image as contentImage } from '../../content';

const Template = args => <WobblyBottom {...args} />;
export const image = Template.bind({});
image.args = {
  color: 'cream',
  children: <UiImage {...contentImage()} isFull={true} />,
};

export const headline = Template.bind({});
headline.args = {
  color: 'cream',
  children: <h1 className="h1">Lorem ipsum dolor sit amet</h1>,
};
