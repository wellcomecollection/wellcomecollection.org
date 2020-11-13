import styled from 'styled-components';
import {
  useRef,
  useEffect,
  useState,
  Fragment,
  isValidElement,
  FunctionComponent,
  ReactElement,
} from 'react';
import { font, classNames } from '../../../utils/classnames';
import Space from '../styled/Space';
import Control from '../Buttons/Control/Control';

const ControlsWrap = styled.div`
  position: relative;
`;

type ScrollButtonWrapProps = {
  isActive?: boolean;
  isLeft?: boolean;
};

const ScrollButtonWrap = styled.div<ScrollButtonWrapProps>`
  position: absolute;
  z-index: 2;
  top: 50%;
  cursor: pointer;
  pointer-events: ${props => (props.isActive ? 'all' : 'none')};
  opacity: ${props => (props.isActive ? 1 : 0.2)};
  transition: opacity ${props => props.theme.transitionProperties};

  ${props =>
    props.isLeft &&
    `
    left: 0;
    transform: translateX(-50%) translateY(-50%) scale(0.6);
  `}

  ${props =>
    !props.isLeft &&
    `
    right: 0;
    transform: translateX(50%) translateY(-50%) scale(0.6);
  `}

  ${props => props.theme.media.medium`
    transform: ${
      props.isLeft
        ? 'translateX(-50%) translateY(-50%)'
        : 'translateX(50%) translateY(-50%)'
    };
  `}
`;

type ScrollButtonsProps = {
  isActive?: boolean;
};

const ScrollButtons = styled.div<ScrollButtonsProps>`
  display: ${props => (props.isActive ? 'block' : 'none')};
`;

const TableWrap = styled.div`
  position: relative;
  max-width: 100%;
  overflow: scroll;
  background: linear-gradient(to right, white 30%, rgba(255, 255, 255, 0)),
    linear-gradient(to right, rgba(255, 255, 255, 0), white 70%) 0 100%,
    radial-gradient(
      farthest-side at 0% 50%,
      rgba(0, 0, 0, 0.2),
      rgba(0, 0, 0, 0)
    ),
    radial-gradient(
        farthest-side at 100% 50%,
        rgba(0, 0, 0, 0.2),
        rgba(0, 0, 0, 0)
      )
      0 100%;
  background-repeat: no-repeat;
  background-color: white;
  background-size: 40px 100%, 40px 100%, 14px 100%, 14px 100%;
  background-position: 0 0, 100%, 0 0, 100%;
  background-attachment: local, local, scroll, scroll;
`;

const TableTable = styled.table.attrs({
  className: classNames({
    [font('hnl', 5)]: true,
  }),
})`
  width: 100%;
  border-collapse: collapse;
`;

const TableThead = styled.thead`
  text-align: left;
`;

const TableCaption = styled.caption.attrs({
  className: classNames({
    'visually-hidden': true,
  }),
})``;

const TableTbody = styled.tbody``;

const TableTr = styled.tr`
  ${TableTbody} & {
    border-bottom: 1px dotted ${props => props.theme.color('silver')};
  }

  ${TableTbody}.has-row-headers & {
    border-top: 1px dotted ${props => props.theme.color('silver')};
  }
`;

const TableTh = styled(Space).attrs({
  as: 'th',
  v: { size: 's', properties: ['padding-top', 'padding-bottom'] },
  h: { size: 's', properties: ['padding-left', 'padding-right'] },
})`
  font-weight: bold;
  background: ${props => props.theme.color('pumice')};
  white-space: nowrap;

  ${TableTbody}.has-row-headers & {
    background: ${props => props.theme.color('transparent')};
    text-align: left;
  }
`;

const TableTd = styled(Space).attrs({
  as: 'td',
  v: { size: 's', properties: ['padding-top', 'padding-bottom'] },
  h: { size: 's', properties: ['padding-left', 'padding-right'] },
})`
  vertical-align: top;
  white-space: nowrap;
`;

type TableRow = {
  items: (string | ReactElement)[];
  hasHeader: boolean;
};

type Props = {
  rows: (string | ReactElement)[][];
  hasRowHeaders: boolean;
  caption?: string;
};

const TableRow = ({ items, hasHeader }: TableRow) => {
  return (
    <TableTr>
      {items.map((item, index) => (
        <Fragment key={index}>
          {hasHeader && index === 0 ? (
            isValidElement(item) ? (
              <TableTh scope="row">{item}</TableTh>
            ) : (
              <TableTh scope="row" dangerouslySetInnerHTML={{ __html: item }} />
            )
          ) : isValidElement(item) ? (
            <TableTd>{item}</TableTd>
          ) : (
            <TableTd dangerouslySetInnerHTML={{ __html: item }} />
          )}
        </Fragment>
      ))}
    </TableTr>
  );
};

