import PageLayout from '@weco/common/views/components/PageLayout/PageLayout';
import { grid } from '@weco/common/utils/classnames';
import PROGRESS_NOTES from '../PROGRESS_NOTES.md';
import { webpageLd } from '@weco/common/utils/json-ld';
import Space from '@weco/common/views/components/styled/Space';
import { ReactElement } from 'react';
import { NextPage } from 'next';

const title = "How we're improving search";
const description =
  'We are working to make a more welcoming space where you' +
  'can discover more of what Wellcome Collection has to offer.';

const ProgressPage: NextPage = (): ReactElement => (
  <PageLayout
    title={title}
    description={description}
    url={{ pathname: '/works/progress' }}
    openGraphType={'website'}
    jsonLd={webpageLd({ url: '/works/progress' })}
    siteSection={'collections'}
    imageUrl={null}
    imageAltText={null}
  >
    <Space v={{ size: 'l', properties: ['padding-top'] }}>
      <div className="container">
        <div className="grid">
          <div className={`${grid({ s: 12, m: 11, l: 8, xl: 7 })}`}>
            <div className="body-text">
              <PROGRESS_NOTES />
            </div>
          </div>
        </div>
      </div>
    </Space>
  </PageLayout>
);

export default ProgressPage;
