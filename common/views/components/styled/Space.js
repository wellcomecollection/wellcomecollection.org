// @flow
import styled from 'styled-components';
import type { ComponentType } from 'react';
// This component will output vertical space from one of five pre-defined sizes: xs, s, m, l, and xl.
// Each of these sizes has a pixel value for each of the three breakpoints, 'small', 'medium', and 'large'.
// The component expects a `size` prop, and by default will use `margin-bottom` to add space.
// This can be overriden to include one or more of `margin-top`, `margin-bottom`, `padding-top`, `padding-bottom`, `top`, and `bottom`.

// <Space size='s' /> -- outputs a small amount of (default) margin-bottom
// <Space size='xl' properties=`{['padding-top', 'padding-bottom']}` /> -- outputs extra-large padding-top and padding-bottom

type SpaceSize = 'xs' | 's' | 'm' | 'l' | 'xl';
type VerticalSpaceProperty =
  | 'margin-top'
  | 'margin-bottom'
  | 'padding-top'
  | 'padding-bottom'
  | 'top'
  | 'bottom';

type HorizontalSpaceProperty =
  | 'margin-left'
  | 'margin-right'
  | 'padding-left'
  | 'padding-right'
  | 'left'
  | 'right';

type VerticalSpaceProps = {|
  size: SpaceSize,
  properties: VerticalSpaceProperty[],
  negative?: boolean,
|};

type HorizontalSpaceProps = {|
  size: SpaceSize,
  properties: HorizontalSpaceProperty[],
  negative?: boolean,
|};

type SpaceComponentProps = {
  v?: VerticalSpaceProps,
  h?: HorizontalSpaceProps,
};

const Space: ComponentType<SpaceComponentProps> = styled.div`
  ${props =>
    props.v &&
    props.theme.makeSpacePropertyValues(
      props.v.size,
      props.v.properties,
      props.v.negative
    )}
  ${props =>
    props.h &&
    props.theme.makeSpacePropertyValues(
      props.h.size,
      props.h.properties,
      props.h.negative
    )}
`;

export default Space;
