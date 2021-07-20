import NextLink from 'next/link';
import styled from 'styled-components';
import { classNames } from '@weco/common/utils/classnames';
import { getServiceId } from '@weco/common/utils/iiif';
import IIIFResponsiveImage from '@weco/common/views/components/IIIFResponsiveImage/IIIFResponsiveImage';
import { iiifImageTemplate } from '@weco/common/utils/convert-image-uri';
import { imageSizes } from '../../../utils/image-sizes';
import { trackEvent } from '@weco/common/utils/ga';
import Space from '../styled/Space';
import Rotator from '../styled/Rotator';
import Paginator, {
  PropsWithoutRenderFunction as PaginatorPropsWithoutRenderFunction,
  PaginatorRenderFunctionProps,
} from '@weco/common/views/components/RenderlessPaginator/RenderlessPaginator';
import Control from '@weco/common/views/components/Buttons/Control/Control';
import IIIFCanvasThumbnail from './IIIFCanvasThumbnail';
import { IIIFCanvas } from '@weco/common/model/iiif';
import { FunctionComponent } from 'react';
import { toLink as itemLink } from '../ItemLink/ItemLink';

const NoScriptViewerEl = styled.div`
  display: flex;
  flex-direction: row-reverse;
  height: calc(100vh - 85px);
`;

const NoScriptViewerMain = styled.div`
  position: relative;
  color: ${props => props.theme.color('white')};
  height: 100%;
  width: 75%;
`;

const NoScriptViewerImageWrapper = styled.div`
  position: absolute;
  top: ${props => `${props.theme.spacingUnit * 2}px`};
  right: 0;
  bottom: ${props => `${props.theme.spacingUnit * 2}px`};
  left: 0;

  img {
    position: relative;
    top: 50%;
    transform: translateY(-50%);
    width: auto;
    height: auto;
    max-width: 100%;
    max-height: 100%;
  }
`;

const StaticThumbnailsContainer = styled.div`
  display: flex;
  position: relative;
  flex-direction: column;
  height: 100%;
  width: 25%;
  border-top: none;
  border-right: 1px solid ${props => props.theme.color('pewter')};
`;

const ThumbnailLink = styled.a`
  display: block;
  text-decoration: none;
  height: 25%;
  padding: 12px;
  width: auto;
`;

export const NoScriptViewerPaginatorButtons = styled.div`
  position: absolute;
  left: 12px;
  top: 12px;
`;

/* eslint-disable react/display-name */
export const PaginatorButtons = (
  isTabbable: boolean,
  workId: string
): FunctionComponent<PaginatorRenderFunctionProps> => {
  return ({
    currentPage,
    prevLink,
    nextLink,
  }: PaginatorRenderFunctionProps) => {
    return (
      <div
        className={classNames({
          'flex flex--column flex--v-center flex--h-center': true,
        })}
      >
        {prevLink && (
          <Space v={{ size: 's', properties: ['margin-bottom'] }}>
            <Rotator rotate={270}>
              <Control
                scroll={false}
                replace={true}
                link={prevLink}
                colorScheme="light"
                icon="arrow"
                text="Previous page"
                tabIndex={isTabbable ? 0 : -1}
                clickHandler={() => {
                  trackEvent({
                    category: 'Control',
                    action: 'clicked work viewer previous page link',
                    label: `${workId} | page: ${currentPage}`,
                  });
                }}
              />
            </Rotator>
          </Space>
        )}
        {nextLink && (
          <Space v={{ size: 's', properties: ['margin-bottom'] }}>
            <Rotator rotate={90}>
              <Control
                scroll={false}
                replace={true}
                link={nextLink}
                colorScheme="light"
                icon="arrow"
                text="Next page"
                tabIndex={isTabbable ? 0 : -1}
                clickHandler={() => {
                  trackEvent({
                    category: 'Control',
                    action: 'clicked work viewer next page link',
                    label: `${workId} | page: ${currentPage}`,
                  });
                }}
              />
            </Rotator>
          </Space>
        )}
      </div>
    );
  };
};
/* eslint-enable react/display-name */

