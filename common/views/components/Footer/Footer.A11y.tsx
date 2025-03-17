import { FunctionComponent } from 'react';
import styled from 'styled-components';

import { information } from '@weco/common/icons';
import Icon from '@weco/common/views/components/Icon/Icon';
import PlainList from '@weco/common/views/components/styled/PlainList';
import Space from '@weco/common/views/components/styled/Space';

const IconLi = styled(Space).attrs({
  as: 'li',
  $v: { size: 's', properties: ['margin-bottom'] },
})`
  display: flex;
  align-items: center;
`;

const IconWrap = styled(Space).attrs({
  'aria-hidden': true,
  $h: { size: 's', properties: ['margin-right'] },
})``;

const FooterA11y: FunctionComponent = () => {
  return (
    <PlainList>
      <IconLi>
        <IconWrap>
          <Icon icon={information} />
        </IconWrap>
        Our building has step-free access.
      </IconLi>
      <IconLi>
        All exhibitions and most events offer BSL, Audio Description, and
        Hearing Loop support.
      </IconLi>
      <IconLi>
        <IconWrap>
          <Icon icon={information} />
        </IconWrap>
        British Sign Language
      </IconLi>
      <IconLi>
        <IconWrap>
          <Icon icon={information} />
        </IconWrap>
        Audio description
      </IconLi>
      <IconLi>
        <IconWrap>
          <Icon icon={information} />
        </IconWrap>
        Hearing loop
      </IconLi>
    </PlainList>
  );
};

export default FooterA11y;
