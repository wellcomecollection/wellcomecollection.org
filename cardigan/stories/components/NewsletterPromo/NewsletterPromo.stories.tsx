import NewsletterPromo from '@weco/common/views/components/NewsletterPromo/NewsletterPromo';

const Template = args => <NewsletterPromo {...args} />;
export const basic = Template.bind({});
basic.storyName = 'NewsletterPromo';
basic.parameters = { chromatic: { viewports: [375, 1200] } };
