import { FunctionComponent, ReactElement, ReactNode } from 'react';
import styled from 'styled-components';

import { underConstruction } from '@weco/common/icons';
import { font } from '@weco/common/utils/classnames';
import Icon from '@weco/common/views/components/Icon';
import Space from '@weco/common/views/components/styled/Space';

const StyledBetaMessage = styled.div.attrs({
  className: font('sans', -1),
})`
  display: flex;
  align-items: center;
`;

type Props = { message: string | ReactNode };

const BetaMessage: FunctionComponent<Props> = ({
  message,
}: Props): ReactElement => (
  <StyledBetaMessage data-component="beta-message">
    <Space $h={{ size: '2xs', properties: ['margin-right'] }}>
      <Icon icon={underConstruction} />
    </Space>
    <p style={{ marginBottom: 0 }}>{message}</p>
  </StyledBetaMessage>
);

export default BetaMessage;
