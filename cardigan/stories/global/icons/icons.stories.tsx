import { FunctionComponent } from 'react';
import Icon from '@weco/common/views/components/Icon/Icon';
import * as icons from '@weco/common/icons';
import { font, classNames } from '@weco/common/utils/classnames';
import styled from 'styled-components';

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
  className: classNames({
    [font('lr', 5)]: true,
  }),
})`
  hyphens: auto;
`;

export const Icons: FunctionComponent = () => (
  <>
    {Object.keys(icons).map(key => (
      <IconWrapper key={key}>
        <Icon name={key} />
        <IconId>{key}</IconId>
      </IconWrapper>
    ))}
  </>
);
