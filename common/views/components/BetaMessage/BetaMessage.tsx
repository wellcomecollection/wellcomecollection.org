import { ReactElement, FunctionComponent, ReactNode } from 'react';
import { font } from '@weco/common/utils/classnames';
import styled from 'styled-components';
import Icon from '@weco/common/views/components/Icon/Icon';
import Space from '@weco/common/views/components/styled/Space';
import { underConstruction } from '@weco/common/icons';

const StyledBetaMessage = styled.div.attrs({
  className: font('intr', 5),
})`
  display: flex;
  align-items: center;
  border-left: ${props => `4px solid ${props.theme.color('accent.purple')}`};
  padding-left: ${props => props.theme.spacingUnit}px;
`;

type Props = { message: string | ReactNode };

const BetaMessage: FunctionComponent<Props> = ({
  message,
}: Props): ReactElement => (
  <StyledBetaMessage>
    <Space h={{ size: 's', properties: ['margin-right'] }}>
      <Icon icon={underConstruction} />
    </Space>
    <p style={{ marginBottom: 0 }}>{message}</p>
  </StyledBetaMessage>
);

export default BetaMessage;
