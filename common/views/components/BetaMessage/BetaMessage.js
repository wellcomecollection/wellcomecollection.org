import { font, classNames } from '../../../utils/classnames';
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

  p {
    margin: 0;
  }
`;

type Props = {| message: string |};

const BetaMessage = ({ message }: Props) => {
  return (
    <StyledBetaMessage>
      <Icon name="underConstruction" extraClasses="margin-right-s2" />
      <p>{message}</p>
    </StyledBetaMessage>
  );
};

export default BetaMessage;
