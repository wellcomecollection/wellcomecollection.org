import { FunctionComponent } from 'react';
import styled from 'styled-components';

import { font } from '@weco/common/utils/classnames';
import Button, { ButtonColors } from '@weco/common/views/components/Buttons';
import Space from '@weco/common/views/components/styled/Space';
import { themeValues } from '@weco/common/views/themes/config';
import { RelatedConcept } from '@weco/content/services/wellcome/catalogue/types';

const RelatedConceptsContainer = styled.div.attrs({
  className: font('intm', 5),
})`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: ${props => props.theme.spacingUnits['3']}px;
`;

const RelatedConceptItem = styled.div.attrs<{ $isFullWidth: boolean }>({
  className: font('intr', 6),
})`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacingUnits['3']}px;
  width: ${props => (props.$isFullWidth ? '100%' : 'auto')};
`;

const SectionHeading = styled(Space).attrs({
  as: 'h2',
  className: font('intsb', 2),
  $v: { size: 'l', properties: ['margin-top'] },
})``;

type Props = {
  label: string;
  labelType: 'inline' | 'heading';
  relatedConcepts?: RelatedConcept[];
  buttonColors?: ButtonColors;
};

const RelatedConceptsGroup: FunctionComponent<Props> = ({
  label,
  labelType,
  relatedConcepts,
  buttonColors,
}: Props) => {
  if (!relatedConcepts || relatedConcepts.length === 0) {
    return null;
  }

  return (
    <>
      {labelType === 'heading' && <SectionHeading>{label}</SectionHeading>}
      <RelatedConceptsContainer>
        {labelType === 'inline' && <span>{label}</span>}
        {relatedConcepts.map(item => (
          <RelatedConceptItem
            key={item.id}
            $isFullWidth={
              !!item.relationshipType && item.relationshipType?.length > 0
            }
          >
            <Space className={font('intr', 5)}>
              <Button
                variant="ButtonSolidLink"
                colors={
                  buttonColors ||
                  themeValues.buttonColors.charcoalTransparentCharcoal
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
    </>
  );
};

export default RelatedConceptsGroup;
