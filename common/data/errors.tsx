import { FunctionComponent } from 'react';
import { prismicPageIds } from './hardcoded-ids';
import Space from '../views/components/styled/Space';
import Layout, { gridSize8 } from '@weco/common/views/components/Layout';

export const errorMessages = {
  404: 'Not the Wellcome you were expecting?',
  500: 'Internal Server Error',
};

export const DefaultErrorText: FunctionComponent = () => (
  <Layout gridSizes={gridSize8()}>
    <Space
      className="body-text"
      $v={{ size: 'l', properties: ['margin-top', 'margin-bottom'] }}
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
        <li>Try again a bit later</li>
      </ul>
    </Space>
  </Layout>
);

export const NotFoundErrorText: FunctionComponent = () => (
  <Layout gridSizes={gridSize8()}>
    <Space
      className="body-text"
      $v={{ size: 'l', properties: ['margin-top', 'margin-bottom'] }}
    >
      <p>
        We can’t find the page you’re looking for. Maybe one of these will help:
      </p>
      <ul>
        <li>
          Find out about our <a href="/whats-on">events and exhibitions</a>
        </li>
        <li>
          <a href="/collections">Search our collections</a>
        </li>
        <li>
          <a href={`/pages/${prismicPageIds.library}`}>Using our library</a>
        </li>
        <li>
          <a href="/get-involved">Collaborating with us</a>
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
  </Layout>
);

export const GoneErrorText: FunctionComponent = () => (
  <Layout gridSizes={gridSize8()}>
    <Space
      className="body-text"
      $v={{ size: 'l', properties: ['margin-top', 'margin-bottom'] }}
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
  </Layout>
);
