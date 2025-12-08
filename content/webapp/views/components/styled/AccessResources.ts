import styled from 'styled-components';

import PlainList from '@weco/common/views/components/styled/PlainList';
import Space from '@weco/common/views/components/styled/Space';
import { PaletteColor } from '@weco/common/views/themes/config';

export const ResourcesList = styled(PlainList)`
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  ${props => props.theme.media('medium')`
    gap: 30px;
  `}
`;

export const ResourcesItem = styled.li`
  flex: 0 0 100%;
  position: relative;
  min-height: 103px;
  ${props => props.theme.media('medium')`
        flex-basis: calc(50% - 15px);
      `}
`;

export const ResourceLink = styled(Space).attrs<{ href: string }>({
  as: 'a',
  $h: { size: '2xs', properties: ['padding-left'] },
  $v: { size: 'sm', properties: ['padding-top', 'padding-bottom'] },
})<{ $borderColor: PaletteColor; $underlineText?: boolean }>`
  display: block;
  height: 100%;
  width: 100%;
  text-decoration: ${props => (props.$underlineText ? 'underline' : 'none')};
  border: 1px solid ${props => props.theme.color('warmNeutral.400')};
  border-left: 10px solid ${props => props.theme.color(props.$borderColor)};

  /* Accounts for the size of the arrow icon */
  padding-right: 34px;

  &:hover {
    background: ${props => props.theme.color('neutral.400')};
  }

  h3 {
    margin-bottom: 0;
  }

  span {
    display: block;
    max-width: 260px;
  }
`;

export const ResourceLinkIconWrapper = styled.span`
  position: absolute;
  bottom: 10px;
  right: 10px;
`;
