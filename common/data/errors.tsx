import { FunctionComponent } from 'react';

import {
  ContaineredLayout,
  gridSize8,
} from '@weco/common/views/components/Layout';
import Space from '@weco/common/views/components/styled/Space';

import { prismicPageIds } from './hardcoded-ids';

export const errorMessages = {
  404: 'Not the Wellcome you were expecting?',
  500: 'Internal Server Error',
};

export const DefaultErrorText: FunctionComponent = () => (
  <ContaineredLayout gridSizes={gridSize8()}>
    <Space
      className="body-text"
      $v={{ size: 'md', properties: ['margin-top', 'margin-bottom'] }}
    >
      <p>
        Looks like something’s not working properly our end. We’ll try to fix it
        as soon as we can.{' '}
      </p>
      <p>In the meantime, here’s what you can do:</p>
      <ul>
        <li>
          In case we missed it, email us at{' '}
          <a href="mailto:digital@wellcomecollection.org">
            digital@wellcomecollection.org
          </a>{' '}
          and tell us what happened
        </li>
        <li>Refresh the page (sometimes it’s a temporary issue)</li>
        <li>
          Have a look at{' '}
          <a href="https://status.wellcomecollection.org/">our status page</a>{' '}
          for any updates
        </li>
        <li>Try again a bit later</li>
      </ul>
    </Space>
  </ContaineredLayout>
);

export const NotFoundErrorText: FunctionComponent = () => (
  <ContaineredLayout gridSizes={gridSize8()}>
    <Space
      className="body-text"
      $v={{ size: 'md', properties: ['margin-top', 'margin-bottom'] }}
    >
      <p>
        We can’t find the page you’re looking for. Maybe one of these will help:
      </p>
      <ul>
        <li>
          Find out about our{' '}
          <a href={`/${prismicPageIds.whatsOn}`}>events and exhibitions</a>
        </li>
        <li>
          <a href={`/${prismicPageIds.collections}`}>Search our collections</a>
        </li>
        <li>
          <a href={`/visit-us/${prismicPageIds.library}`}>Using our library</a>
        </li>
        <li>
          <a href={`/${prismicPageIds.getInvolved}`}>Collaborating with us</a>
        </li>
        <li>
          Read{' '}
          <a href="/stories">articles on our Stories publishing platform</a>
        </li>
      </ul>
      <p>
        You’ll find pages from our old Wellcome Library website and blog
        archived by the <a href="https://archive.org">Internet Archive</a> in
        its <a href="https://web.archive.org/">Wayback Machine</a> &ndash;
        search for wellcomelibrary.org.
      </p>
      <p>
        Still can’t find what you want? Contact us if you’ve got a specific
        query:{' '}
        <a href="mailto:digital@wellcomecollection.org">
          digital@wellcomecollection.org
        </a>
        .
      </p>
    </Space>
  </ContaineredLayout>
);

export const GoneErrorText: FunctionComponent = () => (
  <ContaineredLayout gridSizes={gridSize8()}>
    <Space
      className="body-text"
      $v={{ size: 'md', properties: ['margin-top', 'margin-bottom'] }}
    >
      <p>This work has been deleted from our public catalogue.</p>
      <p>
        If that doesn&apos;t seem right or isn&apos;t what you expected, email
        us at{' '}
        <a href="mailto:digital@wellcomecollection.org">
          digital@wellcomecollection.org
        </a>
        .
      </p>
    </Space>
  </ContaineredLayout>
);
