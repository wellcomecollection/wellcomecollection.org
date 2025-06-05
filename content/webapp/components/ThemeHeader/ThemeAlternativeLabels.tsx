import { FunctionComponent } from 'react';

import { capitalize } from '@weco/common/utils/grammar';
import styled from 'styled-components';
import { font } from '@weco/common/utils/classnames';
import Space from "@weco/common/views/components/styled/Space";

const AlternativeLabels = styled(Space).attrs({
  className: font('intr', 6),
  $v: { size: 'm', properties: ['margin-bottom'] },
})`
  display: flex;
  flex-wrap: wrap;
  gap: ${props => props.theme.spacingUnits['3']}px;
  color: ${props => props.theme.color('neutral.700')};
`;

const AlternativeLabel = styled.span.attrs({
  className: font('intr', 6),
})`
    border-right: 1px solid ${props => props.theme.color('neutral.700')};
    padding-right: ${props => props.theme.spacingUnits['3']}px;

    &:last-of-type {
        border-right: 0;
    }
`;

type Props = {
  alternativeLabels?: string[];
};

const ThemeAlternativeLabels: FunctionComponent<Props> = ({ alternativeLabels }) => {
  if (!alternativeLabels || alternativeLabels.length === 0) {
    return null;
  }

  return (
    <AlternativeLabels>
      {alternativeLabels.map(label => (
        <AlternativeLabel key={label}>{capitalize(label)}</AlternativeLabel>
      ))}
    </AlternativeLabels>
  );
};
export default ThemeAlternativeLabels;
