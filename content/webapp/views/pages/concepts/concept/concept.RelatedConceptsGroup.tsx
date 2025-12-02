import { FunctionComponent } from 'react';
import styled, { useTheme } from 'styled-components';

import { font } from '@weco/common/utils/classnames';
import { dasherize } from '@weco/common/utils/grammar';
import Button, { ButtonColors } from '@weco/common/views/components/Buttons';
import Space from '@weco/common/views/components/styled/Space';
import { RelatedConcept } from '@weco/content/services/wellcome/catalogue/types';

const RelatedConceptsContainer = styled.div.attrs({
  className: font('sans-bold', -1),
})`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: ${props => props.theme.spacingUnits['3']}px;
`;

const RelatedConceptItem = styled.div.attrs<{ $isFullWidth: boolean }>({
  className: font('sans', -2),
})`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacingUnits['3']}px;
  width: ${props => (props.$isFullWidth ? '100%' : 'auto')};
`;

const SectionHeading = styled.h2.attrs({
  className: font('brand', 2),
})``;

const InlineLabel = styled.div`
  width: 100%;

  ${props => props.theme.media('medium')`
    width: auto;
  `}
`;

type Props = {
  label: string;
  labelType: 'inline' | 'heading';
  relatedConcepts?: RelatedConcept[];
  buttonColors?: ButtonColors;
  dataGtmTriggerName?: string;
};

const RelatedConceptsGroup: FunctionComponent<Props> = ({
  label,
  labelType,
  relatedConcepts,
  buttonColors,
  dataGtmTriggerName,
}: Props) => {
  const theme = useTheme();

  if (!relatedConcepts || relatedConcepts.length === 0) {
    return null;
  }

  return (
    <Space
      $v={{ size: 'l', properties: ['margin-top'] }}
      as="section"
      data-id={dasherize(label)}
    >
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
            <Space className={font('sans', -1)}>
              <Button
                {...(dataGtmTriggerName && {
                  dataGtmProps: {
                    trigger: dataGtmTriggerName,
                    'position-in-list': `${index + 1}`,
                  },
                })}
                variant="ButtonSolidLink"
                colors={
                  buttonColors || theme.buttonColors.slateTransparentBlack
                }
                text={item.label}
                link={`/concepts/${item.id}`}
                size="small"
              ></Button>
            </Space>
            {item.relationshipType?.replace('has_', '')}
          </RelatedConceptItem>
        ))}
      </RelatedConceptsContainer>
    </Space>
  );
};

export default RelatedConceptsGroup;
