import {
  getStructures,
  groupStructures,
  getCanvases,
} from '@weco/common/utils/iiif';
import { useContext, FunctionComponent, RefObject } from 'react';
import { FixedSizeList } from 'react-window';
import ItemViewerContext from '../ItemViewerContext/ItemViewerContext';
import { classNames, font } from '../../../utils/classnames';
import Space from '../styled/Space';
import styled from 'styled-components';

type Props = {
  mainViewerRef: RefObject<FixedSizeList>;
};
const ViewerStructuresPrototype: FunctionComponent<Props> = ({
  mainViewerRef,
}: Props) => {
  const {
    manifest,
    setActiveIndex,
    activeIndex,
    setIsMobileSidebarActive,
  } = useContext(ItemViewerContext);
  const structures = manifest ? getStructures(manifest) : [];
  const canvases = manifest ? getCanvases(manifest) : [];
  const groupedStructures = groupStructures(canvases, structures);

  const List = styled.ul.attrs({
    className: classNames({
      'plain-list no-margin no-padding': true,
    }),
  })`
    border-left: 1px solid ${props => props.theme.color('pewter')};
  `;

  const Item = styled(Space).attrs({
    as: 'li',
    v: { size: 'xs', properties: ['padding-top', 'padding-bottom'] },
    h: { size: 'm', properties: ['padding-left', 'padding-right'] },
    className: classNames({
      [font('hnl', 5)]: true,
    }),
  })<{ isActive: boolean }>`
    position: relative;
    cursor: pointer;

    ${props =>
      props.isActive &&
      `
        background: #2e2e2e; // FIXME: we don't have a shade between dark-charcoal and black in the palette (light-black?)

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
  `;

  return groupedStructures.length > 0 ? (
    <List>
      {groupedStructures.map((structure, i) => {
        const firstCanvasInRange = structure.canvases[0];
        const canvasIndex = canvases.findIndex(
          canvas => canvas['@id'] === firstCanvasInRange
        );
        return (
          <Item key={i} isActive={activeIndex === canvasIndex}>
            <a
              onClick={e => {
                e.preventDefault();
                mainViewerRef &&
                  mainViewerRef.current &&
                  mainViewerRef.current.scrollToItem(canvasIndex, 'start');
                setActiveIndex(canvasIndex);
                setIsMobileSidebarActive(false);
              }}
            >
              {structure.label}
            </a>
          </Item>
        );
      })}
    </List>
  ) : null;
};

export default ViewerStructuresPrototype;
