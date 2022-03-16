import { FC } from 'react';
import styled from 'styled-components';
import Space from '@weco/common/views/components/styled/Space';
import Icon from '@weco/common/views/components/Icon/Icon';
import AlignFont from '@weco/common/views/components/styled/AlignFont';
import { useUser } from '@weco/common/views/components/UserProvider/UserProvider';
import { useLoginURLWithReturnToCurrent } from '@weco/common/utils/useLoginURLWithReturnToCurrent';
import { font } from '@weco/common/utils/classnames';
import { memberCard } from '@weco/common/icons';
import { trackEvent } from '@weco/common/utils/ga';

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
  const loginURL = useLoginURLWithReturnToCurrent();
  return (
    <AlignFont>
      <span className={font('hnb', 5)}>Library members:</span>{' '}
      <a
        href={loginURL}
        className={font('hnr', 5)}
        onClick={() => {
          trackEvent({
            category: 'library_account',
            action: 'login',
            label: window.location.pathname,
          });
        }}
      >
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

type Props = {
  requestingUnavailable?: boolean;
};

const LibraryMembersBar: FC<Props> = ({ requestingUnavailable }) => {
  const { state, reload } = useUser();

  // We originally designed this banner for the building closure in Christmas 2021.
  //
  // We're keeping the banner around in case we need to disable requesting again for
  // other reasons in future – we can reuse the same design.
  //
  // If you do need to disable requesting, remember to update the wording in the explanation.
  if (requestingUnavailable) {
    return (
      <StyledComponent>
        <Space h={{ size: 's', properties: ['margin-right'] }}>
          <Icon icon={memberCard} />
        </Space>
        <AlignFont>
          <span className={font('hnb', 5)}>Library members:</span>{' '}
          <span className={font('hnr', 5)}>
            Requesting is currently unavailable.
          </span>
        </AlignFont>
      </StyledComponent>
    );
  }

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

export default LibraryMembersBar;
