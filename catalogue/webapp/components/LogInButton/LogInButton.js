// @flow
import Button from '@weco/common/views/components/Buttons/Button/Button';
type Props = {| workId: string, loginUrl: string |};
const LogInButton = ({ workId, loginUrl }: Props) => {
  function setRedirectCookie(workId: string) {
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set('action', `requestItem:/works/${workId}`);

    const url = `${window.location.pathname}?${searchParams.toString()}`;
    document.cookie = `WC_auth_redirect=${url}; path=/`;
  }

  return (
    <div data-test-id="libraryLoginCTA">
      <Button
        type="primary"
        text="Log in to request"
        externalLink={loginUrl}
        clickHandler={event => {
          setRedirectCookie(workId);
        }}
      />
    </div>
  );
};

export default LogInButton;
