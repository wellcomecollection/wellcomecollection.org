import {
  image,
  imagesBaseUrl,
  singleLineOfText,
} from '@weco/cardigan/stories/content';
import BookPromo from '@weco/content/components/BookPromo/BookPromo';

const Template = args => <BookPromo {...args} />;

export const basic = Template.bind({});
basic.args = {
  book: {
    id: 'cardigan',
    cover: image(`${imagesBaseUrl}/book.png`, 575, 884),
    title: singleLineOfText(),
    subtitle: singleLineOfText(),
  },
};
basic.storyName = 'BookPromo';
basic.parameters = {
  gridSizes: { s: 12, m: 6, l: 4, xl: 4 },
  chromatic: { diffThreshold: 0.2 },
};
