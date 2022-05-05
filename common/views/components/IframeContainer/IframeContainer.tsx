import styled from 'styled-components';
const IframeContainer = styled.div`
  padding-bottom: 56.25%; /* 16:9 */
  height: 0;
  position: relative;

  .overlay {
    position: absolute;
    display: none;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.2);
    z-index: 1;
    transition: background 600ms ease;

    .enhanced & {
      display: block;
    }
  }

  .trigger {
    position: absolute;
    z-index: 2;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;

    &:hover,
    &:focus {
      .overlay {
        background: ${props => props.theme.color('transparent')};
      }
    }

    .enhanced & {
      cursor: pointer;
    }
  }

  .launch {
    position: absolute;
    display: none;
    z-index: 1;
    top: 50%;
    left: 50%;
    transform: translateY(-50%) translateX(-50%);

    .enhanced & {
      display: block;
    }
  }

  .close {
    position: absolute;
    top: 12px;
    right: 12px;
    z-index: 2;
  }

  .iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
`;

export default IframeContainer;
