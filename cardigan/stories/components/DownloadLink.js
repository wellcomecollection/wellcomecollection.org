import { storiesOf } from '@storybook/react';
import DownloadLink from '../../../catalogue/webapp/components/DownloadLink/DownloadLink';
import Readme from '../../../catalogue/webapp/components/DownloadLink/README.md';

const DownloadLinkExample = () => {
  return (
    <DownloadLink
      href={'/'}
      linkText={'Download file'}
      format={'PDF'}
      trackingEvent={{
        category: 'Button',
        action: 'click',
        label: 'abc',
      }}
    />
  );
};

const stories = storiesOf('Components', module);
stories.add('DownloadLink', DownloadLinkExample, {
  readme: { sidebar: Readme },
});
