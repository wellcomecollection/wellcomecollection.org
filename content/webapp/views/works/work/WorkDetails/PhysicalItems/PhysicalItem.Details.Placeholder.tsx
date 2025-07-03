import { FunctionComponent, PropsWithChildren } from 'react';
import styled, { keyframes } from 'styled-components';

type Props = {
  isLoading: boolean;
  nRows?: number;
  maxWidth?: string;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getGradient = (theme: any) => {
  const bgColor = theme.colors['neutral.300'];
  const highlightColor = 'rgb(255, 255, 255, 0.6)';

  // We make the background periodic so that it can be animated easily
  return `${bgColor} linear-gradient(to right, ${bgColor}, ${highlightColor} 70%, ${bgColor})`;
};

const backgroundAnimation = keyframes`
  from {
    background-position: 0 0;
  }

  /* This 70% keyframe is so the animation eases quite aggressively */
  70% {
    background-position: -50% 0;
  }

  /* This is a "complete rotation" of the background - ie back to the start */
  to {
    background-position: -200% 0;
  }
`;

const PlaceholderRow = styled.div<{
  $percentWidth: number;
}>`
  background: ${({ theme }) => getGradient(theme)};

  /* This "stretches" the periodic background so we only see half of it */
  background-size: 200%;
  background-repeat: repeat-x;
  animation: ${backgroundAnimation} 1.2s ease-in infinite;
  width: ${({ $percentWidth }) => $percentWidth.toFixed(2)}%;

  /* These should sum to 1.5rem to reflect the usual line-height of inline text */
  height: 1rem;
  margin-top: 0.5rem;
`;

const Wrapper = styled.div<{ $maxWidth: string }>`
  max-width: ${({ $maxWidth }) => $maxWidth};
`;

// We use these static "random" offsets so that the widths don't change throughout re-rendering
const widthOffsets = [0.8, 0.6, 0.3, 0.5, 0.8, 0.5, 0.2, 0.4, 0.3, 0.1];
const randomWidth = ({ min, i }: { min: number; i: number }) =>
  100 - (100 - min) * widthOffsets[i % widthOffsets.length];

const Placeholder: FunctionComponent<PropsWithChildren<Props>> = ({
  children,
  isLoading,
  maxWidth,
  nRows,
}) => {
  if (isLoading) {
    return (
      <Wrapper $maxWidth={maxWidth || '100%'}>
        {Array.from({ length: nRows || 1 }).map((_, i) => (
          <PlaceholderRow
            key={`row-${i}`}
            $percentWidth={randomWidth({ min: 95, i })}
          />
        ))}
      </Wrapper>
    );
  }

  // Typescript wants this wrapped in a fragment
  return <>{children}</>;
};

export default Placeholder;
