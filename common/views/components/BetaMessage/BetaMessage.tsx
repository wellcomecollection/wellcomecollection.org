import { useEffect, ReactElement, FunctionComponent } from 'react';
import { trackEvent } from '@weco/common/utils/ga';
import { font, classNames } from '@weco/common/utils/classnames';
import styled from 'styled-components';
import Icon from '@weco/common/views/components/Icon/Icon';

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
      <Icon name="underConstruction" extraClasses="margin-right-s2" />
      <p className="no-margin">{message}</p>
    </StyledBetaMessage>
  );
};

export default BetaMessage;
