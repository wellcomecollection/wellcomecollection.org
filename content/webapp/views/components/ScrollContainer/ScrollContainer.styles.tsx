import styled from 'styled-components';

import { font } from '@weco/common/utils/classnames';
import PlainList from '@weco/common/views/components/styled/PlainList';
import Space from '@weco/common/views/components/styled/Space';

export const ScrollButtonsContainer = styled(Space)<{
  $hasContent?: boolean;
  $scrollButtonsAfter?: boolean;
}>`
  display: flex;
  justify-content: ${props =>
    props.$hasContent ? 'space-between' : 'flex-end'};
  gap: ${props => props.theme.spacingUnits['100']};
  align-items: center;
  ${props =>
    props.$scrollButtonsAfter
      ? 'margin-top: ' + props.theme.spacingUnits['150'] + ';'
      : ''}
`;

export const DetailsCopy = styled.span.attrs({
  className: font('sans', -2),
})<{ $hasDarkBackground?: boolean }>`
  color: ${props =>
    props.theme.color(props.$hasDarkBackground ? 'neutral.400' : 'black')};
`;

export const Description = styled.p<{ $hasDarkBackground?: boolean }>`
  color: ${props =>
    props.theme.color(props.$hasDarkBackground ? 'neutral.400' : 'black')};
  margin-bottom: 0;
`;

export const ContentContainer = styled(PlainList)`
  display: flex;
  overflow: hidden;
  position: relative;
  padding: 3px 0;
`;

export const ScrollShim = styled.li<{ $gridValues: number[] }>`
  display: none;

  --container-padding: ${props => props.theme.containerPadding};
  --number-of-columns: ${props => (12 - props.$gridValues[0]) / 2};
  --gap-value: ${props => props.theme.gutter.small};
  --container-width: calc(100% - (var(--container-padding) * 2));
  --container-width-without-gaps: calc(
    (var(--container-width) - (var(--gap-value) * 11))
  );
  min-width: calc(
    var(--container-padding) +
      (
        var(--number-of-columns) *
          ((var(--container-width-without-gaps) / 12) + var(--gap-value))
      )
  );

  ${props =>
    props.theme.media('sm')(`
      display: block;
      --number-of-columns: ${(12 - props.$gridValues[1]) / 2};
      --gap-value: ${props.theme.gutter.medium};
  `)}

  ${props =>
    props.theme.media('md')(`
      --number-of-columns: ${(12 - props.$gridValues[2]) / 2};
      --gap-value: ${props.theme.gutter.large};
  `)}

  ${props =>
    props.theme.media('lg')(`
      --container-width: calc(${props.theme.sizes.lg} - (var(--container-padding) * 2));
      --left-margin-width: calc((100% - ${props.theme.sizes.lg}) / 2);
      --number-of-columns: ${(12 - props.$gridValues[3]) / 2};
      --gap-value: ${props.theme.gutter.xlarge};

      min-width: calc(
        var(--left-margin-width) + var(--container-padding) +
          (
            var(--number-of-columns) *
              ((var(--container-width-without-gaps) / 12) + var(--gap-value))
          )
      );
  `)}
`;
