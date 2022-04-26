import { FC } from 'react';
import Divider from '@weco/common/views/components/Divider/Divider';
import { YellowBorder } from './Registration.style';
import { SectionHeading } from '../components/Layout.style';
import { font } from '@weco/common/utils/classnames';
import Space from '@weco/common/views/components/styled/Space';
import { UserInfo } from '@weco/common/model/user';

type Props = {
  user: UserInfo;
};

const RegistrationInformation: FC<Props> = ({ user }) => {
  return (
    <>
      <SectionHeading as="h1">Apply for a library membership</SectionHeading>
      <div className="body-text">
        <p>With a library membership and online account, you’ll be able to:</p>
        <ul>
          <li>
            Request up to 15 materials from our closed stores to view in the
            library
          </li>
          <li>Access subscription databases and other online resources.</li>
        </ul>
        <p>
          When you complete your registration online, you’ll need to email a
          form of personal identification (ID) and proof of address to the
          Library team in order to confirm your membership. Your membership will
          be confirmed within 72 hours.
        </p>

        <YellowBorder>
          <p>
            <strong>Note:</strong> You don’t need to apply for a membership if
            you wish to view our digital collections or visit the library for
            the day.
          </p>
        </YellowBorder>
      </div>

      <h2 className={font('hnb', 4)}>Your details</h2>
      <p className="no-margin">
        Email address: <strong className={font('hnb', 5)}>{user.email}</strong>
      </p>
      <Space
        v={{
          size: 'm',
          properties: ['margin-top', 'margin-bottom'],
        }}
      >
        <Divider color={`pumice`} isKeyline />
      </Space>
    </>
  );
};

export default RegistrationInformation;
