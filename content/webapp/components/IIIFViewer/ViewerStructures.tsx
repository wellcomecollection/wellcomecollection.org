import { useContext, FunctionComponent } from 'react';
import ItemViewerContext from '../ItemViewerContext/ItemViewerContext';
import { font } from '@weco/common/utils/classnames';
import Space from '@weco/common/views/components/styled/Space';
import styled from 'styled-components';
import {
  getEnFromInternationalString,
  groupStructures,
} from '@weco/content/utils/iiif/v3';
import PlainList from '@weco/common/views/components/styled/PlainList';
import { toLink as itemLink } from '@weco/content/components/ItemLink';
import NextLink from 'next/link';
import { arrayIndexToQueryParam } from '.';
import { thumbnailsPageSize } from '@weco/content/components/IIIFViewer/Paginators';

export const List = styled(PlainList)`
  border-left: 1px solid ${props => props.theme.color('neutral.600')};
`;

export const Item = styled(Space).attrs({
  as: 'li',
  className: font('intr', 5),
  $v: { size: 'xs', properties: ['padding-top', 'padding-bottom'] },
  $h: { size: 'm', properties: ['padding-left', 'padding-right'] },
})<{ $isActive: boolean }>`
  position: relative;

  ${props =>
    props.$isActive &&
    `
      background: #222; // FIXME: we don't have a shade between dark-charcoal and black in the palette (light-black?)

      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: -1px;
        bottom: 0;
        width: 4px;
        background: ${props.theme.color('yellow')};
      }
    `}
`;

const ViewerStructures: FunctionComponent = () => {
  const { transformedManifest, setIsMobileSidebarActive, query, work } =
    useContext(ItemViewerContext);
  const { canvas } = query;
  const { structures, canvases } = { ...transformedManifest };
  const groupedStructures = groupStructures(canvases || [], structures || []);

  return groupedStructures.length > 0 ? (
    <List>
      {groupedStructures.map((structure, i) => {
        const maybeFirstCanvasInRange = structure?.items?.[0];
        const firstCanvasInRange =
          typeof maybeFirstCanvasInRange !== 'string'
            ? maybeFirstCanvasInRange
            : undefined;
        const canvasIndex =
          canvases?.findIndex(canvas => canvas.id === firstCanvasInRange?.id) ||
          0;

        return (
          <Item
            key={i}
            $isActive={canvas === arrayIndexToQueryParam(canvasIndex)}
          >
            <NextLink
              replace={true}
              {...itemLink({
                workId: work.id,
                props: {
                  manifest: query.manifest,
                  query: query.query,
                  canvas: arrayIndexToQueryParam(canvasIndex),
                  page: Math.ceil(
                    arrayIndexToQueryParam(canvasIndex) / thumbnailsPageSize
                  ),
                },
                source: 'contents_nav',
              })}
              data-gtm-trigger="contents_nav"
              aria-current={canvas === arrayIndexToQueryParam(canvasIndex)}
              onClick={() => {
                setIsMobileSidebarActive(false);
              }}
            >
              {getEnFromInternationalString(structure.label)}
            </NextLink>
          </Item>
        );
      })}
    </List>
  ) : null;
};

export default ViewerStructures;
