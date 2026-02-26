import styled from 'styled-components';

import { font } from '@weco/common/utils/classnames';
import { capitalize } from '@weco/common/utils/grammar';
import HTMLDateAndTime from '@weco/common/views/components/HTMLDateAndTime';
import Space from '@weco/common/views/components/styled/Space';
import Standfirst from '@weco/common/views/slices/Standfirst';
import { Article } from '@weco/content/types/articles';
import { COMMISSIONING_EDITOR_DESCRIBED_BY } from '@weco/content/types/contributors';

const ContentTypeWrapper = styled.div`
  display: flex;
  align-items: baseline;
`;

const ContentTypeText = styled.p.attrs({
  className: font('sans', -2),
})`
  margin: 0;
`;

const ContentTypeInfoSection = styled.span`
  &:not(:first-child)::before {
    content: ' | ';
    margin: 0 4px;
  }
`;

const HTMLDateWrapper = styled.span.attrs({ className: font('sans', -2) })`
  display: block;
  color: ${props => props.theme.color('neutral.600')};
`;

const ContentTypeInfo = (article: Article) => (
  <>
    {article.untransformedStandfirst && (
      <Standfirst
        slice={article.untransformedStandfirst}
        index={0}
        context={{}}
        slices={[]}
      />
    )}
    <ContentTypeWrapper>
      <Space $v={{ size: 'xs', properties: ['margin-top'] }}>
        <ContentTypeText>
          {/*We don't want to show commissioning editors in the byline at the top of articles. We filter them out here, and only show them as the last contributor(s) in the Contributors component at the end of articles*/}
          {article.contributors.length > 0 &&
            article.contributors
              .filter(
                ({ role }) =>
                  role?.describedBy !== COMMISSIONING_EDITOR_DESCRIBED_BY
              )
              .map(({ contributor, role }, i) => (
                <ContentTypeInfoSection
                  data-testid="contributor-name"
                  key={contributor.id}
                >
                  {role && role.describedBy && (
                    <span>
                      {i === 0
                        ? capitalize(role.describedBy)
                        : role.describedBy}{' '}
                      by{' '}
                    </span>
                  )}
                  <span className={font('sans-bold', -2)}>
                    {contributor.name}
                  </span>
                </ContentTypeInfoSection>
              ))}
          {article.readingTime ? (
            <ContentTypeInfoSection>
              average reading time{' '}
              <span className={font('sans-bold', -2)}>
                {article.readingTime}
              </span>
            </ContentTypeInfoSection>
          ) : null}
          {article.contributors.length > 0 && ' '}

          <HTMLDateWrapper>
            <HTMLDateAndTime variant="date" date={article.datePublished} />
          </HTMLDateWrapper>
        </ContentTypeText>
      </Space>
    </ContentTypeWrapper>
  </>
);

export default ContentTypeInfo;
