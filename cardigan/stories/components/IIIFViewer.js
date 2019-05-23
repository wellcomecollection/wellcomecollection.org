import { storiesOf } from '@storybook/react';
import IIIFViewer from '../../../common/views/components/IIIFViewer/IIIFViewer';
import Readme from '../../../common/views/components/IIIFViewer/README.md';
import { itemUrl } from '../../../common/services/catalogue/urls';
import manifest from '../../../common/__mocks__/iiif-manifest';
import Router from 'next/router';

const IIIFViewerExample = () => {
  const rejectedPromise = () => {
    // Needed by Link.linkClicked
    return new Promise((resolve, reject) => reject(new Error('mock')));
  };

  const mockedRouter = {
    push: rejectedPromise,
    replace: rejectedPromise,
    prefetch: () => {},
  };

  Router.router = mockedRouter;

  const workId = 'pxc98cnk';
  const sierraId = 'b21538906';
  const manifestId = null;
  const langCode = 'eng';
  const pageSize = 4;
  const pageIndex = 2;
  const canvasIndex = 8;
  const canvases = manifest.sequences[0].canvases;
  const currentCanvas = canvases[canvasIndex];
  const sharedPaginatorProps = {
    totalResults: canvases.length,
    link: itemUrl({
      workId,
      query: null,
      page: pageIndex + 1,
      canvas: canvasIndex + 1,
      workType: null,
      langCode,
      sierraId,
      manifestId,
    }),
  };

  const mainPaginatorProps = {
    currentPage: canvasIndex + 1,
    pageSize: 1,
    linkKey: 'canvas',
    ...sharedPaginatorProps,
  };

  const thumbsPaginatorProps = {
    currentPage: pageIndex + 1,
    pageSize: pageSize,
    linkKey: 'page',
    ...sharedPaginatorProps,
  };

  const navigationCanvases = [...Array(pageSize)]
    .map((_, i) => pageSize * pageIndex + i)
    .map(i => canvases[i])
    .filter(Boolean);

  return (
    <IIIFViewer
      mainPaginatorProps={mainPaginatorProps}
      thumbsPaginatorProps={thumbsPaginatorProps}
      currentCanvas={currentCanvas}
      lang={langCode}
      canvasOcr={null}
      navigationCanvases={navigationCanvases}
      workId={workId}
      query={null}
      workType={null}
      itemsLocationsLocationType={null}
      pageIndex={pageIndex}
      sierraId={sierraId}
      manifestId={manifestId}
      pageSize={pageSize}
      canvasIndex={canvasIndex}
    />
  );
};

const stories = storiesOf('Components/WIP', module);

stories.add('IIIFViewer', IIIFViewerExample, {
  readme: { sidebar: Readme },
  isFullScreen: true,
});
