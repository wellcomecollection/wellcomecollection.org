// @flow
import React from 'react';
import prefixedPropertyStyleObject from '../../../utils/prefixed-property-style-object';

function randomIntFromInterval(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

type Props = {|
  background: string,
  intensity?: number,
  points?: number,
  isValley?: boolean,
  isStatic?: boolean,
  extraClasses?: string
|}

type State = {|
  isActive: boolean,
  styleObject: {}
|}

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
      styleObject: prefixedPropertyStyleObject('clipPath', this.makePolygonPoints(0, 0))
    };
  }

  componentDidMount() {
    if (this.props.isStatic) return;

    window.addEventListener('scroll', () => {
      if (!this.state.isActive) {
        this.setState({
          styleObject: prefixedPropertyStyleObject('clipPath', this.makePolygonPoints(this.points, this.intensity)),
          isActive: true
        });
      }

      if (this.timer) {
        clearTimeout(this.timer);
      }

      this.timer = setTimeout(() => {
        this.setState({
          styleObject: prefixedPropertyStyleObject('clipPath', this.makePolygonPoints(this.points, this.intensity)),
          isActive: false
        });
      }, 150);
    });
  }

  makePolygonPoints(totalPoints: number, intensity: number): string {
    // Determine whether wobbly edge should be a mountain or a valley
    const first = this.props.isValley ? '0% 100%, 0% 0%,' : '0% 100%,';
    const last = this.props.isValley ? ',100% 0%, 100% 100%' : ',100% 100%';
    const innerPoints = [...Array(totalPoints)].reduce((acc, curr, index) => {
      const xMean = 100 / totalPoints * index;
      const xShift = (100 / totalPoints) / 2;
      const x = randomIntFromInterval((xMean - xShift), (xMean + xShift - 1));
      const y = randomIntFromInterval((100 - intensity), 100);

      return acc.concat(`${x}% ${y}%`);
    }, []);

    return `polygon(${first.concat(innerPoints.join(','), last)})`;
  };

  render() {
    // TODO: remove `js-wobbly-edge` and data-attributes once 100% Reactified
    return (
      <div
        className={`wobbly-edge wobbly-edge--${this.props.background} ${this.props.extraClasses ? this.props.extraClasses : ''} js-wobbly-edge`}
        data-max-intensity={this.intensity}
        data-number-of-points={this.points}
        data-is-valley={this.props.isValley}
        style={this.state.styleObject}>
      </div>
    );
  }
}

export default WobblyEdge;
