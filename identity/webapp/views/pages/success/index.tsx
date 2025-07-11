import { NextPage } from 'next';

import { prismicPageIds } from '@weco/common/data/hardcoded-ids';
import Divider from '@weco/common/views/components/Divider';
import {
  ContaineredLayout,
  gridSize10,
  gridSize8,
} from '@weco/common/views/components/Layout';
import Space from '@weco/common/views/components/styled/Space';
import { usePageTitle } from '@weco/identity/hooks/usePageTitle';
import {
  Container,
  Wrapper,
} from '@weco/identity/views/components/styled/Layouts';
import { SectionHeading } from '@weco/identity/views/components/styled/layouts';
import IdentityPageLayout from '@weco/identity/views/layouts/IdentityPageLayout';

export type Props = {
  email: string;
};

const SuccessPage: NextPage<Props> = ({ email }) => {
  usePageTitle('Application received');

  return (
    <IdentityPageLayout title="Registration">
      <ContaineredLayout gridSizes={gridSize10()}>
        <Space $v={{ size: 'xl', properties: ['margin-top'] }}>
          <Container>
            <Wrapper>
              <ContaineredLayout gridSizes={gridSize8()}>
                <Space $v={{ size: 'xl', properties: ['padding-top'] }}>
                  <>
                    <SectionHeading as="h1">
                      Application received
                    </SectionHeading>
                    <div className="body-text">
                      <p>Thank you for applying for a library membership.</p>
                      <p>
                        Please click the verification link in the email we’ve
                        just sent to <strong>{email}</strong>.
                      </p>
                      <p>
                        <strong>
                          Please do this within the next 24 hours.
                        </strong>
                      </p>
                      <p>
                        Once you have verified your email address, you will be
                        able to request up to 15 items from our closed stores to
                        view in the library.
                      </p>
                      <p>
                        To complete your membership and access subscription
                        databases, e-journals and e-books, you’ll need to bring
                        a form of photo identification (ID) and proof of your
                        address to our admissions desk when you visit. The
                        identification we accept is detailed on our{' '}
                        <a
                          href={`https://wellcomecollection.org/collections/${prismicPageIds.register}`}
                        >
                          Library membership page
                        </a>
                        .
                      </p>
                      <Space $v={{ size: 'l', properties: ['margin-bottom'] }}>
                        <Divider />
                      </Space>
                      <p>
                        <strong>Didn’t receive an email?</strong>
                      </p>
                      <p>
                        If you still don’t see an email from us within the next
                        few minutes, try checking your junk or spam folder.
                      </p>
                      <p>
                        If you need more help please{' '}
                        <a href="mailto:library@wellcomecollection.org">
                          contact the library
                        </a>
                        .
                      </p>
                    </div>
                  </>
                </Space>
              </ContaineredLayout>
            </Wrapper>
          </Container>
        </Space>
      </ContaineredLayout>
    </IdentityPageLayout>
  );
};

export default SuccessPage;
