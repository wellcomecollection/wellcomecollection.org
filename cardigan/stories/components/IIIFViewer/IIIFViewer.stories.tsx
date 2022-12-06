import { transformManifest } from '@weco/catalogue/services/iiif/transformers/manifest';
import IIIFViewer from '@weco/catalogue/components/IIIFViewer/IIIFViewer';
import { workFixture } from '@weco/common/test/fixtures/catalogueApi/work';
import { toLink as itemLink } from '@weco/common/views/components/ItemLink/ItemLink';
import manifest from '@weco/common/__mocks__/iiif-manifest';
import Router from 'next/router';

const rejectedPromise = () => {
  // Needed by Link.linkClicked
  return new Promise((resolve, reject) => reject(new Error('mock')));
};

const mockedRouter = {
  push: rejectedPromise,
  replace: rejectedPromise,
  prefetch: () => void 0,
  query: {},
};

Router.router = mockedRouter;

const sierraId = 'b21538906';
const langCode = 'eng';
const pageSize = 4;
const pageIndex = 2;
const canvasIndex = 8;
const transformedManifest = transformManifest(manifest);
const { canvases } = transformedManifest;
const currentCanvas = canvases[canvasIndex];
const sharedPaginatorProps = {
  totalResults: canvases.length,
  link: itemLink(
    {
      workId: workFixture.id,
      query: null,
      page: pageIndex + 1,
      canvas: canvasIndex + 1,
      workType: null,
      langCode,
      sierraId,
    },
    'work'
  ),
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

const Template = args => <IIIFViewer {...args} />;
export const basic = Template.bind({});
basic.args = {
  mainPaginatorProps: mainPaginatorProps,
  thumbsPaginatorProps: thumbsPaginatorProps,
  currentCanvas: currentCanvas,
  lang: langCode,
  canvasOcr: null,
  work: workFixture,
  pageIndex: pageIndex,
  pageSize: pageSize,
  canvasIndex: canvasIndex,
  transformedManifest: transformedManifest,
  imageLocation: undefined,
};
basic.storyName = 'IIIFViewer';
