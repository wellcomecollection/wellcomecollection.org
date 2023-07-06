import NextLink from 'next/link';
import styled from 'styled-components';
import IIIFViewerImage from './IIIFViewerImage';
import { iiifImageTemplate } from '@weco/common/utils/convert-image-uri';
import { imageSizes } from '@weco/common/utils/image-sizes';
import { trackGaEvent } from '@weco/common/utils/ga';
import Space from '@weco/common/views/components/styled/Space';
import Rotator from '@weco/common/views/components/styled/Rotator';
import RenderlessPaginator, {
  PaginatorRenderFunctionProps,
} from './RenderlessPaginator';
import Control from '@weco/common/views/components/Buttons/Control/Control';
import IIIFCanvasThumbnail from './IIIFCanvasThumbnail';
import { FunctionComponent, useContext } from 'react';
import { toLink as itemLink } from '@weco/catalogue/components/ItemLink';
import { arrow } from '@weco/common/icons';
import ItemViewerContext from '../ItemViewerContext/ItemViewerContext';
import {
  arrayIndexToQueryParam,
  queryParamToArrayIndex,
} from '@weco/catalogue/components/IIIFViewer/IIIFViewer';
import { OptionalToUndefined } from '@weco/common/utils/utility-types';

const NoScriptViewerEl = styled.div`
  display: flex;
  flex-direction: row-reverse;
  height: calc(100vh - ${props => props.theme.navHeight}px);
  background-color: ${props => props.theme.color('neutral.700')};
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
    left: 50%;
    transform: translateY(-50%) translateX(-50%);
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
  border-right: 1px solid ${props => props.theme.color('neutral.600')};
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

const PaginatorWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

/* eslint-disable react/display-name */
const PaginatorButtons = (
  workId: string
): FunctionComponent<PaginatorRenderFunctionProps> => {
  return ({
    currentPage,
    prevLink,
    nextLink,
  }: PaginatorRenderFunctionProps) => {
    return (
      <PaginatorWrapper>
        {prevLink && (
          <Space v={{ size: 's', properties: ['margin-bottom'] }}>
            <Rotator rotate={270}>
              <Control
                scroll={false}
                replace={true}
                link={prevLink}
                colorScheme="light"
                icon={arrow}
                text="Previous page"
                clickHandler={() => {
                  trackGaEvent({
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
                icon={arrow}
                text="Next page"
                clickHandler={() => {
                  trackGaEvent({
                    category: 'Control',
                    action: 'clicked work viewer next page link',
                    label: `${workId} | page: ${currentPage}`,
                  });
                }}
              />
            </Rotator>
          </Space>
        )}
      </PaginatorWrapper>
    );
  };
};
/* eslint-enable react/display-name */

type NoScriptViewerProps = OptionalToUndefined<{
  imageUrl?: string;
  iiifImageLocation?: { url: string };
  canvasOcr?: string;
}>;

const NoScriptViewer: FunctionComponent<NoScriptViewerProps> = ({
  imageUrl,
  iiifImageLocation,
  canvasOcr,
}) => {
  const { work, query, transformedManifest } = useContext(ItemViewerContext);
  const lang = (work.languages.length === 1 && work.languages[0].id) || '';
  const { canvases } = { ...transformedManifest };
  const currentCanvas = canvases?.[queryParamToArrayIndex(query.canvas)];
  const mainImageService = { '@id': currentCanvas?.imageServiceId };
  const pageIndex = queryParamToArrayIndex(query.page);
  const pageSize = 4;
  const navigationCanvases = canvases
    ? [...Array(pageSize)]
        .map((_, i) => pageSize * queryParamToArrayIndex(query.page) + i)
        .map(i => canvases?.[i])
        .filter(Boolean)
    : [];
  const thumbnailsRequired = Boolean(navigationCanvases?.length);

  const urlTemplate =
    (iiifImageLocation && iiifImageTemplate(iiifImageLocation.url)) ||
    (mainImageService['@id'] && iiifImageTemplate(mainImageService['@id']));
  const srcSet =
    urlTemplate &&
    imageSizes(2048)
      .map(width => `${urlTemplate({ size: `${width},` })} ${width}w`)
      .join(',');
  const sharedPaginatorProps = {
    totalResults: canvases?.length || 1,
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
    <NoScriptViewerEl>
      <NoScriptViewerMain>
        <NoScriptViewerImageWrapper>
          {iiifImageLocation && imageUrl && (
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
          )}
          {mainImageService['@id'] && currentCanvas && (
            <IIIFViewerImage
              width={800}
              src={urlTemplate && urlTemplate({ size: '800,' })}
              srcSet={srcSet}
              sizes="(min-width: 860px) 800px, calc(92.59vw + 22px)"
              lang={lang}
              alt={
                (canvasOcr && canvasOcr.replace(/"/g, '')) ||
                'no text alternative'
              }
            />
          )}
        </NoScriptViewerImageWrapper>
        <NoScriptViewerPaginatorButtons>
          <RenderlessPaginator
            {...mainPaginatorProps}
            render={PaginatorButtons(work.id)}
          />
        </NoScriptViewerPaginatorButtons>
      </NoScriptViewerMain>

      {thumbnailsRequired && (
        <StaticThumbnailsContainer>
          {navigationCanvases &&
            navigationCanvases.map((canvas, i) => {
              const canvasParam = pageSize * pageIndex + (i + 1);
              return (
                <RenderlessPaginator
                  key={canvas?.['@id'] || i}
                  {...thumbsPaginatorProps}
                  render={() => (
                    <NextLink
                      {...itemLink({
                        workId: work.id,
                        props: {
                          canvas: canvasParam,
                          page: arrayIndexToQueryParam(pageIndex),
                        },
                        source: 'viewer/paginator',
                      })}
                      scroll={false}
                      replace
                      passHref
                      legacyBehavior
                    >
                      <ThumbnailLink
                        aria-current={canvasParam === query.canvas}
                      >
                        <IIIFCanvasThumbnail
                          canvas={canvas}
                          thumbNumber={canvasParam}
                        />
                      </ThumbnailLink>
                    </NextLink>
                  )}
                />
              );
            })}
          <NoScriptViewerPaginatorButtons>
            <RenderlessPaginator
              {...thumbsPaginatorProps}
              render={PaginatorButtons(work.id)}
            />
          </NoScriptViewerPaginatorButtons>
        </StaticThumbnailsContainer>
      )}
    </NoScriptViewerEl>
  );
};

export default NoScriptViewer;
