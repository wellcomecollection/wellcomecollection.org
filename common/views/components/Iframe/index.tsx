import { Component, createRef, ReactElement } from 'react';
import styled from 'styled-components';

import { cross } from '@weco/common/icons';
import { ImageType } from '@weco/common/model/image';
import Button from '@weco/common/views/components/Buttons';
import Control from '@weco/common/views/components/Control';
import PrismicImage from '@weco/common/views/components/PrismicImage';

export const IframeContainer = styled.div.attrs<{
  'data-chromatic'?: 'ignore';
}>({
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
    background: rgb(0, 0, 0, 0.2);
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

    &:hover {
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

const ButtonWrapper = styled.span.attrs({
  className: 'trigger',
})`
  padding: 0;
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
      <IframeContainer data-component="iframe">
        {image.contentUrl && (
          <>
            {!this.state.iframeShowing && (
              <ButtonWrapper onClick={this.toggleIframeDisplay}>
                <span className="overlay" />
                <span className="launch">
                  <Button
                    variant="ButtonSolid"
                    text="Launch"
                    ariaLive="polite"
                  />
                </span>
              </ButtonWrapper>
            )}
            <PrismicImage
              image={imageObject}
              sizes={{
                lg: 1 / 2,
                md: 1 / 2,
                sm: 1,
                zero: 1,
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
          </>
        )}
        {this.state.iframeShowing && (
          <iframe
            className="iframe"
            aria-hidden="true"
            ref={this.iframeRef}
            src={src}
            style={{ border: 0 }}
            allow="fullscreen; xr-spatial-tracking"
          />
        )}
      </IframeContainer>
    );
  }
}

export default Iframe;
