// eslint-data-component: intentionally omitted
import debounce from 'lodash.debounce';
import {
  FunctionComponent,
  PropsWithChildren,
  ReactElement,
  useEffect,
  useRef,
  useState,
} from 'react';
import styled from 'styled-components';

import { useAppContext } from '@weco/common/contexts/AppContext';
import { prefixedPropertyStyleObject } from '@weco/common/utils/prefixed-property-style-object';
import { Pinnable, PinnableColor } from '@weco/common/views/themes/config';

export const WobblyEdgeWrapper = styled.div`
  position: relative;
`;

// This edge is deliberately random. We don't want Chromatic shout when
// there's inevitably a visual difference between builds.
// https://www.chromatic.com/docs/ignoring-elements#ignore-dom-elements
export const Edge = styled.div.attrs<{ 'data-chromatic'?: 'ignore' }>({
  'data-chromatic': 'ignore',
})<{
  $backgroundColor: PinnableColor;
  $isRotated: boolean;
  $isEnhanced: boolean;
}>`
  height: 10vw;
  margin-top: -10vw;
  position: relative;
  top: 2px;
  z-index: 2;
  transition:
    -webkit-clip-path 2000ms ease-in-out,
    clip-path 2000ms ease-in-out;
  display: none;

  ${props => props.theme.media('md')`
    max-height: 60px;
    margin-top: -60px;
  `}

  ${props =>
    props.$isEnhanced &&
    `
    @supports ((clip-path: polygon(0 0)) or (-webkit-clip-path: polygon(0 0))) {
      display: block;

      @media screen and (prefers-reduced-motion: reduce) {
        display: none;
      }
    }
  `}

  background: ${props => props.theme.color(props.$backgroundColor)};

  ${props =>
    props.$isRotated &&
    `
    transform: rotate(180deg);
    margin-top: 0;
    top: -2px;

    ${props.theme.media('md')`
      margin-top: 0;
      top: -2px;
    `}
  `}
`;

function randomIntFromInterval(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export type Props = {
  backgroundColor: PinnableColor;
  isRotated?: boolean;
  intensity?: number;
  points?: number;
  isValley?: boolean;
  isStatic?: boolean;
  /** A selector for an element (e.g. a sidebar) the edge should be a single,
   * unchanging slope underneath. Its angle is picked once per page load; the
   * rest of the edge still wobbles. */
  fixedUntil?: string;
};

const WobblyEdge: FunctionComponent<Props> = ({
  backgroundColor,
  isRotated,
  intensity = 50,
  points = 5,
  isValley,
  isStatic,
  fixedUntil,
}: Props): ReactElement => {
  const edgeRef = useRef<HTMLDivElement>(null);
  const fixedHeight = useRef(randomIntFromInterval(100 - intensity, 100));
  const [isActive, setIsActive] = useState(false);
  const [styleObject, setStyleObject] = useState(
    prefixedPropertyStyleObject('clipPath', makePolygonPoints(0, 0))
  );
  let timer;
  const { isEnhanced } = useAppContext();

  // Where `fixedUntil`'s right-hand side falls across the edge, as a %
  function getFixedX(): number | undefined {
    const edge = edgeRef.current?.getBoundingClientRect();
    const until =
      fixedUntil && document.querySelector(fixedUntil)?.getBoundingClientRect();
    if (!edge?.width || !until) return undefined;

    return Math.min(
      100,
      Math.max(0, ((until.right - edge.left) / edge.width) * 100)
    );
  }

  function makePolygonPoints(totalPoints: number, intensity: number): string {
    // Determine whether wobbly edge should be a mountain or a valley
    const first = isValley ? '0% 100%, 0% 0%,' : '0% 100%,';
    const last = isValley ? '100% 0%, 100% 100%' : '100% 100%';

    // Keep the edge a single slope up to `fixedUntil`, with the same height
    // every time, and wobble the rest
    const fixedX = totalPoints > 0 ? getFixedX() : undefined;
    const start = fixedX ?? 0;
    const fixedPoint =
      fixedX === undefined
        ? ''
        : `${fixedX.toFixed(2)}% ${fixedHeight.current}%,`;

    const innerPoints = [...Array(totalPoints)].reduce((acc, curr, index) => {
      const xMean = start + ((100 - start) / totalPoints) * index;
      const xShift = (100 - start) / totalPoints / 2;

      if (index === 0) return [];

      const x = randomIntFromInterval(xMean - xShift, xMean + xShift - 1);
      const y = randomIntFromInterval(100 - intensity, 100);

      return acc.concat(`${x}% ${y}%,`);
    }, []);

    return `polygon(${first.concat(fixedPoint, innerPoints.join(''), last)})`;
  }

  function updatePoints() {
    if (!isActive) {
      setStyleObject(
        prefixedPropertyStyleObject(
          'clipPath',
          makePolygonPoints(points, intensity)
        )
      );
      setIsActive(true);
    }

    if (timer) {
      clearTimeout(timer);
    }

    timer = setTimeout(() => {
      setStyleObject(
        prefixedPropertyStyleObject(
          'clipPath',
          makePolygonPoints(points, intensity)
        )
      );
      setIsActive(false);
    }, 150);
  }

  const debounceUpdatePoints = debounce(updatePoints, 500);

  useEffect(() => {
    updatePoints();
    if (!isStatic) {
      window.addEventListener('scroll', debounceUpdatePoints);
    }
    return () => {
      window.removeEventListener('scroll', debounceUpdatePoints);
      clearTimeout(timer);
    };
  }, []);

  // The fixed part needs measuring, which can only happen once the edge is
  // showing, and again if the layout changes
  useEffect(() => {
    if (!fixedUntil || !isEnhanced) return;

    updatePoints();
    window.addEventListener('resize', debounceUpdatePoints);
    return () => window.removeEventListener('resize', debounceUpdatePoints);
  }, [fixedUntil, isEnhanced]);

  return (
    <Edge
      ref={edgeRef}
      $backgroundColor={backgroundColor}
      $isRotated={isRotated || false}
      $isEnhanced={isEnhanced}
      style={styleObject}
    />
  );
};

export const WobblyBottom: FunctionComponent<
  PropsWithChildren<{
    backgroundColor: Pinnable<'warmNeutral.300' | 'white'>;
  }>
> = ({ backgroundColor, children }) => (
  <WobblyEdgeWrapper>
    {children}
    <WobblyEdge backgroundColor={backgroundColor} />
  </WobblyEdgeWrapper>
);

export default WobblyEdge;
