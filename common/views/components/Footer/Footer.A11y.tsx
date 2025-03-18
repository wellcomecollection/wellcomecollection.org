import { FunctionComponent } from 'react';
import styled from 'styled-components';

import {
  accessibleSquare,
  audioDescribedSquare,
  bslSquare,
  closedCaptioningSquare,
  inductionLoopSquare,
} from '@weco/common/icons';
import Icon from '@weco/common/views/components/Icon/Icon';
import PlainList from '@weco/common/views/components/styled/PlainList';
import Space from '@weco/common/views/components/styled/Space';

const Li = styled(Space).attrs({
  as: 'li',
  $v: { size: 'xs', properties: ['margin-bottom'] },
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
    <div>
      <h4>Our building has:</h4>
      <PlainList>
        <Li>
          <IconWrap>
            <Icon icon={accessibleSquare} />
          </IconWrap>
          <span>Step free access</span>
        </Li>
        <Li>
          <IconWrap>
            <Icon icon={inductionLoopSquare} />
          </IconWrap>
          <span>Hearing loops</span>
        </Li>
      </PlainList>
      <Space $v={{ size: 'm', properties: ['margin-top'] }}>
        <h4>Our exhibitions and events include:</h4>
      </Space>
      <PlainList>
        <Li>
          <IconWrap>
            <Icon icon={bslSquare} />
          </IconWrap>
          <span>British Sign Language</span>
        </Li>
        <Li>
          <IconWrap>
            <Icon icon={audioDescribedSquare} />
          </IconWrap>
          <span>Audio description</span>
        </Li>
        <Li>
          <IconWrap>
            <Icon icon={closedCaptioningSquare} />
          </IconWrap>
          <span>Captions</span>
        </Li>
      </PlainList>
      <Space as="p" $v={{ size: 'm', properties: ['margin-top'] }}>
        <a href="/visit-us/accessibility">Accessibility</a>
      </Space>
    </div>
  );
};

export default FooterA11y;
