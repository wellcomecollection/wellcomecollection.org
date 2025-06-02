import { FunctionComponent } from 'react';

import { capitalize } from '@weco/common/utils/grammar';
import styled from 'styled-components';
import { font } from '@weco/common/utils/classnames';

const AlternativeLabels = styled.div.attrs({
  className: font('intr', 6),
})`
  display: flex;
  gap: 10px;
  margin-bottom: 24px;
  flex-wrap: wrap;
  margin-top: -12px;
  color: ${props => props.theme.color('neutral.700')};
`;

const AlternativeLabel = styled.span.attrs({
  className: font('intr', 6),
})`
    border-right: 1px solid ${props => props.theme.color('neutral.700')};
    padding-right: 12px;

    &:last-of-type {
        border-right: 0;
    }
`;

type Props = {
  alternativeLabels: string[] | undefined;
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
