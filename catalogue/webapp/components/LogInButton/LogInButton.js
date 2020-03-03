// @flow
import useAuth from '@weco/common/hooks/useAuth';

type Props = {| workId: string |};
const LogInButton = ({ workId }: Props) => {
  function setRedirectCookie(workId: string) {
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set('action', `requestItem:/works/${workId}`);

    const url = `${window.location.pathname}?${searchParams.toString()}`;
    document.cookie = `WC_auth_redirect=${url}; path=/`;
  }

  const authState = useAuth();

  return authState.type === 'unauthorized' ? (
    <div data-test-id="libraryLoginCTA">
      <a
        href={authState.loginUrl}
        className="btn btn--primary  font-hnm font-size-5  flex-inline flex--v-center"
        onClick={event => {
          setRedirectCookie(workId);
        }}
      >
        <span className="flex flex--v-center flex--h-center">
          <span className="btn__text">Log in to request</span>
        </span>
      </a>
    </div>
  ) : null;
};

export default LogInButton;
