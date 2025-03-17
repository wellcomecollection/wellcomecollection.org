import { FunctionComponent } from 'react';
import styled from 'styled-components';

import {
  a11YFilled,
  audioDescribedFilled,
  britishSignLanguageTranslationFilled,
  hearingLoopFilled,
} from '@weco/common/icons';
import Icon from '@weco/common/views/components/Icon/Icon';
import PlainList from '@weco/common/views/components/styled/PlainList';
import Space from '@weco/common/views/components/styled/Space';

const Li = styled(Space).attrs({
  as: 'li',
  $v: { size: 'm', properties: ['margin-bottom'] },
})`
  display: flex;
  gap: 0.5em;
  align-items: center;
`;

const IconWrap = styled(Space).attrs({
  $h: {
    size: 'xs',
    properties: ['padding-left', 'padding-right'],
  },
  $v: { size: 'xs', properties: ['padding-top', 'padding-bottom'] },
})`
  display: flex;
  border-radius: 6px;

  .icon {
    width: 32px;
    height: 32px;
    color: ${props => props.theme.color('white')};
  }
`;

const FooterA11y: FunctionComponent = () => {
  return (
    <PlainList>
      <Li>
        <IconWrap>
          <Icon icon={a11YFilled} />
        </IconWrap>
        <span>Our building has step-free access.</span>
      </Li>
      <Li>
        <span>
          All exhibitions and most events offer BSL, Audio Description, and
          Hearing Loop support.
        </span>
      </Li>
      <Li aria-hidden="true">
        <IconWrap>
          <Icon icon={britishSignLanguageTranslationFilled} />
        </IconWrap>
        <span>British Sign Language</span>
      </Li>
      <Li aria-hidden="true">
        <IconWrap>
          <Icon icon={audioDescribedFilled} />
        </IconWrap>
        <span>Audio description</span>
      </Li>
      <Li aria-hidden="true">
        <IconWrap>
          <Icon icon={hearingLoopFilled} />
        </IconWrap>
        <span>Hearing loop</span>
      </Li>
      <Li>
        <span>
          See our <a href="/visit-us/accessibility">accessibility page</a> for
          details.
        </span>
      </Li>
    </PlainList>
  );
};

export default FooterA11y;
