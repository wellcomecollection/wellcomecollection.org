import { IIIFManifest } from '@weco/common/model/iiif';
import NextLink from 'next/link';
import { itemLink } from '@weco/common/services/catalogue/routes';
import { getStructures, getCanvases } from '@weco/common/utils/iiif';
// import styled from 'styled-components';
// import {
//   useState,
//   memo,
//   useEffect,
//   useRef,
//   useContext,
//   RefObject,
//   FunctionComponent,
//   CSSProperties,
// } from 'react';
// import Space from '@weco/common/views/components/styled/Space';

const StructuresViewer: FunctionComponent<Props> = ({
  manifest,
  workId,
  pageIndex,
  lang,
  setActiveIndex,
  mainViewerRef,
}: Props) => {
  const structures = getStructures(manifest);
  const canvases = getCanvases(manifest);

  return structures.length > 0 ? (
    <ul>
      {structures.map((structure, i) => {
        const firstCanvasInRange = structure.canvases[0];
        const canvasIndex = canvases.findIndex(
          canvas => canvas['@id'] === firstCanvasInRange
        );
        return (
          <li key={i}>
            {/* <NextLink
              {...itemLink({
                workId,
                page: pageIndex + 1,
                langCode: lang,
                canvas: canvasIndex,
              })}
              scroll={true}
              replace
              passHref
            > */}
            <a
              onClick={e => {
                e.preventDefault();
                mainViewerRef &&
                  mainViewerRef.current &&
                  mainViewerRef.current.scrollToItem(canvasIndex);
                setActiveIndex(canvasIndex);
              }}
            >
              {structure.label}
            </a>
            {/* </NextLink> */}
          </li>
        );
      })}
    </ul>
  ) : null;
};

export default StructuresViewer;
