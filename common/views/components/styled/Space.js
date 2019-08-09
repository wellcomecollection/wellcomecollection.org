// @flow
import styled from 'styled-components';
import type { ComponentType } from 'react';
// This component will output horizontal/vertical space from one of five pre-defined sizes: xs, s, m, l, and xl.
// Each of these sizes has a pixel value for each of the three breakpoints, 'small', 'medium', and 'large'.
// The component can receive `h` and/or `v` props to determine the horizontal/vertical space respectively.

// An example Space component which outputs a small amount of space to the left via padding, and a large amount of
// space top and bottom via margins:

// <Space
//   h={size: 's', properties: ['padding-left'],
//   v={size: 'l', properties: ['margin-top', 'margin-bottom']}}
// />

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

export type SpaceComponentProps = {
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
