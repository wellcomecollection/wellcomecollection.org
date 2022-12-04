import { FunctionComponent, useState } from 'react';
import Caption from '../Caption/Caption';
import { IframeContainer } from '../Iframe/Iframe';
import * as prismicT from '@prismicio/types';
import styled from 'styled-components';

export type Props = {
  embedUrl: string;
  caption?: prismicT.RichTextField;
};

// In order to have a red button with a white triangle, we can't reuse the
// YouTube icon we have in the icon set, so keeping this player button as its
// own svg in this file.
const YouTubePlay = () => (
  <svg height="100%" version="1.1" viewBox="0 0 68 48" width="100%">
    <path
      d="M66.52,7.74c-0.78-2.93-2.49-5.41-5.42-6.19C55.79,.13,34,0,34,0S12.21,.13,6.9,1.55 C3.97,2.33,2.27,4.81,1.48,7.74C0.06,13.05,0,24,0,24s0.06,10.95,1.48,16.26c0.78,2.93,2.49,5.41,5.42,6.19 C12.21,47.87,34,48,34,48s21.79-0.13,27.1-1.55c2.93-0.78,4.64-3.26,5.42-6.19C67.94,34.95,68,24,68,24S67.94,13.05,66.52,7.74z"
      fill="#f00"
    ></path>
    <path d="M 45,24 27,14 27,34" fill="#fff"></path>
  </svg>
);

const VideoTrigger = styled.button.attrs({
  className: 'plain-button',
})`
  cursor: pointer;
  position: absolute;
  padding-bottom: 56.25%; /* 16:9 */
  width: 100%;

  img {
    width: 100%;
    top: -16.84%;
    left: 0;
    position: absolute;
  }

  svg {
    position: absolute;
    width: 68px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 1;
  }
`;

const VideoEmbed: FunctionComponent<Props> = ({ embedUrl, caption }: Props) => {
  const [isActive, setIsActive] = useState(false);
  const id = embedUrl.match(/embed\/(.*)\?/)?.[1];

  return (
    <figure className="no-margin">
      <IframeContainer>
        {isActive ? (
          <iframe
            className="iframe"
            title="Video"
            allowFullScreen={true}
            allow="autoplay; picture-in-picture"
            src={`${embedUrl}&enablejsapi=1&autoplay=1`}
            frameBorder="0"
          />
        ) : (
          <VideoTrigger onClick={() => setIsActive(true)}>
            <span className="visually-hidden">Play video</span>
            <YouTubePlay />
            <img
              src={`https://img.youtube.com/vi/${id}/hqdefault.jpg`}
              alt=""
            />
          </VideoTrigger>
        )}
      </IframeContainer>

      {caption && <Caption caption={caption} />}
    </figure>
  );
};

export default VideoEmbed;
