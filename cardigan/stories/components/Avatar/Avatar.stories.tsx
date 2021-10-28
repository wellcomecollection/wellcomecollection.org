import { FC } from 'react';
import Avatar, { Props } from '@weco/common/views/components/Avatar/Avatar';
const Template: FC<Props> = args => <Avatar {...args} />;

export const basic = Template.bind({});
basic.args = {
  imageProps: {
    width: 78,
    height: 78,
    contentUrl: 'https://placekitten.com/200/200',
    alt: `A kitten`,
  },
};
basic.storyName = 'Avatar';
