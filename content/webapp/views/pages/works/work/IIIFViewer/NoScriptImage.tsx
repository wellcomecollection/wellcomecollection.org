import styled from 'styled-components';

import { imageSizes } from '@weco/common/utils/image-sizes';
import LL from '@weco/common/views/components/styled/LL';
import { useItemViewerContext } from '@weco/content/contexts/ItemViewerContext';
import {
  CanvasPaginator,
  ThumbnailsPaginator,
} from '@weco/content/views/pages/works/work/IIIFViewer/Paginators';
import { Thumbnails } from '@weco/content/views/pages/works/work/IIIFViewer/Thumbnails';

import { DelayVisibility, queryParamToArrayIndex } from '.';
import IIIFViewerImage from './IIIFViewerImage';

const NoScriptImageWrapper = styled.div`
  img {
    display: block;
    width: 66vw;
    height: auto;
    margin: 5vh auto;
  }
`;

const NoScriptLoadingWrapper = styled.div`
  position: absolute;
  width: 100%;
  height: calc(100vh - ${props => props.theme.navHeight}px);
`;

export const NoScriptImage = ({ urlTemplate, canvasOcr }) => {
  const { work, query, transformedManifest } = useItemViewerContext();
  const { canvases } = { ...transformedManifest };
  const pageSize = 4;
  const srcSet =
    urlTemplate &&
    imageSizes(2048)
      .map(width => `${urlTemplate({ size: `${width},` })} ${width}w`)
      .join(',');
  const imageUrl = urlTemplate && urlTemplate({ size: '800,' });
  const navigationCanvases = canvases
    ? [...Array(pageSize)]
        .map((_, i) => pageSize * queryParamToArrayIndex(query.page) + i)
        .map(i => canvases?.[i])
        .filter(Boolean)
    : [];
  const thumbnailsRequired = Boolean(navigationCanvases?.length);

  return (
    <>
      <NoScriptLoadingWrapper>
        <LL $lighten={true} />
      </NoScriptLoadingWrapper>
      <DelayVisibility>
        <CanvasPaginator />
        <NoScriptImageWrapper id="canvas">
          <IIIFViewerImage
            width={800}
            src={imageUrl}
            srcSet={srcSet}
            sizes="(min-width: 860px) 800px, calc(92.59vw + 22px)"
            lang={work.languageId}
            alt={
              (canvasOcr && canvasOcr.replace(/"/g, '')) ||
              'no text alternative'
            }
          />
        </NoScriptImageWrapper>
        {thumbnailsRequired && (
          <div style={{ position: 'relative' }}>
            <Thumbnails />
            <ThumbnailsPaginator />
          </div>
        )}
      </DelayVisibility>
    </>
  );
};

export default NoScriptImage;
