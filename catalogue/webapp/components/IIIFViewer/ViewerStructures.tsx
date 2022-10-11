import { groupStructures } from '../../utils/iiif/v2';
import { useContext, FunctionComponent, RefObject } from 'react';
import { FixedSizeList } from 'react-window';
import ItemViewerContext from '../ItemViewerContext/ItemViewerContext';
import { font } from '@weco/common/utils/classnames';
import Space from '@weco/common/views/components/styled/Space';
import styled from 'styled-components';

type Props = {
  mainViewerRef: RefObject<FixedSizeList>;
};
const ViewerStructuresPrototype: FunctionComponent<Props> = ({
  mainViewerRef,
}: Props) => {
  const { manifest, setActiveIndex, activeIndex, setIsMobileSidebarActive } =
    useContext(ItemViewerContext);
  const structures = manifest?.v2.structures || []; // TODO this in the transformer - always return an array?
  const canvases = manifest?.v2.canvases || []; // TODO this in the transformer - always return an array? // useCanvas or already available from transformer output?
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
        const firstCanvasInRange = structure?.canvases?.[0];
        const canvasIndex = canvases.findIndex(
          canvas => canvas['@id'] === firstCanvasInRange
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
              {structure.label}
            </button>
          </Item>
        );
      })}
    </List>
  ) : null;
};

export default ViewerStructuresPrototype;
