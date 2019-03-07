// @flow
import { type Context } from 'next';
import fetch from 'isomorphic-unfetch';
import NextLink from 'next/link';
import styled from 'styled-components';
import { type IIIFManifest, type IIIFCanvas } from '@weco/common/model/iiif';
import { iiifImageTemplate } from '@weco/common/utils/convert-image-uri';
import { itemUrl } from '@weco/common/services/catalogue/urls';

type Props = {|
  workId: string,
  sierraId: string,
  manifest: IIIFManifest,
  pageSize: number,
  pageIndex: number,
  canvasIndex: number,
  itemsLocationsLocationType: ?(string[]),
  workType: ?(string[]),
  query: ?string,
|};

const Viewer = styled.div`
  clear: both;
  height: 100vh;
  width: 100vw;
  position: relative;

  display: flex;
  flex-direction: column;

  ${props => props.theme.media.large`
    flex-direction: row-reverse;
  `}
`;

const ViewerMainPane = styled.div`
  flex-grow: 1;
  text-align: center;
  height: 80vh;

  ${props => props.theme.media.large`
    height: auto;
    width: 80vw;
  `}
`;

const ViewerPanel = styled.div`
  display: flex;
  flex-direction: row;
  height: 20vh;
  justify-content: space-evenly;

  ${props => props.theme.media.large`
    height: auto;
    width: 20vw;
    flex-direction: column;
    overflow-x: auto;
    overflow-y: scroll;
  `}
`;

const ConstrainedImage = styled.img`
  max-width: 100%;
  max-height: 100%;
  height: auto;
  width: auto;
`;

type IIIFCanvasThumbnailProps = {| canvas: IIIFCanvas, maxWidth: ?number |};
const IIIFCanvasThumbnail = ({
  canvas,
  maxWidth,
}: IIIFCanvasThumbnailProps) => {
  const thumbnailService = canvas.thumbnail.service;
  const size = maxWidth
    ? thumbnailService.sizes
        .filter(size => size.width <= maxWidth)
        // TODO: We could make this the next size up for responsive images perhaps
        .reduce((max, size, i, arr) => (size.width > max.width ? size : max))
    : thumbnailService.sizes[0];

  const urlTemplate = iiifImageTemplate(thumbnailService['@id']);
  return (
    <ConstrainedImage
      width={size.width}
      height={size.height}
      src={urlTemplate({
        size: `${size.width},${size.height}`,
      })}
    />
  );
};

const ItemPage = ({
  workId,
  sierraId,
  manifest,
  pageSize,
  pageIndex,
  canvasIndex,
  itemsLocationsLocationType,
  workType,
  query,
}: Props) => {
  const canvases = manifest.sequences[0].canvases;
  const currentCanvas = canvases[canvasIndex];
  const service = currentCanvas.thumbnail.service;
  const urlTemplate = iiifImageTemplate(service['@id']);
  const largestSize = service.sizes[service.sizes.length - 1];
  const navigationCanvases = [...Array(pageSize)]
    .map((_, i) => pageSize * pageIndex + i)
    .map(i => canvases[i])
    .filter(Boolean);

  return (
    <>
      <Viewer>
        <ViewerMainPane>
          <ConstrainedImage
            width={largestSize.width}
            height={largestSize.height}
            src={urlTemplate({
              size: `${largestSize.width},${largestSize.height}`,
            })}
          />
        </ViewerMainPane>
        <ViewerPanel>
          {navigationCanvases.map((canvas, i) => (
            <div key={canvas['@id']}>
              <NextLink
                {...itemUrl({
                  workId,
                  query,
                  workType,
                  itemsLocationsLocationType,
                  page: pageIndex + 1,
                  sierraId,
                  canvas: pageSize * pageIndex + (i + 1),
                })}
              >
                <a>
                  <IIIFCanvasThumbnail canvas={canvas} maxWidth={300} />
                </a>
              </NextLink>
            </div>
          ))}
        </ViewerPanel>
      </Viewer>
    </>
  );
};

ItemPage.getInitialProps = async (ctx: Context): Promise<Props> => {
  const {
    workId,
    sierraId,
    query,
    page = 1,
    pageSize = 5,
    canvas = 1,
  } = ctx.query;
  const pageIndex = page - 1;
  const canvasIndex = canvas - 1;
  const manifest = await (await fetch(
    `https://wellcomelibrary.org/iiif/${sierraId}/manifest`
  )).json();

  return {
    workId,
    sierraId,
    manifest,
    pageSize,
    pageIndex,
    canvasIndex,
    // TODO: add these back in, it's just makes it easier to check the URLs
    itemsLocationsLocationType: null,
    workType: null,
    query,
  };
};

export default ItemPage;
