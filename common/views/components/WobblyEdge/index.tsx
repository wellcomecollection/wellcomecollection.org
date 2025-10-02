// eslint-data-component: intentionally omitted
import { FunctionComponent, ReactElement } from 'react';

import {
  WobblyEdgeDefault,
  Props as WobblyEdgeProps,
} from './WobblyEdge.default';
import WEdge, { Props as WEdgeProps } from './WobblyEdge.W';

type Props =
  | (WEdgeProps & { variant: 'w' })
  | (WobblyEdgeProps & { variant?: 'default' });

export const WobblyEdge: FunctionComponent<Props> = (
  props: Props
): ReactElement => {
  if (props.variant === 'w') {
    return <WEdge color={props.color} />;
  } else {
    const { variant, ...rest } = props;

    return <WobblyEdgeDefault {...rest} />;
  }
};
