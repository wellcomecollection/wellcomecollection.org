// @flow
// $FlowFixMe (tsx)
import ButtonSolidLink from '@weco/common/views/components/ButtonSolidLink/ButtonSolidLink';
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
      <ButtonSolidLink
        text="Log in to request"
        link={loginUrl}
        clickHandler={event => {
          setRedirectCookie(workId);
        }}
        trackingEvent={{
          category: 'Button',
          action: 'follow Cognito login link',
          label: workId,
        }}
      />
    </div>
  );
};

export default LogInButton;
