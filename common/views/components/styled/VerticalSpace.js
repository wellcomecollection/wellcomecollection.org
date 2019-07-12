import styled from 'styled-components';

const VerticalSpace = styled.div`
  ${props => props.theme.makeSpacePropertyValues(props.size, props.property)}
`;

export default VerticalSpace;
