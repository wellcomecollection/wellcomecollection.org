// @flow
import fetch from 'isomorphic-unfetch';
import openseadragon from 'openseadragon';
import { useState, useEffect } from 'react';
import styled from 'styled-components';

const ZoomedImageContainer = styled.div`
  width: 100vw;
  height: 100vh;
  position: fixed;
  padding: 48px 0 6px;
  top: 0;
  left: 0;
  z-index: 2;
  background: ${props => props.theme.colors.yellow};
`;

const Image = styled.div`
  height: 100%;
`;

function setupViewer(imageInfoSrc, viewerId, handleScriptError) {
  fetch(imageInfoSrc)
    .then(response => response.json())
    .then(response => {
      openseadragon({
        id: `image-viewer-${viewerId}`,
        visibilityRatio: 1,
        showFullPageControl: false,
        showHomeControl: false,
        zoomInButton: `zoom-in-${viewerId}`,
        zoomOutButton: `zoom-out-${viewerId}`,
        showNavigator: true,
        controlsFadeDelay: 0,
        animationTime: 0.5,
        tileSources: [
          {
            '@context': 'http://iiif.io/api/image/2/context.json',
            '@id': response['@id'],
            height: response.height,
            width: response.width,
            profile: ['http://iiif.io/api/image/2/level2.json'],
            protocol: 'http://iiif.io/api/image',
            tiles: [
              {
                scaleFactors: [1, 2, 4, 8, 16, 32],
                width: 400,
              },
            ],
          },
        ],
      });
    })
    .catch(_ => {
      handleScriptError();
    });
}

const ErrorMessage = () => (
  <div>
    <p>The image viewer is not working.</p>
  </div>
);

type Props = {|
  id: string,
  infoUrl: string,
|};

const ZoomedImage = ({ id, infoUrl }: Props) => {
  const [scriptError, setScriptError] = useState(false);
  const handleScriptError = () => {
    setScriptError(true);
  };

  useEffect(() => {
    setupViewer(infoUrl, id, handleScriptError);
  }, []);

  return (
    <ZoomedImageContainer>
      <Image id={`image-viewer-${id}`}>{scriptError && <ErrorMessage />}</Image>
    </ZoomedImageContainer>
  );
};

export default ZoomedImage;
