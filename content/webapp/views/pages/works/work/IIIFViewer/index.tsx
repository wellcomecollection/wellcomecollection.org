import styled, { keyframes } from 'styled-components';

import IIIFViewer from './IIIFViewer';

const show = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

// Certain parts of the viewer will display before the enhanced versions take their place.
// This is necessary for them to be available to visitors without javascript,
// but would normally result in a large and noticeable change to the page which is jarring.
// In order to prevent that, we wrap those elements in a DelayVisibility styled component.
// This delays the visibility of them long enough
// that the enhanced versions will usually have replaced them, if javascript is available, and so they will never be seen.
// The trade off is that if javascript isn't available there will be a slight delay before seeing all the parts of the viewer.
export const DelayVisibility = styled.div`
  opacity: 0;
  animation: 0.2s ${show} 1.5s forwards;
  height: 100%;
  min-width: 0;
`;

export default IIIFViewer;
