import styled from 'styled-components';

import { font } from '@weco/common/utils/classnames';
import { Container } from '@weco/common/views/components/styled/Container';
import Space from '@weco/common/views/components/styled/Space';
import { PaletteColor } from '@weco/common/views/themes/config';

export const BannerContainer = styled(Space).attrs({
  $v: { size: 'm', properties: ['padding-top', 'padding-bottom'] },
  className: font('intr', 5),
})<{ $backgroundColor?: PaletteColor }>`
  background-color: ${props =>
    props.theme.color(props.$backgroundColor || 'yellow')};
`;

export const BannerWrapper = styled(Container)`
  display: flex;
  justify-content: space-between;
`;

export const CopyContainer = styled.div`
  display: flex;
`;

export const Copy = styled(Space).attrs({
  $h: { size: 'm', properties: ['margin-right'] },
  className: 'body-text spaced-text',
})`
  align-self: center;
`;

export const CloseButton = styled.button`
  margin: 0;
  padding: 0;
  color: ${props =>
    props.theme.color('black')}; /* This avoids the default blue links on iOS */
`;
