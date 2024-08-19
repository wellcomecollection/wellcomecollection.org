import BookPromo from '@weco/content/components/BookPromo/BookPromo';
import { bookImageUrl, image } from '@weco/cardigan/stories/data/images';
import { singleLineOfText } from '@weco/cardigan/stories/data/text';

const Template = args => <BookPromo {...args} />;

export const basic = Template.bind({});
basic.args = {
  book: {
    id: 'cardigan',
    cover: image(bookImageUrl, 575, 884),
    title: singleLineOfText(),
    subtitle: singleLineOfText(),
  },
};
basic.storyName = 'BookPromo';
basic.parameters = {
  gridSizes: { s: 12, m: 6, l: 4, xl: 4 },
};
