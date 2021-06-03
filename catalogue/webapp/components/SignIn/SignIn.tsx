import { FunctionComponent } from 'react';
import { useUserInfo } from '@weco/identity/src/frontend/MyAccount/UserInfoContext';
import { classNames } from '@weco/common/utils/classnames';
import Space from '@weco/common/views/components/styled/Space';

const SignIn: FunctionComponent = () => {
  const { user } = useUserInfo();
  return (
    <div style={{ textAlign: 'right' }}>
      <Space
        h={{
          size: 'l',
          properties: ['padding-right', 'padding-left'],
        }}
        className={classNames({
          'text-align-right': true,
        })}
      >
        {!user && <a href="/account">Login</a>}
        {user && (
          <>
            {`Hello ${user.firstName}`},{' '}
            <a href="/account">View your account</a> |{' '}
            <a href="/logout">Logout</a>
          </>
        )}
      </Space>
    </div>
  );
};

export default SignIn;
