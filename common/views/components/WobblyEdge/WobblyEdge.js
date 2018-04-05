// @flow
import React from 'react';

// TODO: this could/should probably be abstracted
function setPropertyPrefixed(property, value) {
  const cappedProperty = property[0].toUpperCase() + property.substring(1);

  return {
    [`Webkit${cappedProperty}`]: value,
    [`moz${property}`]: value,
    [`ms${cappedProperty}`]: value,
    [`o${cappedProperty}`]: value,
    [property]: value
  };
}

function randomIntFromInterval(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

type Props = {|
  background: string,
  intensity?: number,
  points?: number,
  isValley?: boolean,
  isStatic?: boolean
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
      styleObject: setPropertyPrefixed('clipPath', this.makePolygonPoints(0, 0))
    };
  }

  componentDidMount() {
    if (this.props.isStatic) return;

    window.addEventListener('scroll', () => {
      if (!this.state.isActive) {
        this.setState({
          styleObject: setPropertyPrefixed('clipPath', this.makePolygonPoints(this.points, this.intensity)),
          isActive: true
        });
      }

      if (this.timer) {
        clearTimeout(this.timer);
      }

      this.timer = setTimeout(() => {
        this.setState({
          styleObject: setPropertyPrefixed('clipPath', this.makePolygonPoints(this.points, this.intensity)),
          isActive: false
        });
      }, 150);
    });
  }

  makePolygonPoints(totalPoints: number, intensity: number): string {
    // Determine whether wobbly edge should be a mountain or a valley
    const first = this.props.isValley ? '0% 100%, 0% 0%,' : '0% 100%,';
    const last = this.props.isValley ? ',100% 0%, 100% 100%' : ',100% 100%';
    const innerPoints = [];

    for (let i = 1; i < totalPoints; i++) {
      const xMean = 100 / totalPoints * i;
      const xShift = (100 / totalPoints) / 2;
      const x = randomIntFromInterval((xMean - xShift), (xMean + xShift - 1));
      const y = randomIntFromInterval((100 - intensity), 100);
      innerPoints.push(`${x}% ${y}%`);
    }

    return `polygon(${first.concat(innerPoints.join(','), last)})`;
  };

  render() {
    return (
      <div
        className={`wobbly-edge wobbly-edge--${this.props.background}`}
        data-max-intensity={this.intensity}
        data-number-of-points={this.points}
        data-is-valley={this.props.isValley}
        style={this.state.styleObject}>
      </div>
    );
  }
}

export default WobblyEdge;
