import { url, image, singleLineOfText } from '../../content';
import BookPromo from '@weco/common/views/components/BookPromo/BookPromo';

const Template = args => <BookPromo {...args} />;

export const basic = Template.bind({});
basic.args = {
  image: image(
    'https://images.prismic.io/wellcomecollection/1e958377a9f21d49a5de6578212e02ad4381d473_9781781254875_0.png?auto=compress,format'
  ),
  url: url,
  title: singleLineOfText(2, 6),
  subtitle: singleLineOfText(3, 6),
  description: singleLineOfText(10, 20),
};
basic.storyName = 'BookPromo';
basic.parameters = {
  gridSizes: { s: 12, m: 6, l: 4, xl: 4 },
};
