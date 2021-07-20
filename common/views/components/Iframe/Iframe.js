// @flow
import { Component, Fragment, createRef } from 'react';
import { trackEvent } from '../../../utils/ga';
import { UiImage } from '../Images/Images';
// $FlowFixMe (tsx)
import Control from '../Buttons/Control/Control';
// $FlowFixMe (tsx)
import ButtonSolid from '../ButtonSolid/ButtonSolid';
import type { ImageType } from '../../../model/image';
import styled from 'styled-components';

export const IframeContainer = styled.div`
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

type Props = {|
  image: ImageType,
  src: string,
|};

type State = {|
  iframeShowing: boolean,
|};

class Iframe extends Component<Props, State> {
  state = {
    iframeShowing: false,
  };

  iframeRef: { current: HTMLIFrameElement | null } = createRef();

  toggleIframeDisplay = () => {
    if (!this.state.iframeShowing) {
      trackEvent({
        category: 'Iframe',
        action: 'launch iframe',
        label: this.props.src,
      });
    }
    this.setState(prevState => ({
      iframeShowing: !prevState.iframeShowing,
    }));
  };

  render() {
    const { image, src } = this.props;
    const imageObject = {
      ...image,
      sizesQueries:
        '(min-width: 1420px) 1010px, (min-width: 600px) 73vw, calc(100vw - 36px)',
    };

    return (
      <IframeContainer>
        {image.contentUrl && (
          <Fragment>
            {!this.state.iframeShowing && (
              <span
                className="trigger plain-button no-padding no-visible-focus"
                onClick={this.toggleIframeDisplay}
              >
                <span className="overlay" />
                <span className="launch">
                  <ButtonSolid text="Launch" ariaLive="polite" />
                </span>
              </span>
            )}
            <UiImage {...imageObject} />
            {this.state.iframeShowing && (
              <Control
                colorScheme="light"
                text="Close"
                icon="cross"
                clickHandler={this.toggleIframeDisplay}
                extraClasses={'close'}
              />
            )}
          </Fragment>
        )}
        {this.state.iframeShowing && (
          <iframe
            className="iframe"
            ref={this.iframeRef}
            src={src}
            frameBorder="0"
            scrolling="no"
            allowvr="true"
            allowFullScreen
            mozallowfullscreen="true"
            webkitallowfullscreen="true"
            onmousewheel="true"
          />
        )}
      </IframeContainer>
    );
  }
}

export default Iframe;
