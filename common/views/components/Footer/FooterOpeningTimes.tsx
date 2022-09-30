import { ReactElement } from 'react';
import { font } from '@weco/common/utils/classnames';
import Space from '@weco/common/views/components/styled/Space';
import OpeningTimes from '@weco/common/views/components/OpeningTimes/OpeningTimes';
import { Venue } from '@weco/common/model/opening-hours';

const FooterOpeningTimes = ({ venues }: { venues: Venue[] }): ReactElement => {
  return (
    <>
      <h4 className={font('intb', 5)}>{`Today's opening times`}</h4>
      {venues && <OpeningTimes venues={venues} />}
      <Space as="p" v={{ size: 's', properties: ['margin-top'] }}>
        <a href="/opening-times">Opening times</a>
      </Space>
    </>
  );
};

export default FooterOpeningTimes;
