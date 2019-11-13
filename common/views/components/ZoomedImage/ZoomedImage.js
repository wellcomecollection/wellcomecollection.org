// @flow
import fetch from 'isomorphic-unfetch';
import openseadragon from 'openseadragon';
import { useState, useEffect } from 'react';
import styled from 'styled-components';

const ZoomedImageContainer = styled.div`
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 10000;
  background: ${props => props.theme.colors.yellow};
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
|};

const ZoomedImage = ({ id }: Props) => {
  const [scriptError, setScriptError] = useState(false);
  const infoUrl =
    'https://dlcs.io/iiif-img/wellcome/5/b28109934_0010.jp2/info.json'; // TODO get this properly

  const handleScriptError = () => {
    setScriptError(true);
  };

  useEffect(() => {
    setupViewer(infoUrl, id, handleScriptError);
  }, []);

  return (
    <ZoomedImageContainer id={`image-viewer-${id}`}>
      {scriptError && <ErrorMessage />}
    </ZoomedImageContainer>
  );
};

export default ZoomedImage;

// TODO do the position fixed thing first
