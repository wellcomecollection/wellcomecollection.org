import { FC } from 'react';
import styled from 'styled-components';
import Space from '@weco/common/views/components/styled/Space';
import Icon from '@weco/common/views/components/Icon/Icon';
import LL from '@weco/common/views/components/styled/LL';
import AlignFont from '@weco/common/views/components/styled/AlignFont';
import { useUser } from '@weco/common/views/components/UserProvider/UserProvider';
import { font } from '@weco/common/utils/classnames';
import { memberCard } from '@weco/common/icons';

const StyledComponent = styled(Space).attrs({
  h: { size: 'm', properties: ['padding-left', 'padding-right'] },
  v: { size: 's', properties: ['padding-top', 'padding-bottom'] },
})`
  background: ${props => props.theme.color('turquoise', 'light')};
  display: flex;
  align-items: flex-start;
  position: relative;

  .icon {
    transform: translateY(0.1em);
  }
`;

const SignInLink: FC = () => {
  return (
    <AlignFont>
      <span className={font('hnb', 5)}>Library members:</span>{' '}
      <a href="/account/login" className={font('hnr', 5)}>
        sign in to your library account to request items
      </a>
    </AlignFont>
  );
};

type ReloadProps = {
  reload: () => void;
};
const Reload: FC<ReloadProps> = ({ reload }) => {
  return (
    <AlignFont>
      <span className={font('hnb', 5)}>
        Something went wrong trying to check if you are signed in
      </span>{' '}
      <button
        className={font('hnr', 5)}
        onClick={() => {
          reload();
        }}
        style={{
          border: 'none',
          background: 'none',
          cursor: 'pointer',
          borderBottom: '1px solid',
        }}
      >
        Try again
      </button>
    </AlignFont>
  );
};

const SignInBar: FC = () => {
  const { state, reload } = useUser();

  return state === 'signedout' || state === 'failed' ? (
    <StyledComponent>
      <Space h={{ size: 's', properties: ['margin-right'] }}>
        <Icon icon={memberCard} />
      </Space>
      {state === 'signedout' && <SignInLink />}
      {state === 'failed' && <Reload reload={reload} />}
    </StyledComponent>
  ) : null;
};

export default SignInBar;
