import styled from 'styled-components';
import { respondTo } from '../../themes/mixins';
import { themeValues } from '../../themes/config';

const CssGridContainer = styled.div`
  @supports (display: grid) {
    display: grid;
    grid-auto-rows: minmax(min-content, max-content);

    ${Object.entries(themeValues.grid)
      .map(([_, { respond, padding }]) => {
        const columns = `[full-start] minmax(${padding}px, 1fr) [main-start] minmax(0, ${themeValues
          .sizes.xlarge -
          padding * 2}px) [main-end] minmax(${padding}px, 1fr) [full-end]`;

        return respondTo(respond[0], `grid-template-columns: ${columns}`);
      })
      .join(' ')}
  }
`;

export default CssGridContainer;
