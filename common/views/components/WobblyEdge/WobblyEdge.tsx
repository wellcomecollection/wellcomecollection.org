import React from 'react';
import debounce from 'lodash.debounce';
import prefixedPropertyStyleObject from '../../../utils/prefixed-property-style-object';
import styled from 'styled-components';

const Edge = styled.div<{
  background: string;
  isRotated: boolean;
}>`
  height: 10vw;
  margin-top: -10vw;
  position: relative;
  top: 2px;
  z-index: 2;
  transition: -webkit-clip-path 2000ms ease-in-out, clip-path 2000ms ease-in-out;
  display: none;

  @media (min-width: ${props => props.theme.sizes.large}px) {
    max-height: 60px;
    margin-top: -60px;
  }

  @supports ((clip-path: polygon(0 0)) or (-webkit-clip-path: polygon(0 0))) {
    .enhanced & {
      display: block;

      @media screen and (prefers-reduced-motion: reduce) {
        display: none;
      }
    }
  }

  background: ${props => props.theme.color(props.background)};

  ${props =>
    props.isRotated &&
    `
    transform: rotate(180deg);
    margin-top: 0;
    top: -2px;
  `}
`;

function randomIntFromInterval(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

type Props = {
  background: string;
  isRotated?: boolean;
  intensity?: number;
  points?: number;
  isValley?: boolean;
  isStatic?: boolean;
  extraClasses?: string;
};

type State = {
  isActive: boolean;
  styleObject: Record<string, unknown>;
};

class WobblyEdge extends React.Component<Props, State> {
  timer: any;
  intensity: number;
  points: number;

  constructor(props: Props) {
    super(props);
    this.intensity = props.intensity || 50;
    this.points = props.points || 5;
    this.timer = null;
    this.state = {
      isActive: false,
      styleObject: prefixedPropertyStyleObject(
        'clipPath',
        this.makePolygonPoints(0, 0)
      ),
    };
  }

  updatePoints = () => {
    if (!this.state.isActive) {
      this.setState({
        styleObject: prefixedPropertyStyleObject(
          'clipPath',
          this.makePolygonPoints(this.points, this.intensity)
        ),
        isActive: true,
      });
    }

    if (this.timer) {
      clearTimeout(this.timer);
    }

    this.timer = setTimeout(() => {
      this.setState({
        styleObject: prefixedPropertyStyleObject(
          'clipPath',
          this.makePolygonPoints(this.points, this.intensity)
        ),
        isActive: false,
      });
    }, 150);
  };

  debounceUpdatePoints = debounce(this.updatePoints, 500);

  componentDidMount() {
    this.updatePoints();

    if (this.props.isStatic) return;

    window.addEventListener('scroll', this.debounceUpdatePoints);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.debounceUpdatePoints);

    clearTimeout(this.timer);
  }

  makePolygonPoints(totalPoints: number, intensity: number): string {
    // Determine whether wobbly edge should be a mountain or a valley
    const first = this.props.isValley ? '0% 100%, 0% 0%,' : '0% 100%,';
    const last = this.props.isValley ? ',100% 0%, 100% 100%' : ',100% 100%';
    const innerPoints = [...Array(totalPoints)].reduce((acc, curr, index) => {
      const xMean = (100 / totalPoints) * index;
      const xShift = 100 / totalPoints / 2;

      if (index === 0) return [];

      const x = randomIntFromInterval(xMean - xShift, xMean + xShift - 1);
      const y = randomIntFromInterval(100 - intensity, 100);

      return acc.concat(`${x}% ${y}%`);
    }, []);

    return `polygon(${first.concat(innerPoints.join(','), last)})`;
  }

  render() {
    return (
      <Edge
        background={this.props.background}
        isRotated={this.props.isRotated || false}
        style={this.state.styleObject}
      />
    );
  }
}

export default WobblyEdge;
