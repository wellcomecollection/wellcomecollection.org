// @flow
type Props = {|
  background: string,
  intensity?: number,
  points?: number,
  isValley?: boolean
|}

const WobblyEdge = ({ intensity, points, background, isValley }: Props) => (
  <div
    className={`wobbly-edge wobbly-edge--${background} js-wobbly-edge`}
    data-max-intensity={intensity}
    data-number-of-points={points}
    data-is-valley={isValley}>
  </div>
);

export default WobblyEdge;
