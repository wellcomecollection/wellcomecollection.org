import { storiesOf } from '@storybook/react';
import IIIFViewer from '../../../common/views/components/IIIFViewer/IIIFViewer';
import Readme from '../../../common/views/components/IIIFViewer/README.md';
import { workFixture } from '../../../common/test/fixtures/catalogueApi/work';
import { toLink as itemLink } from '@weco/common/views/components/ItemLink/ItemLink';
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
    query: {},
  };

  Router.router = mockedRouter;

  const sierraId = 'b21538906';
  const langCode = 'eng';
  const pageSize = 4;
  const pageIndex = 2;
  const canvasIndex = 8;
  const canvases = manifest.sequences[0].canvases;
  const currentCanvas = canvases[canvasIndex];
  const sharedPaginatorProps = {
    totalResults: canvases.length,
    link: itemLink({
      workId: workFixture.id,
      query: null,
      page: pageIndex + 1,
      canvas: canvasIndex + 1,
      workType: null,
      langCode,
      sierraId,
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

  return (
    <IIIFViewer
      mainPaginatorProps={mainPaginatorProps}
      thumbsPaginatorProps={thumbsPaginatorProps}
      currentCanvas={currentCanvas}
      lang={langCode}
      canvasOcr={null}
      work={workFixture}
      pageIndex={pageIndex}
      pageSize={pageSize}
      canvasIndex={canvasIndex}
      canvases={canvases}
    />
  );
};

const stories = storiesOf('Components', module);

stories.add('IIIFViewer', IIIFViewerExample, {
  readme: { sidebar: Readme },
  isFullScreen: true,
});
