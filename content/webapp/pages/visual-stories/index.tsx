import { getServerData } from '@weco/common/server-data';
import PageLayout from '@weco/common/views/components/PageLayout/PageLayout';
import Space from '@weco/common/views/components/styled/Space';
import { Container } from '@weco/common/views/components/styled/Container';
import { font } from '@weco/common/utils/classnames';

export const getServerSideProps = async context => {
  const serverData = await getServerData(context);
  if (!serverData?.toggles?.visualStories?.value) {
    return { notFound: true };
  }

  return {
    props: {
      serverData,
    },
  };
};

const VisualStory = () => {
  return (
    <PageLayout
      title="Visual stories"
      description="TODO"
      url={{ pathname: '/visual-stories' }}
      jsonLd={[]}
      openGraphType="website"
      hideNewsletterPromo={true}
    >
      <Space v={{ size: 'xl', properties: ['padding-bottom', 'padding-top'] }}>
        <Container>
          <h1 className={font('wb', 2)}>Visual Stories prototypes</h1>
          <ul>
            <li>
              <a href="/visual-stories/v1">Version 1</a>
            </li>
            <li>
              <a href="/visual-stories/v2">Version 2</a>
            </li>
          </ul>
        </Container>
      </Space>
    </PageLayout>
  );
};

export default VisualStory;
