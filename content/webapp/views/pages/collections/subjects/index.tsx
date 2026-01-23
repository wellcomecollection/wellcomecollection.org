import { NextPage } from 'next';

import { Container } from '@weco/common/views/components/styled/Container';
import Space from '@weco/common/views/components/styled/Space';
import { withThematicBrowsingLayout } from '@weco/content/views/layouts/ThematicBrowsingLayout';

const CollectionsSubjectsPage: NextPage = withThematicBrowsingLayout(() => {
  return (
    <Container>
      <Space $v={{ size: 'md', properties: ['margin-top', 'margin-bottom'] }}>
        Subjects page content
        <ul>
          <li>
            <a href="/collections/subjects/military-and-war">
              Military and war
            </a>
          </li>
        </ul>
      </Space>
    </Container>
  );
});

export default CollectionsSubjectsPage;
