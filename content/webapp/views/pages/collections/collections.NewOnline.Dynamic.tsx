import { FunctionComponent } from 'react';

import { Grid, GridCell } from '@weco/common/views/components/styled/Grid';
import Space from '@weco/common/views/components/styled/Space';
import { WorkBasic } from '@weco/content/services/wellcome/catalogue/types';
import WorkCardAPI from '@weco/content/views/components/WorkCard/WorkCard.API';

type Props = {
  newOnlineDocuments: WorkBasic[];
};

const NewOnline: FunctionComponent<Props> = ({ newOnlineDocuments }) => {
  return (
    <Space $v={{ size: 'xl', properties: ['margin-top'] }}>
      <Grid>
        {newOnlineDocuments.map(item => (
          <GridCell
            key={item.id}
            $sizeMap={{ s: [12], m: [6], l: [3], xl: [3] }}
          >
            <WorkCardAPI item={item} />
          </GridCell>
        ))}
      </Grid>
    </Space>
  );
};

export default NewOnline;
