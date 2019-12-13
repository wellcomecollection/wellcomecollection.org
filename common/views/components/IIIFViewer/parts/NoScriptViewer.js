// @flow

import NextLink from 'next/link';
import styled from 'styled-components';
import { classNames } from '@weco/common/utils/classnames';
import { itemUrl } from '@weco/common/services/catalogue/urls';
import IIIFResponsiveImage from '@weco/common/views/components/IIIFResponsiveImage/IIIFResponsiveImage';
import { iiifImageTemplate } from '@weco/common/utils/convert-image-uri';
import { imageSizes } from '../../../../utils/image-sizes';
import { trackEvent } from '@weco/common/utils/ga';
import Space from '../../styled/Space';
import { type SearchParams } from '@weco/common/services/catalogue/search-params';
import Paginator, {
  type PropsWithoutRenderFunction as PaginatorPropsWithoutRenderFunction,
  type PaginatorRenderFunctionProps,
} from '@weco/common/views/components/RenderlessPaginator/RenderlessPaginator';
import Control from '@weco/common/views/components/Buttons/Control/Control';
import IIIFCanvasThumbnail from './IIIFCanvasThumbnail';
import { type IIIFCanvas } from '@weco/common/model/iiif';
import {
  IIIFViewer,
  IIIFViewerMain,
  IIIFViewerImageWrapper,
} from '../IIIFViewer';

const StaticThumbnailsContainer = styled.div.attrs(props => ({
  className: classNames({
    'bg-viewerBlack flex relative': true,
  }),
}))`
  width: 100%;
  height: 20%;
  border-top: 1px solid ${props => props.theme.colors.pewter};
  padding-left: 20%;
  @media (min-width: ${props => props.theme.sizes.medium}px) {
    padding-left: 0;
    flex-direction: column;
    height: 100%;
    width: 25%;
    border-top: none;
    border-right: 1px solid ${props => props.theme.colors.pewter};
  }
`;

const ThumbnailLink = styled.a`
  display: block;
  text-decoration: none;
  height: 100%;
  padding: 12px;
  width: 25%;
  @media (min-width: ${props => props.theme.sizes.medium}px) {
    width: auto;
  }
`;

export const IIIFViewerPaginatorButtons = styled.div.attrs(props => ({
  className: classNames({
    absolute: true,
  }),
}))`
  left: 12px;
  top: 12px;
`;

/* eslint-disable react/display-name */
export const PaginatorButtons = (isTabbable: boolean, workId: string) => {
  return ({
    currentPage,
    totalPages,
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
            <Control
              scroll={false}
              replace={true}
              link={prevLink}
              type="black-on-white"
              icon="arrow"
              text="Previous page"
              tabIndex={isTabbable ? '0' : '-1'}
              extraClasses={classNames({
                'icon--270': true,
              })}
              clickHandler={() => {
                trackEvent({
                  category: 'Control',
                  action: 'clicked work viewer previous page link',
                  label: `${workId} | page: ${currentPage}`,
                });
              }}
            />
          </Space>
        )}
        {nextLink && (
          <Space v={{ size: 's', properties: ['margin-bottom'] }}>
            <Control
              scroll={false}
              replace={true}
              link={nextLink}
              type="black-on-white"
              icon="arrow"
              text="Next page"
              tabIndex={isTabbable ? '0' : '-1'}
              extraClasses={classNames({
                icon: true,
                'icon--90': true,
              })}
              clickHandler={() => {
                trackEvent({
                  category: 'Control',
                  action: 'clicked work viewer next page link',
                  label: `${workId} | page: ${currentPage}`,
                });
              }}
            />
          </Space>
        )}
      </div>
    );
  };
};
/* eslint-enable react/display-name */

type NoScriptViewerProps = {|
  mainPaginatorProps: PaginatorPropsWithoutRenderFunction,
  thumbsPaginatorProps: PaginatorPropsWithoutRenderFunction,
  currentCanvas: ?IIIFCanvas,
  lang: string,
  canvasOcr: ?string,
  workId: string,
  pageIndex: number,
  sierraId: string,
  pageSize: number,
  iiifImageLocationUrl: ?string,
  imageUrl: ?string,
  thumbnailsRequired: boolean,
  iiifImageLocation: ?{ url: string },
  canvases: ?[],
  canvasIndex: number,
  params: SearchParams,
|};

const NoScriptViewer = ({
  thumbnailsRequired,
  iiifImageLocationUrl,
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
  sierraId,
  pageSize,
  params,
}: NoScriptViewerProps) => {
  const mainImageService = {
    '@id': currentCanvas ? currentCanvas.images[0].resource.service['@id'] : '',
  };

  const navigationCanvases =
    canvases &&
    [...Array(pageSize)]
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
    <noscript>
      <IIIFViewer>
        <IIIFViewerMain
          h={{ size: 's', properties: ['padding-left', 'padding-right'] }}
          fullWidth={!thumbnailsRequired}
        >
          <IIIFViewerImageWrapper>
            {iiifImageLocationUrl && imageUrl && (
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
          </IIIFViewerImageWrapper>
          <IIIFViewerPaginatorButtons>
            <Paginator
              {...mainPaginatorProps}
              render={PaginatorButtons(true, workId)}
            />
          </IIIFViewerPaginatorButtons>
        </IIIFViewerMain>

        {thumbnailsRequired && (
          <StaticThumbnailsContainer>
            {navigationCanvases &&
              navigationCanvases.map((canvas, i) => {
                const canvasNumber = pageSize * pageIndex + (i + 1);
                return (
                  <Paginator
                    key={canvas['@id']}
                    {...thumbsPaginatorProps}
                    render={({ rangeStart }) => (
                      <NextLink
                        {...itemUrl({
                          ...params,
                          workId,
                          page: pageIndex + 1,
                          sierraId,
                          langCode: lang,
                          canvas: canvasNumber,
                        })}
                        scroll={false}
                        replace
                        passHref
                      >
                        <ThumbnailLink>
                          <IIIFCanvasThumbnail
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
            <IIIFViewerPaginatorButtons isThumbs={true}>
              <Paginator
                {...thumbsPaginatorProps}
                render={PaginatorButtons(true, workId)}
              />
            </IIIFViewerPaginatorButtons>
          </StaticThumbnailsContainer>
        )}
      </IIIFViewer>
    </noscript>
  );
};

export default NoScriptViewer;
