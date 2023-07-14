import { useContext } from 'react';
import ItemViewerContext from '../ItemViewerContext/ItemViewerContext';
import IIIFViewerImage from './IIIFViewerImage';
import { Thumbnails } from '@weco/catalogue/components/IIIFViewer/Thumbnails';
import { CanvasPaginator, ThumbnailsPaginator } from '@weco/catalogue/components/IIIFViewer/Paginators';
import LL from '@weco/common/views/components/styled/LL';
import { DelayVisibility } from '.';
import {
  queryParamToArrayIndex,
} from '.';
import styled, { keyframes } from 'styled-components';
import { fromQuery, toLink as itemLink } from '@weco/catalogue/components/ItemLink';
import { imageSizes } from '@weco/common/utils/image-sizes';

const show = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const NoScriptImageWrapper = styled.div`
  img {

    display: block;
    width : 66vw;
    height: auto;
    margin: 5vh auto;
  }
`;

const NoScriptLoadingWrapper = styled.div`
position: absolute;
width: 100%;
height: calc(100vh - ${props => props.theme.navHeight}px);
`;

export const NoScriptImage = ({urlTemplate, canvasOcr}) => { // TODO type
  const { work, query, transformedManifest } = useContext(ItemViewerContext);
  const { canvases } = { ...transformedManifest };
  const pageSize = 4;
  const srcSet =
  urlTemplate &&
  imageSizes(2048)
    .map(width => `${urlTemplate({ size: `${width},` })} ${width}w`)
      .join(',');
  const lang = (work.languages.length === 1 && work.languages[0].id) || undefined;
  const imageUrl = urlTemplate && urlTemplate({ size: '800,' });
  const navigationCanvases = canvases
  ? [...Array(pageSize)]
      .map((_, i) => pageSize * queryParamToArrayIndex(query.page) + i)
      .map(i => canvases?.[i])
      .filter(Boolean)
  : [];
  const thumbnailsRequired = Boolean(navigationCanvases?.length)
  const sharedPaginatorProps = {
    totalResults: transformedManifest?.canvases?.length || 1,
    link: itemLink({
      workId: work.id,
      props: {
        canvas: query.canvas,
        page: query.page,
      },
      source: 'viewer/paginator',
    }),
  };
  const mainPaginatorProps = {
    currentPage: query.canvas,
    pageSize: 1,
    linkKey: 'canvas',
    ...sharedPaginatorProps,
  };
  const thumbsPaginatorProps = {
    currentPage: query.page,
    pageSize: 4,
    linkKey: 'page',
    ...sharedPaginatorProps,
  };
  return (
    <>
    <NoScriptLoadingWrapper>
        <LL lighten={true} />
    </NoScriptLoadingWrapper>
    <DelayVisibility>
    <CanvasPaginator />
    <NoScriptImageWrapper id="canvas">
        <IIIFViewerImage
            width={800}
            src={imageUrl}
            srcSet={srcSet}
            sizes="(min-width: 860px) 800px, calc(92.59vw + 22px)"
            lang={lang}
            alt={
              (canvasOcr && canvasOcr.replace(/"/g, '')) ||
              'no text alternative'
            }
            />
      </NoScriptImageWrapper>
    {thumbnailsRequired &&
      <div style={{position: 'relative'}}>
        <Thumbnails />
        <ThumbnailsPaginator />
      </div>
    }
  </DelayVisibility>
</>
  )
}

export default NoScriptImage;




