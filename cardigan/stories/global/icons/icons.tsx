import styled from 'styled-components';

import * as icons from '@weco/common/icons';
import { typography } from '@weco/common/utils/classnames';
import Icon from '@weco/common/views/components/Icon';

const IconWrapper = styled.div`
  display: inline-block;
  margin: 0 10px 20px;
  text-align: center;
  width: 140px;

  .icon {
    max-width: 80px;
  }
`;

const IconId = styled.p.attrs({
  className: typography('caption', 'md', 'regular'),
})`
  hyphens: auto;
`;

export const Icons = () => (
  <div className="keep-font">
    {Object.keys(icons).map(key => (
      <IconWrapper key={key}>
        <Icon icon={icons[key]} />
        <IconId>{key}</IconId>
      </IconWrapper>
    ))}
  </div>
);
