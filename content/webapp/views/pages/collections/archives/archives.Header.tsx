import styled from 'styled-components';

import { typography } from '@weco/common/utils/classnames';
import Breadcrumb, {
  getBreadcrumbItems,
} from '@weco/common/views/components/Breadcrumb';
import DecorativeEdge from '@weco/common/views/components/DecorativeEdge';
import Layout, {
  gridSize10,
  gridSize8,
} from '@weco/common/views/components/Layout';
import { Container } from '@weco/common/views/components/styled/Container';
import Space from '@weco/common/views/components/styled/Space';

// Same styling as ThematicBrowsing.Header, without the category navigation -
// archives isn't one of the thematic browsing categories.
const ArchivesHeaderContainer = styled(Space).attrs({
  $v: { size: 'sm', properties: ['padding-top'] },
})`
  background-color: ${props => props.theme.color('accent.lightGreen')};

  ${props => props.theme.makeSpacePropertyValues('xl', ['padding-bottom'])};
`;

const ArchivesHeader = ({
  title,
  introText,
}: {
  title: string;
  introText?: string;
}) => {
  return (
    <>
      <ArchivesHeaderContainer>
        <Container>
          <Space
            $v={{
              size: 'sm',
              properties: ['margin-bottom'],
              overrides: { md: '150' },
            }}
          >
            <Breadcrumb items={getBreadcrumbItems('collections').items} />
          </Space>

          <Layout gridSizes={gridSize10(false)}>
            <h1 className={typography('heading', 'xxl', 'strong', 'brand')}>
              {title}
            </h1>
          </Layout>

          {introText && (
            <Layout gridSizes={gridSize8(false)}>
              <div
                className={`${typography('body', 'xl', 'regular')} body-text`}
              >
                <p>{introText}</p>
              </div>
            </Layout>
          )}
        </Container>
      </ArchivesHeaderContainer>

      <DecorativeEdge variant="wobbly" backgroundColor="white" />
    </>
  );
};

export default ArchivesHeader;
