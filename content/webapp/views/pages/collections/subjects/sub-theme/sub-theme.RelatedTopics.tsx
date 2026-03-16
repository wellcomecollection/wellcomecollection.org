import styled from 'styled-components';

import { font } from '@weco/common/utils/classnames';
import Button from '@weco/common/views/components/Buttons';
import Space from '@weco/common/views/components/styled/Space';
import { themeValues } from '@weco/common/views/themes/config';
import { RelatedConcept } from '@weco/content/services/wellcome/catalogue/types';

const RelatedConceptsContainer = styled.div.attrs({
  className: font('sans-bold', -1),
})`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: ${props => props.theme.spacingUnits['100']};
`;
const RelatedConceptItem = styled.div.attrs({
  className: font('sans', -2),
})`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacingUnits['100']};
`;

const SubThemeRelatedTopics = ({
  relatedTopics,
}: {
  relatedTopics: RelatedConcept[];
}) => {
  return (
    <Space $v={{ size: 'md', properties: ['margin-top'] }}>
      <RelatedConceptsContainer>
        {relatedTopics.map((item, index) => (
          <RelatedConceptItem key={item.id}>
            <Space className={font('sans', -1)}>
              <Button
                variant="ButtonSolidLink"
                colors={themeValues.buttonColors.slateTransparentBlack}
                text={item.label}
                link={`/concepts/${item.id}`}
                size="small"
                dataGtmProps={{
                  trigger: 'related_topics',
                  'position-in-list': `${index + 1}`,
                }}
              />
            </Space>
          </RelatedConceptItem>
        ))}
      </RelatedConceptsContainer>
    </Space>
  );
};

export default SubThemeRelatedTopics;
