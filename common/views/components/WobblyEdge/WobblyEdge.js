// @flow
type Props = {|
  background: string,
  intensity?: number,
  points?: number
|}

const WobblyEdge = ({ intensity, points, background }: Props) => (
  <div
    className={`wobbly-edge wobbly-edge--${background} js-wobbly-edge`}
    data-max-intensity={intensity}
    data-number-of-points={points}>
  </div>
);

export default WobblyEdge;
