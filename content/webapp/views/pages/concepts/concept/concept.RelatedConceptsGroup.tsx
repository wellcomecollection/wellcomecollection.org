import { FunctionComponent } from 'react';
import styled from 'styled-components';

import { typography } from '@weco/common/utils/classnames';
import { dasherize } from '@weco/common/utils/grammar';
import { dataGtmPropsToAttributes } from '@weco/common/utils/gtm';
import Space from '@weco/common/views/components/styled/Space';
import { RelatedConcept } from '@weco/content/services/wellcome/catalogue/types';
import { SelectableTagLink } from '@weco/content/views/components/SelectableTags';

const RelatedConceptsContainer = styled.div.attrs({
  className: typography('body', 'md', 'strong'),
})`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: ${props => props.theme.spacingUnits['100']};
`;

const RelatedConceptItem = styled.div.attrs<{ $isFullWidth: boolean }>({
  className: typography('body', 'sm', 'regular'),
})`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacingUnits['100']};
  width: ${props => (props.$isFullWidth ? '100%' : 'auto')};
`;

const SectionHeading = styled.h2.attrs({
  className: typography('heading', 'xl', 'strong', 'brand'),
})``;

const InlineLabel = styled.div`
  width: 100%;

  ${props => props.theme.media('sm')`
    width: auto;
  `}
`;

type Props = {
  label: string;
  labelType: 'inline' | 'heading';
  relatedConcepts?: RelatedConcept[];
  dataGtmTriggerName?: string;
};

const RelatedConceptsGroup: FunctionComponent<Props> = ({
  label,
  labelType,
  relatedConcepts,
  dataGtmTriggerName,
}: Props) => {
  if (!relatedConcepts || relatedConcepts.length === 0) {
    return null;
  }

  return (
    <Space $v={{ size: 'md', properties: ['margin-top'] }} as="section">
      {labelType === 'heading' && (
        <SectionHeading id={dasherize(label)}>{label}</SectionHeading>
      )}
      <RelatedConceptsContainer>
        {labelType === 'inline' && <InlineLabel>{label}</InlineLabel>}
        {relatedConcepts.map((item, index) => (
          <RelatedConceptItem
            key={item.id}
            $isFullWidth={
              !!item.relationshipType && item.relationshipType?.length > 0
            }
          >
            <SelectableTagLink
              href={`/concepts/${item.id}`}
              $lineColor="black"
              $lineThickness={1.4}
              $isSelected={false}
              {...(dataGtmTriggerName &&
                dataGtmPropsToAttributes({
                  trigger: dataGtmTriggerName,
                  'position-in-list': `${index + 1}`,
                }))}
            >
              <span>{item.label}</span>
            </SelectableTagLink>
            {item.relationshipType?.replace('has_', '')}
          </RelatedConceptItem>
        ))}
      </RelatedConceptsContainer>
    </Space>
  );
};

export default RelatedConceptsGroup;
