import styled from 'styled-components';

const Rotator = styled.div<{ $rotate: number }>`
  transform: rotate(${props => props.$rotate}deg);
`;

export default Rotator;
