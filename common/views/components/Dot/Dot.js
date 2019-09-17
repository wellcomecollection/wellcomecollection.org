// @flow

type Props = {|
  color: string,
|};

function Dot({ color }: Props) {
  return (
    <span className={`font-${color}`} style={{ fontSize: '0.7em' }}>
      &#11044;
    </span>
  );
}

export default Dot;
