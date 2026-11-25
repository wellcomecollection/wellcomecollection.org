import styled from 'styled-components';

/**
 * A span that puts a "|" before itself, unless it's the first of its siblings.
 */
const PipeSeparated = styled.span`
  &:not(:first-child)::before {
    content: ' | ';
    margin: 0 4px;
  }
`;

export default PipeSeparated;
