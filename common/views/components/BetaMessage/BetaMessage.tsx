import { useEffect, ReactElement, FunctionComponent } from 'react';
import { trackEvent } from '@weco/common/utils/ga';
import { font, classNames } from '@weco/common/utils/classnames';
import styled from 'styled-components';
import Icon from '@weco/common/views/components/Icon/Icon';
import Space from '@weco/common/views/components/styled/Space';

const StyledBetaMessage = styled.div.attrs(() => ({
  className: classNames({
    [font('hnr', 5)]: true,
    'flex flex--v-center': true,
  }),
}))`
  border-left: ${props => `4px solid ${props.theme.color('purple')}`};
  padding-left: ${props => props.theme.spacingUnit}px;
`;

type Props = { message: string };

const BetaMessage: FunctionComponent<Props> = ({
  message,
}: Props): ReactElement => {
  useEffect(() => {
    trackEvent({
      category: 'BetaMessage',
      action: 'message displayed',
      label: message,
    });
  }, []);
  return (
    <StyledBetaMessage>
      <Space h={{ size: 's', properties: ['margin-right'] }}>
        <Icon name="underConstruction" />
      </Space>
      <p className="no-margin">{message}</p>
    </StyledBetaMessage>
  );
};

export default BetaMessage;
