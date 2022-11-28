import { Component, Fragment, createRef, ReactElement } from 'react';
import { trackEvent } from '@weco/common/utils/ga';
import PrismicImage from '../PrismicImage/PrismicImage';
import Control from '@weco/common/views/components/Buttons/Control/Control';
import ButtonSolid from '@weco/common/views/components/ButtonSolid/ButtonSolid';
import { cross } from '@weco/common/icons';
import { ImageType } from '@weco/common/model/image';
import styled from 'styled-components';

export const IframeContainer = styled.div.attrs({
  'data-chromatic': 'ignore',
})`
  padding-bottom: 56.25%; /* 16:9 */
  height: 0;
  position: relative;
  overflow: hidden;

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
        background: transparent;
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

export type Props = {
  image: ImageType;
  src: string;
};

type State = {
  iframeShowing: boolean;
};

class Iframe extends Component<Props, State> {
  state = {
    iframeShowing: false,
  };

  iframeRef: { current: HTMLIFrameElement | null } = createRef();

  toggleIframeDisplay = (): void => {
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

  render(): ReactElement {
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
            <PrismicImage
              image={imageObject}
              sizes={{
                xlarge: 1 / 2,
                large: 1 / 2,
                medium: 1,
                small: 1,
              }}
              quality="low"
            />
            {this.state.iframeShowing && (
              <Control
                colorScheme="light"
                text="Close"
                icon={cross}
                clickHandler={this.toggleIframeDisplay}
                extraClasses="close"
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
            allow="fullscreen; xr-spatial-tracking"
          />
        )}
      </IframeContainer>
    );
  }
}

export default Iframe;
