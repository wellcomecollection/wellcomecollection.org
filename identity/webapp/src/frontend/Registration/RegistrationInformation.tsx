import { FunctionComponent } from 'react';
import Divider from '@weco/common/views/components/Divider/Divider';
import { SectionHeading } from '../components/Layout.style';
import { font } from '@weco/common/utils/classnames';
import Space from '@weco/common/views/components/styled/Space';

type Props = {
  email: string;
};

const RegistrationInformation: FunctionComponent<Props> = ({ email }) => {
  return (
    <>
      <SectionHeading as="h1">Apply for a library membership</SectionHeading>

      <h2 className={font('intb', 4)}>Your details</h2>
      <p style={{ marginBottom: 0 }}>
        Email address: <strong className={font('intb', 5)}>{email}</strong>
      </p>
      <Space $v={{ size: 'm', properties: ['margin-top', 'margin-bottom'] }}>
        <Divider />
      </Space>
    </>
  );
};

export default RegistrationInformation;
