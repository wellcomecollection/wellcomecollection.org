import { useContext, FunctionComponent, RefObject } from 'react';
import { FixedSizeList } from 'react-window';
import ItemViewerContext from '../ItemViewerContext/ItemViewerContext';
import { font } from '@weco/common/utils/classnames';
import Space from '@weco/common/views/components/styled/Space';
import styled from 'styled-components';
import {
  getEnFromInternationalString,
  groupStructures,
} from '../../utils/iiif/v3';

type Props = {
  mainViewerRef: RefObject<FixedSizeList>;
};
const ViewerStructuresPrototype: FunctionComponent<Props> = ({
  mainViewerRef,
}: Props) => {
  const {
    transformedManifest,
    setActiveIndex,
    activeIndex,
    setIsMobileSidebarActive,
  } = useContext(ItemViewerContext);
  const { structures, canvases } = transformedManifest;
  const groupedStructures = groupStructures(canvases, structures);
  const List = styled.ul`
    list-style: none;
    margin: 0 !important;
    padding: 0;
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

        &:before {
          content: '';
          position: absolute;
          top: 0;
          left: -1px;
          bottom: 0;
          width: 4px;
          background: ${props.theme.color('yellow')};
        }
      `}

    button {
      cursor: pointer;
    }
  `;

  return groupedStructures.length > 0 ? (
    <List>
      {groupedStructures.map((structure, i) => {
        const maybeFirstCanvasInRange = structure?.items?.[0];
        const firstCanvasInRange =
          typeof maybeFirstCanvasInRange !== 'string'
            ? maybeFirstCanvasInRange
            : undefined;
        const canvasIndex = canvases.findIndex(
          canvas => canvas.id === firstCanvasInRange?.id
        );

        return (
          <Item key={i} isActive={activeIndex === canvasIndex}>
            <button
              className="plain-button"
              type="button"
              onClick={() => {
                mainViewerRef &&
                  mainViewerRef.current &&
                  mainViewerRef.current.scrollToItem(canvasIndex, 'start');
                setActiveIndex(canvasIndex);
                setIsMobileSidebarActive(false);
              }}
            >
              {getEnFromInternationalString(structure.label)}
            </button>
          </Item>
        );
      })}
    </List>
  ) : null;
};

export default ViewerStructuresPrototype;
