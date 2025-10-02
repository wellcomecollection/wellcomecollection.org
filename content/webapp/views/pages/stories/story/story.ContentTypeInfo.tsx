import styled from 'styled-components';

import { font } from '@weco/common/utils/classnames';
import { capitalize } from '@weco/common/utils/grammar';
import HTMLDateAndTime from '@weco/common/views/components/HTMLDateAndTime';
import Space from '@weco/common/views/components/styled/Space';
import Standfirst from '@weco/common/views/slices/Standfirst';
import { Article } from '@weco/content/types/articles';

const ContentTypeWrapper = styled.div`
  display: flex;
  align-items: baseline;
`;

const ContentTypeText = styled.p.attrs({
  className: font('intr', 6),
})`
  margin: 0;
`;

const ContentTypeInfoSection = styled.span`
  &:not(:first-child)::before {
    content: ' | ';
    margin: 0 4px;
  }
`;

const HTMLDateWrapper = styled.span.attrs({ className: font('intr', 6) })`
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
      <Space $v={{ size: 's', properties: ['margin-top'] }}>
        <ContentTypeText>
          {article.contributors.length > 0 &&
            article.contributors.map(({ contributor, role }, i) => (
              <ContentTypeInfoSection
                data-testid="contributor-name"
                key={contributor.id}
              >
                {role && role.describedBy && (
                  <span>
                    {i === 0 ? capitalize(role.describedBy) : role.describedBy}{' '}
                    by{' '}
                  </span>
                )}
                <span className={font('intb', 6)}>{contributor.name}</span>
              </ContentTypeInfoSection>
            ))}
          {article.readingTime ? (
            <ContentTypeInfoSection>
              average reading time{' '}
              <span className={font('intb', 6)}>{article.readingTime}</span>
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
