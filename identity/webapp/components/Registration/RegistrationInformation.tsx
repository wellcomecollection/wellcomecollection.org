import { FunctionComponent } from 'react';

import { font } from '@weco/common/utils/classnames';
import Divider from '@weco/common/views/components/Divider';
import Space from '@weco/common/views/components/styled/Space';
import { SectionHeading } from '@weco/identity/components/styled/layouts';

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
