import { FunctionComponent } from 'react';
import styled, { keyframes } from 'styled-components';

type Props = {
  isLoading: boolean;
  nRows?: number;
  lineSpacing?: number;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getGradient = (theme: any) => {
  const bgColor = theme.colors.smoke.base;
  const highlightColor = 'rgba(255, 255, 255, 0.6)';
  return `${bgColor} linear-gradient(to right, ${bgColor}, ${highlightColor} 70%, ${bgColor})`;
};

const backgroundAnimation = keyframes`
  from {
    background-position: 0 0;
  }

  70% {
    background-position: -50%;
  }

  to {
    background-position: -200% 0;
  }
`;

const PlaceholderRow = styled.div<{
  lineSpacing: number;
  percentWidth: number;
  isFirst: boolean;
}>`
  background: ${({ theme }) => getGradient(theme)};
  background-size: 200%;
  background-repeat: repeat-x;
  animation: ${backgroundAnimation} 1.5s ease-in infinite;
  width: ${({ percentWidth }) => percentWidth.toFixed(2)}%;
  height: 1rem;
  margin-top: ${({ lineSpacing, isFirst }) => (isFirst ? 0 : lineSpacing)}rem;
`;

const randomWidth = ({ min }: { min: number }) =>
  100 - (100 - min) * Math.random();

const Placeholder: FunctionComponent<Props> = ({
  children,
  isLoading,
  nRows,
  lineSpacing,
}) => {
  if (isLoading) {
    return (
      <>
        {Array.from({ length: nRows || 1 }).map((_, i) => (
          <PlaceholderRow
            key={`row-${i}`}
            lineSpacing={lineSpacing ?? 0.5}
            isFirst={i === 0}
            percentWidth={randomWidth({ min: 95 })}
          />
        ))}
      </>
    );
  }

  // Typescript wants this wrapped in a fragment
  return <>{children}</>;
};

export default Placeholder;
