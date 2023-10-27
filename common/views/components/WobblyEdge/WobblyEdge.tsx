import {
  FunctionComponent,
  ReactElement,
  useState,
  useEffect,
  useContext,
} from 'react';
import { AppContext } from '@weco/common/views/components/AppContext/AppContext';
import debounce from 'lodash.debounce';
import { prefixedPropertyStyleObject } from '@weco/common/utils/prefixed-property-style-object';
import styled from 'styled-components';
import { PaletteColor } from '@weco/common/views/themes/config';

// This edge is deliberately random. We don't want Chromatic shout when
// there's inevitably a visual difference between builds.
// https://www.chromatic.com/docs/ignoring-elements#ignore-dom-elements
const Edge = styled.div.attrs<{ 'data-chromatic'?: 'ignore' }>({
  'data-chromatic': 'ignore',
})<{
  $backgroundColor: PaletteColor;
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

  ${props => props.theme.media('large')`
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

    ${props.theme.media('large')`
      margin-top: 0;
      top: -2px;
    `}
  `}
`;

function randomIntFromInterval(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

type Props = {
  backgroundColor: PaletteColor;
  isRotated?: boolean;
  intensity?: number;
  points?: number;
  isValley?: boolean;
  isStatic?: boolean;
};

const WobblyEdge: FunctionComponent<Props> = ({
  backgroundColor,
  isRotated,
  intensity = 50,
  points = 5,
  isValley,
  isStatic,
}: Props): ReactElement => {
  const [isActive, setIsActive] = useState(false);
  const [styleObject, setStyleObject] = useState(
    prefixedPropertyStyleObject('clipPath', makePolygonPoints(0, 0))
  );
  let timer;
  const { isEnhanced } = useContext(AppContext);

  function makePolygonPoints(totalPoints: number, intensity: number): string {
    // Determine whether wobbly edge should be a mountain or a valley
    const first = isValley ? '0% 100%, 0% 0%,' : '0% 100%,';
    const last = isValley ? '100% 0%, 100% 100%' : '100% 100%';
    const innerPoints = [...Array(totalPoints)].reduce((acc, curr, index) => {
      const xMean = (100 / totalPoints) * index;
      const xShift = 100 / totalPoints / 2;

      if (index === 0) return [];

      const x = randomIntFromInterval(xMean - xShift, xMean + xShift - 1);
      const y = randomIntFromInterval(100 - intensity, 100);

      return acc.concat(`${x}% ${y}%,`);
    }, []);

    return `polygon(${first.concat(innerPoints.join(''), last)})`;
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

  return (
    <Edge
      $backgroundColor={backgroundColor}
      $isRotated={isRotated || false}
      $isEnhanced={isEnhanced}
      style={styleObject}
    />
  );
};

export default WobblyEdge;
