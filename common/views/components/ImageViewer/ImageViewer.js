// @flow
import { useState, useEffect } from 'react';
// import Router from 'next/router';
import dynamic from 'next/dynamic';
import styled from 'styled-components';
import { type IIIFUriProps } from '@weco/common/utils/convert-image-uri';
import IIIFResponsiveImage from '../IIIFResponsiveImage/IIIFResponsiveImage';
import LL from '../styled/LL';
import { imageSizes } from '../../../utils/image-sizes';

const LoadingComponent = () => (
  <div
    style={{
      position: 'absolute',
      width: '100%',
      height: '100%',
      zIndex: '1000',
    }}
  >
    <LL />
  </div>
);

const ZoomedImage = dynamic(() => import('../ZoomedImage/ZoomedImage'), {
  ssr: false,
  loading: LoadingComponent,
});

const ImageWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  padding: 0;
  transition: opacity 1000ms ease;
  opacity: ${props => (props.imageLoading ? 0 : 1)};
  & img {
    margin: 0 auto;
    display: block;
    width: auto;
    height: auto;
    max-width: 100%;
    max-height: 100%; /* TODO only for single image */
    overflow: scroll;
  }
`;

type ImageViewerProps = {|
  id: string,
  width: number,
  height?: number,
  infoUrl: string,
  lang: ?string,
  alt: string,
  urlTemplate: IIIFUriProps => string,
  presentationOnly?: boolean,
  rotation: number,
|};

const ImageViewer = ({
  id,
  width,
  height,
  lang,
  alt,
  infoUrl,
  urlTemplate,
  presentationOnly,
  rotation,
}: ImageViewerProps) => {
  const [showZoomed, setShowZoomed] = useState(false);
  // const [imageLoading, setImageLoading] = useState(false);
  const [imageSrc, setImageSrc] = useState(urlTemplate({ size: '640,' }));

  const [imageSrcSet, setImageSrcSet] = useState(
    imageSizes(2048)
      .map(width => {
        const urlString = urlTemplate({
          size: `${width},`,
        });

        return urlString && `${urlString} ${width}w`;
      })
      .join(',')
  );

  useEffect(() => {
    setImageSrc(urlTemplate({ size: '640,', rotation: rotation }));
    setImageSrcSet(
      imageSizes(2048)
        .map(width => {
          const urlString = urlTemplate({
            size: `${width},`,
            rotation: rotation,
          });
          return urlString && `${urlString} ${width}w`;
        })
        .join(',')
    );
  }, [infoUrl, rotation]);

  // function routeChangeStart(url: string) {
  //   if (window.history.state.as !== url) {
  //     setImageLoading(true);
  //   }
  // }

  const escapeCloseViewer = ({ keyCode }: KeyboardEvent) => {
    if (keyCode === 27) {
      setShowZoomed(false);
    }
  };

  useEffect(() => {
    // Router.events.on('routeChangeStart', routeChangeStart);
    document.addEventListener('keydown', escapeCloseViewer);
    return () => {
      // Router.events.off('routeChangeStart', routeChangeStart);
      document.removeEventListener('keydown', escapeCloseViewer);
    };
  }, []);

  return (
    <>
      {showZoomed && (
        <ZoomedImage id={id} infoUrl={infoUrl} setShowViewer={setShowZoomed} />
      )}
      {/* {imageLoading && <LL lighten={true} />} */}
      <ImageWrapper>
        <IIIFResponsiveImage
          width={width}
          height={height}
          src={imageSrc}
          srcSet={imageSrcSet}
          sizes={`(min-width: 860px) 800px, calc(92.59vw + 22px)`} // TODO specific to MainViewer or single image
          lang={lang}
          // loadHandler={() => setImageLoading(false)}
          alt={presentationOnly ? '' : alt}
          isLazy={false}
          presentationOnly={presentationOnly}
        />
      </ImageWrapper>
    </>
  );
};

export default ImageViewer;
