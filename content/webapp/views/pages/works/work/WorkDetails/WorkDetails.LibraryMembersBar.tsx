import { FunctionComponent } from 'react';
import styled from 'styled-components';

import { useUserContext } from '@weco/common/contexts/UserContext';
import { requestingDisabled } from '@weco/common/data/microcopy';
import { memberCard } from '@weco/common/icons';
import { useToggles } from '@weco/common/server-data/Context';
import { font } from '@weco/common/utils/classnames';
import Icon from '@weco/common/views/components/Icon';
import Space from '@weco/common/views/components/styled/Space';
import { useLoginURLWithReturnToCurrent } from '@weco/content/utils/useLoginURLWithReturnToCurrent';

const StyledComponent = styled(Space).attrs({
  $h: { size: 'm', properties: ['padding-left', 'padding-right'] },
  $v: { size: 's', properties: ['padding-top', 'padding-bottom'] },
})`
  background: ${props => props.theme.color('accent.lightTurquoise')};
  display: flex;
  align-items: center;
  position: relative;

  .icon {
    transform: translateY(0.2em);
  }
`;

const SignInLink: FunctionComponent = () => {
  const loginURL = useLoginURLWithReturnToCurrent();
  return (
    <>
      <Space
        $h={{ size: 's', properties: ['margin-right'] }}
        className={font('intb', -1)}
      >
        Library members:
      </Space>
      <a
        href={loginURL}
        data-gtm-trigger="library_account_login"
        className={font('intr', -1)}
      >
        sign in to your library account to request items
      </a>
    </>
  );
};

type ReloadProps = {
  reload: () => void;
};
const Reload: FunctionComponent<ReloadProps> = ({ reload }) => {
  return (
    <>
      <span className={font('intb', -1)}>
        Something went wrong trying to check if you are signed in
      </span>{' '}
      <button
        className={font('intr', -1)}
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
    </>
  );
};

const LibraryMembersBar: FunctionComponent = () => {
  const { state, reload } = useUserContext();
  const { disableRequesting } = useToggles();
  if (disableRequesting) {
    return (
      <StyledComponent>
        <Space $h={{ size: 's', properties: ['margin-right'] }}>
          <Icon icon={memberCard} />
        </Space>
        <Space
          $h={{ size: 's', properties: ['margin-right'] }}
          className={font('intb', -1)}
        >
          Library members:
        </Space>
        <span data-testid="requesting-disabled" className={font('intr', -1)}>
          {requestingDisabled}
        </span>
      </StyledComponent>
    );
  }

  return state === 'signedout' || state === 'failed' ? (
    <StyledComponent>
      <Space $h={{ size: 's', properties: ['margin-right'] }}>
        <Icon icon={memberCard} />
      </Space>
      {state === 'signedout' && <SignInLink />}
      {state === 'failed' && <Reload reload={reload} />}
    </StyledComponent>
  ) : null;
};

export default LibraryMembersBar;
