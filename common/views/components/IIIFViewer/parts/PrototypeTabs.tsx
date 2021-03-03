import { FunctionComponent, useContext, RefObject } from 'react';
import { FixedSizeList } from 'react-window';
import { IIIFManifest } from '../../../../model/iiif';
import BaseTabs, { TabType } from '../../BaseTabs/BaseTabs';
import { AppContext } from '../../AppContext/AppContext';
import styled from 'styled-components';
import { classNames, font } from '../../../../utils/classnames';
import Space from '../../styled/Space';
import StructuresViewer from './StructuresViewer';
import { ElementFromComponent } from '../../../../utils/utility-types';
import GridViewer from './GridViewer';

type TabProps = {
  isActive: boolean;
  isFocused: boolean;
  isKeyboard: boolean;
};

const Tab = styled(Space).attrs({
  as: 'span',
  v: { size: 'm', properties: ['padding-top', 'padding-bottom'] },
  h: { size: 'm', properties: ['padding-left', 'padding-right'] },
  className: classNames({
    'flex-inline': true,
    [font('hnm', 5)]: true,
  }),
})<TabProps>`
  cursor: pointer;
  background: ${props => props.theme.color('pumice')};

  ${props =>
    props.isActive &&
    `
    background: ${props.theme.color('cream')};
  `}
  ${props =>
    props.isFocused &&
    `
    box-shadow: ${props.isKeyboard ? props.theme.focusBoxShadow : null};
    position: relative;
    z-index: 1;
  `}
`;

const ScrollContainer = styled.div<{ height: number }>`
  overflow: scroll;
  height: ${props => `${props.height - 50}px`};
`;

type Props = {
  manifest: IIIFManifest | undefined;
  gridViewerRef: RefObject<HTMLDivElement>;
  mainViewerRef: RefObject<FixedSizeList>;
  GridView: ElementFromComponent<typeof GridViewer>;
  setExplorePanelVisible: (boolean) => void;
  setActiveIndex: (number) => void;
  pageHeight: number;
};

const PrototypeTabs: FunctionComponent<Props> = ({
  manifest,
  gridViewerRef,
  mainViewerRef,
  GridView,
  setExplorePanelVisible,
  setActiveIndex,
  pageHeight,
}: Props) => {
  const { isKeyboard } = useContext(AppContext);
  const tabs: TabType[] = [
    {
      id: 'thumbnails',
      tab: function TabWithDisplayName(isActive, isFocused) {
        return (
          <Tab
            isActive={isActive}
            isFocused={isFocused}
            isKeyboard={isKeyboard}
          >
            Thumbnails
          </Tab>
        );
      },
      tabPanel: <>{GridView}</>
    },
    {
      id: 'index',
      tab: function TabWithDisplayName(isActive, isFocused) {
        return (
          <Tab
            isActive={isActive}
            isFocused={isFocused}
            isKeyboard={isKeyboard}
          >
            Index
          </Tab>
        );
      },
      tabPanel: (
        <ScrollContainer height={pageHeight}>
          <StructuresViewer
            setActiveIndex={setActiveIndex}
            mainViewerRef={mainViewerRef}
            manifest={manifest}
            setExplorePanelVisible={setExplorePanelVisible}
          />
        </ScrollContainer>
      ),
    },
  ];

  return (
    <BaseTabs
      tabs={tabs}
      label={'Tabs for explore tools'}
      activeTabIndex={0}
      onTabClick={() => {
        const thumb = gridViewerRef.current?.getElementsByClassName(
          'activeThumbnail'
        )?.[0] as HTMLButtonElement | undefined;
        setTimeout(() => thumb?.scrollIntoView(), 200);
      }}
    />
  );
};

export default PrototypeTabs;
