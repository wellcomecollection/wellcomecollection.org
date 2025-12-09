import { FunctionComponent } from 'react';
import styled from 'styled-components';

import { accessibleSquare, inductionLoopSquare } from '@weco/common/icons';
import Icon from '@weco/common/views/components/Icon';
import PlainList from '@weco/common/views/components/styled/PlainList';
import Space from '@weco/common/views/components/styled/Space';

const Li = styled(Space).attrs({
  as: 'li',
  $v: { size: '2xs', properties: ['margin-bottom'] },
})`
  display: flex;
  gap: 0.5em;
  align-items: center;
`;

const IconWrap = styled(Space).attrs({
  $h: {
    size: '2xs',
    properties: ['padding-left', 'padding-right'],
  },
  $v: { size: '2xs', properties: ['padding-top', 'padding-bottom'] },
})`
  display: flex;
  border-radius: 6px;

  .icon {
    color: ${props => props.theme.color('white')};
  }
`;

const FooterA11y: FunctionComponent = () => {
  return (
    <div>
      <Space
        style={{ font: 'unset' }}
        $v={{ size: 'xs', properties: ['margin-bottom'] }}
        as="h4"
      >
        Our building has:
      </Space>
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
      <Space
        as="p"
        $v={{ size: 'sm', properties: ['margin-top'] }}
        style={{ marginBottom: 0 }}
      >
        <a href="/visit-us/accessibility">Access information</a>
      </Space>
    </div>
  );
};

export default FooterA11y;
