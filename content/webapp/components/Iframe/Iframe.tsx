import { Component, Fragment, createRef } from 'react';
import { trackEvent } from '@weco/common/utils/ga';
import PrismicImage from '../PrismicImage/PrismicImage';
import Control from '@weco/common/views/components/Buttons/Control/Control';
import ButtonSolid from '@weco/common/views/components/ButtonSolid/ButtonSolid';
import IframeContainer from '@weco/common/views/components/IframeContainer/IframeContainer';
import { cross } from '@weco/common/icons';
import { ImageType } from '@weco/common/model/image';

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
            <PrismicImage
              image={imageObject}
              sizes={{
                xlarge: 1,
                large: 1,
                medium: 1,
                small: 1,
              }}
              quality={100}
            />
            {this.state.iframeShowing && (
              <Control
                colorScheme="light"
                text="Close"
                icon={cross}
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
            allow="fullscreen; xr-spatial-tracking"
          />
        )}
      </IframeContainer>
    );
  }
}

export default Iframe;
