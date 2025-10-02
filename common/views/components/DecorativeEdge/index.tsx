// eslint-data-component: intentionally omitted
import { FunctionComponent, ReactElement } from 'react';

import WEdge, { Props as WEdgeProps } from './DecorativeEdge.W';
import WobblyEdge, {
  WobblyBottom,
  Props as WobblyEdgeProps,
} from './DecorativeEdge.Wobbly';

type Props =
  | (WEdgeProps & { variant: 'w' })
  | (WobblyEdgeProps & { variant: 'wobbly' });

const DecorativeEdge: FunctionComponent<Props> = (
  props: Props
): ReactElement => {
  if (props.variant === 'w') return <WEdge color={props.color} />;

  const { variant, ...rest } = props;

  return <WobblyEdge {...rest} />;
};

export default DecorativeEdge;
export { WobblyBottom };