type NoScriptViewerProps = {
  mainPaginatorProps: PaginatorPropsWithoutRenderFunction;
  thumbsPaginatorProps: PaginatorPropsWithoutRenderFunction;
  currentCanvas?: IIIFCanvas;
  lang: string;
  canvasOcr?: string;
  workId: string;
  pageIndex: number;
  pageSize: number;
  imageUrl?: string;
  thumbnailsRequired: boolean;
  iiifImageLocation?: { url: string };
  canvases: IIIFCanvas[];
  canvasIndex: number;
};

const NoScriptViewer: FunctionComponent<NoScriptViewerProps> = ({
  thumbnailsRequired,
  imageUrl,
  iiifImageLocation,
  currentCanvas,
  canvasOcr,
  lang,
  mainPaginatorProps,
  thumbsPaginatorProps,
  workId,
  canvases,
  canvasIndex,
  pageIndex,
  pageSize,
}: NoScriptViewerProps) => {
  const mainImageService = { '@id': getServiceId(currentCanvas) };

  const navigationCanvases = [...Array(pageSize)]
    .map((_, i) => pageSize * pageIndex + i)
    .map(i => canvases[i])
    .filter(Boolean);

  const urlTemplate =
    (iiifImageLocation && iiifImageTemplate(iiifImageLocation.url)) ||
    (mainImageService['@id'] && iiifImageTemplate(mainImageService['@id']));
  const srcSet =
    urlTemplate &&
    imageSizes(2048)
      .map(width => {
        return `${urlTemplate({ size: `${width},` })} ${width}w`;
      })
      .join(',');

  return (
    <NoScriptViewerEl className="bg-charcoal">
      <NoScriptViewerMain>
        <NoScriptViewerImageWrapper>
          {iiifImageLocation && imageUrl && (
            <IIIFResponsiveImage
              width={800}
              src={imageUrl}
              srcSet={srcSet}
              sizes={`(min-width: 860px) 800px, calc(92.59vw + 22px)`}
              extraClasses={classNames({
                'block h-center': true,
              })}
              lang={lang}
              alt={
                (canvasOcr && canvasOcr.replace(/"/g, '')) ||
                'no text alternative'
              }
              isLazy={false}
            />
          )}
          {mainImageService['@id'] && currentCanvas && (
            <IIIFResponsiveImage
              width={800}
              src={urlTemplate && urlTemplate({ size: '800,' })}
              srcSet={srcSet}
              sizes={`(min-width: 860px) 800px, calc(92.59vw + 22px)`}
              extraClasses={classNames({
                'block h-center': true,
              })}
              lang={lang}
              alt={
                (canvasOcr && canvasOcr.replace(/"/g, '')) ||
                'no text alternative'
              }
              isLazy={false}
            />
          )}
        </NoScriptViewerImageWrapper>
        <NoScriptViewerPaginatorButtons>
          <Paginator
            {...mainPaginatorProps}
            render={PaginatorButtons(true, workId)}
          />
        </NoScriptViewerPaginatorButtons>
      </NoScriptViewerMain>

      {thumbnailsRequired && (
        <StaticThumbnailsContainer>
          {navigationCanvases &&
            navigationCanvases.map((canvas, i) => {
              const canvasNumber = pageSize * pageIndex + (i + 1);
              return (
                <Paginator
                  key={canvas['@id']}
                  {...thumbsPaginatorProps}
                  render={() => (
                    <NextLink
                      {...itemLink(
                        {
                          workId,
                          page: pageIndex + 1,
                          canvas: canvasNumber,
                        },
                        'viewer/paginator'
                      )}
                      scroll={false}
                      replace
                      passHref
                    >
                      <ThumbnailLink>
                        <IIIFCanvasThumbnail
                          filterId={null}
                          canvas={canvas}
                          lang={lang}
                          isActive={canvasNumber === canvasIndex + 1}
                          thumbNumber={canvasNumber}
                        />
                      </ThumbnailLink>
                    </NextLink>
                  )}
                />
              );
            })}
          <NoScriptViewerPaginatorButtons>
            <Paginator
              {...thumbsPaginatorProps}
              render={PaginatorButtons(true, workId)}
            />
          </NoScriptViewerPaginatorButtons>
        </StaticThumbnailsContainer>
      )}
    </NoScriptViewerEl>
  );
};

export default NoScriptViewer;