const Table: FunctionComponent<Props> = ({
  rows,
  hasRowHeaders,
  caption,
}: Props): ReactElement<Props> => {
  const leftButtonRef = useRef(null);
  const rightButtonRef = useRef(null);
  const tableRef = useRef(null);
  const controlsRef = useRef(null);
  const tableWrapRef = useRef(null);
  const [isLeftActive, setIsLeftActive] = useState(false);
  const [isRightActive, setIsRightActive] = useState(false);
  const [isOverflown, setIsOverflown] = useState(false);

  const headerRow = hasRowHeaders ? null : rows[0];
  const bodyRows = hasRowHeaders ? rows : rows.slice(1);

  function getUiData() {
    return {
      tableWidth: tableRef && tableRef.current.offsetWidth,
      tableWrapScrollLeft: tableWrapRef && tableWrapRef.current.scrollLeft,
      tableWrapWidth: tableWrapRef && tableWrapRef.current.offsetWidth,
    };
  }

  function checkOverflow() {
    setIsOverflown(
      tableRef &&
        tableWrapRef &&
        tableRef.current.offsetWidth > tableWrapRef.current.offsetWidth
    );
  }

  function updateButtonVisibility() {
    const { tableWidth, tableWrapScrollLeft, tableWrapWidth } = getUiData();

    setIsLeftActive(tableWrapScrollLeft > 0);
    setIsRightActive(tableWrapScrollLeft < tableWidth - tableWrapWidth);
  }

  function scroll(isLeft: boolean) {
    // 1. get current table scroll position
    const { tableWrapScrollLeft } = getUiData();

    // 2. scroll tableWrapper
    const distance = isLeft ? -200 : 200;

    tableWrapRef &&
      tableWrapRef.current.scrollTo({
        top: 0,
        left: tableWrapScrollLeft + distance,
        behavior: 'smooth',
      });

    // 3. update Button Visibility
    updateButtonVisibility();
  }

  function scrollLeft() {
    scroll(true);
  }

  function scrollRight() {
    scroll(false);
  }

  useEffect(() => {
    window.addEventListener('resize', checkOverflow);
    window.addEventListener('resize', updateButtonVisibility);
    tableWrapRef &&
      tableWrapRef.current.addEventListener('scroll', updateButtonVisibility);
    leftButtonRef &&
      leftButtonRef.current.addEventListener('click', scrollLeft);
    rightButtonRef &&
      rightButtonRef.current.addEventListener('click', scrollRight);

    checkOverflow();
    updateButtonVisibility();

    return () => {
      window.removeEventListener('resize', checkOverflow);
      window.removeEventListener('resize', updateButtonVisibility);
      tableWrapRef &&
        tableWrapRef.current.removeEventListener(
          'scroll',
          updateButtonVisibility
        );
      leftButtonRef &&
        leftButtonRef.current.removeEventListener('click', scrollLeft);
      rightButtonRef &&
        rightButtonRef.current.removeEventListener('click', scrollRight);
    };
  }, []);

  return (
    <>
      {caption && (
        <h2 className="h2" aria-hidden="true">
          {caption}
        </h2>
      )}
      <ControlsWrap ref={controlsRef}>
        <ScrollButtons isActive={isOverflown}>
          <ScrollButtonWrap isLeft isActive={isLeftActive} ref={leftButtonRef}>
            <Control
              icon="arrow"
              extraClasses="icon--180 bg-white font-green border-width-2 border-color-green"
            />
          </ScrollButtonWrap>
          <ScrollButtonWrap isActive={isRightActive} ref={rightButtonRef}>
            <Control
              icon="arrow"
              extraClasses="bg-white font-green border-width-2 border-color-green"
            />
          </ScrollButtonWrap>
        </ScrollButtons>
        <TableWrap ref={tableWrapRef}>
          <TableTable id="table" ref={tableRef}>
            {caption && <TableCaption>{caption}</TableCaption>}
            {headerRow && (
              <TableThead>
                <TableTr>
                  {headerRow.map((item, index) =>
                    isValidElement ? (
                      <TableTh key={index} scope="col">
                        {item}
                      </TableTh>
                    ) : (
                      <TableTh
                        key={index}
                        scope="col"
                        dangerouslySetInnerHTML={{ __html: item }}
                      />
                    )
                  )}
                </TableTr>
              </TableThead>
            )}
            <TableTbody
              className={classNames({
                'has-row-headers': hasRowHeaders,
              })}
            >
              {bodyRows.map((row, index) => (
                <TableRow key={index} items={row} hasHeader={hasRowHeaders} />
              ))}
            </TableTbody>
          </TableTable>
        </TableWrap>
      </ControlsWrap>
    </>
  );
};

export default Table;
