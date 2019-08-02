// @flow
import styled from 'styled-components';

// This component will output vertical space from one of five pre-defined sizes: xs, s, m, l, and xl.
// Each of these sizes has a pixel value for each of the three breakpoints, 'small', 'medium', and 'large'.
// The component expects a `size` prop, and by default will use `margin-bottom` to add space.
// This can be overriden to include one or more of `margin-top`, `margin-bottom`, `padding-top`, `padding-bottom`, `top`, and `bottom`.

// <VerticalSpace size='s' /> -- outputs a small amount of (default) margin-bottom
// <VerticalSpace size='xl' properties=`{['padding-top', 'padding-bottom']}` /> -- outputs extra-large padding-top and padding-bottom

const VerticalSpace = styled.div`
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

export default VerticalSpace;
