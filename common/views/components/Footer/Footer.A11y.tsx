import { FunctionComponent } from 'react';
import styled from 'styled-components';

import { information } from '@weco/common/icons';
import Icon from '@weco/common/views/components/Icon/Icon';
import PlainList from '@weco/common/views/components/styled/PlainList';
import Space from '@weco/common/views/components/styled/Space';

const IconLi = styled(Space).attrs({
  as: 'li',
  $v: { size: 'm', properties: ['margin-bottom'] },
})`
  display: flex;
  gap: 0.5em;
  align-items: center;
`;

const IconWrap = styled(Space).attrs({
  'aria-hidden': true,
  $h: {
    size: 'xs',
    properties: ['padding-left', 'padding-right'],
  },
  $v: { size: 'xs', properties: ['padding-top', 'padding-bottom'] },
})`
  display: flex;
  background: ${props => props.theme.color('white')};
  border-radius: 6px;

  .icon {
    color: ${props => props.theme.color('black')};
  }
`;

const FooterA11y: FunctionComponent = () => {
  return (
    <PlainList>
      <IconLi>
        <IconWrap>
          <Icon icon={information} />
        </IconWrap>
        <span>Our building has step-free access.</span>
      </IconLi>
      <IconLi>
        <span>
          All exhibitions and most events offer BSL, Audio Description, and
          Hearing Loop support.
        </span>
      </IconLi>
      <IconLi>
        <IconWrap>
          <Icon icon={information} />
        </IconWrap>
        <span>British Sign Language</span>
      </IconLi>
      <IconLi>
        <IconWrap>
          <Icon icon={information} />
        </IconWrap>
        <span>Audio description</span>
      </IconLi>
      <IconLi>
        <IconWrap>
          <Icon icon={information} />
        </IconWrap>
        <span>Hearing loop</span>
      </IconLi>
      <IconLi>
        <span>
          See our <a href="/visit-us/accessibility">accessibility page</a> for
          details.
        </span>
      </IconLi>
    </PlainList>
  );
};

export default FooterA11y;
