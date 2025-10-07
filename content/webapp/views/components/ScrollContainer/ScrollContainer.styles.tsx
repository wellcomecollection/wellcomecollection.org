import styled from 'styled-components';

const ScrollShim = styled.li<{ $gridValues: number[] }>`
  display: none;

  --container-padding: ${props => props.theme.containerPadding.small}px;
  --number-of-columns: ${props => (12 - props.$gridValues[0]) / 2};
  --gap-value: ${props => props.theme.gutter.small}px;
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
    props.theme.media('medium')(`
      display: block;
      --container-padding: ${props.theme.containerPadding.medium}px;
      --number-of-columns: ${(12 - props.$gridValues[1]) / 2};
      --gap-value: ${props.theme.gutter.medium}px;
  `)}

  ${props =>
    props.theme.media('large')(`
      --container-padding: ${props.theme.containerPadding.large}px;
      --number-of-columns: ${(12 - props.$gridValues[2]) / 2};
      --gap-value: ${props.theme.gutter.large}px;
  `)}

  ${props =>
    props.theme.media('xlarge')(`
      --container-padding: ${props.theme.containerPadding.xlarge}px;
      --container-width: calc(${props.theme.sizes.xlarge}px - (var(--container-padding) * 2));
      --left-margin-width: calc((100% - ${props.theme.sizes.xlarge}px) / 2);
      --number-of-columns: ${(12 - props.$gridValues[3]) / 2};
      --gap-value: ${props.theme.gutter.xlarge}px;

      min-width: calc(
        var(--left-margin-width) + var(--container-padding) +
          (
            var(--number-of-columns) *
              ((var(--container-width-without-gaps) / 12) + var(--gap-value))
          )
      );
  `)}
`;

export default ScrollShim;
