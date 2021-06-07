import TruncatedText from '@weco/common/views/components/TruncatedText/TruncatedText';

const Template = args => <TruncatedText {...args} />;
export const basic = Template.bind({});
basic.args = {
  className: 'h1',
  children:
    'Lorem ipsum dolor sit amet consectetur adipisicing elit. Vitae, minima rem? Quod voluptatum molestiae optio necessitatibus?',
};
basic.storyName = 'TruncatedText';
