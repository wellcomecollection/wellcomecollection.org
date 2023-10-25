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

export const ResourceLink = styled(Space).attrs({
  as: 'a',
  $h: { size: 's', properties: ['padding-left', 'padding-right'] },
  $v: { size: 'm', properties: ['padding-top', 'padding-bottom'] },
})<{ href: string; $borderColor: PaletteColor; $underlineText?: boolean }>`
  display: block;
  height: 100%;
  width: 100%;
  text-decoration: ${props => (props.$underlineText ? 'underline' : 'none')};
  border: 1px solid ${props => props.theme.color('warmNeutral.400')};
  border-left: 10px solid ${props => props.theme.color(props.$borderColor)};

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
