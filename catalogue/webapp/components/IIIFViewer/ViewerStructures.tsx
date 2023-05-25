import { useContext, FunctionComponent } from 'react';
import ItemViewerContext from '../ItemViewerContext/ItemViewerContext';
import { font } from '@weco/common/utils/classnames';
import Space from '@weco/common/views/components/styled/Space';
import styled from 'styled-components';
import {
  getEnFromInternationalString,
  groupStructures,
} from '@weco/catalogue/utils/iiif/v3';
import PlainList from '@weco/common/views/components/styled/PlainList';
import { toLink as itemLink } from '@weco/catalogue/components/ItemLink';
import NextLink from 'next/link';
import { arrayIndexToQueryParam } from '@weco/catalogue/components/IIIFViewer/IIIFViewer';

const List = styled(PlainList)`
  border-left: 1px solid ${props => props.theme.color('neutral.600')};
`;

const Item = styled(Space).attrs({
  as: 'li',
  v: { size: 'xs', properties: ['padding-top', 'padding-bottom'] },
  h: { size: 'm', properties: ['padding-left', 'padding-right'] },
  className: font('intr', 5),
})<{ isActive: boolean }>`
  position: relative;

  ${props =>
    props.isActive &&
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

const ViewerStructuresPrototype: FunctionComponent = () => {
  const { transformedManifest, setIsMobileSidebarActive, query, work } =
    useContext(ItemViewerContext);
  const { canvasParam, manifestParam } = query;
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
            isActive={canvasParam === arrayIndexToQueryParam(canvasIndex)}
          >
            <NextLink
              {...itemLink(
                {
                  workId: work.id,
                  manifest: manifestParam,
                  canvas: arrayIndexToQueryParam(canvasIndex),
                },
                'contents_nav'
              )}
              data-gtm-trigger="contents_nav"
              aria-current={canvasParam === arrayIndexToQueryParam(canvasIndex)}
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

export default ViewerStructuresPrototype;
