import { useEffect } from 'react';
import { trackEvent } from '@weco/common/utils/ga';
import { font, classNames } from '@weco/common/utils/classnames';
import styled from 'styled-components';
import Icon from '@weco/common/views/components/Icon/Icon';

const StyledBetaMessage = styled.div.attrs(props => ({
  className: classNames({
    [font({ s: 'HNL5', m: 'HNL4' })]: true,
    'flex flex--v-center': true,
  }),
}))`
  border-left: ${props => `4px solid ${props.theme.colors.purple}`};
  padding-left: ${props => props.theme.spacingUnit}px;
`;

type Props = {| message: string |};

const BetaMessage = ({ message }: Props) => {
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
