import Space from '@weco/common/views/components/styled/Space';
import { RelatedConcept } from '../../services/wellcome/catalogue/types';
import { font } from '@weco/common/utils/classnames';
import Button from '@weco/common/views/components/Buttons';
import { themeValues } from '@weco/common/views/themes/config';
import styled from 'styled-components';

const RelatedConceptsContainer = styled(Space).attrs({
  className: font('intm', 5),
})`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: ${props => props.theme.spacingUnits['3']}px;
`;

const RelatedConceptItem = styled(Space).attrs({
  className: font('intr', 6),
})`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacingUnits['3']}px;
`;

const SectionHeading = styled.h2.attrs({
  className: font('intsb', 2),
})``;

type Props = {
  label: string;
  labelType: 'inline' | 'heading';
  relatedConcepts: RelatedConcept[] | undefined;
};

const ThemeRelatedConceptsGroup = ({
  label,
  labelType,
  relatedConcepts,
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
            style={{ width: item.relationshipType ? '100%' : 'auto' }}
          >
            <Space className={font('intr', 5)}>
              <Button
                variant="ButtonSolidLink"
                colors={
                  false
                    ? themeValues.buttonColors.blackTransparentBlack
                    : themeValues.buttonColors.charcoalTransparentBlack
                }
                isPill
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

export default ThemeRelatedConceptsGroup;
