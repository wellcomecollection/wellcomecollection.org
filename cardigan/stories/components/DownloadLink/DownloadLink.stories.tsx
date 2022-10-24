import DownloadLink from '@weco/common/views/components/DownloadLink/DownloadLink';

const Template = args => <DownloadLink {...args} />;
export const basic = Template.bind({});
basic.args = {
  href: '/',
  linkText: 'Download file',
  format: 'PDF',
  trackingEvent: {
    category: 'Button',
    action: 'click',
    label: 'abc',
  },
};
basic.storyName = 'DownloadLink';
