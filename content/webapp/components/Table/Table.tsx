// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
// TODO: To fix when we create a new Storybook - this component could actually be deleted
// But needs to be replaced in Storybook instances
// https://github.com/wellcomecollection/wellcomecollection.org/issues/9158
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
import { font } from '@weco/common/utils/classnames';
import Space from '@weco/common/views/components/styled/Space';
import Rotator from '@weco/common/views/components/styled/Rotator';
import Control from '@weco/content/components/Control';
import { arrow } from '@weco/common/icons';

const ControlsWrap = styled.div`
  position: relative;
`;

type ScrollButtonWrapProps = {
  $isActive?: boolean;
  $isLeft?: boolean;
};

const ScrollButtonWrap = styled.div<ScrollButtonWrapProps>`
  position: absolute;
  z-index: 2;
  top: 50%;
  cursor: pointer;
  pointer-events: ${props => (props.$isActive ? 'all' : 'none')};
  opacity: ${props => (props.$isActive ? 1 : 0.2)};
  transition: opacity ${props => props.theme.transitionProperties};

  ${props =>
    props.$isLeft &&
    `
    left: 0;
    transform: translateX(-50%) translateY(-50%) scale(0.6);
  `}

  ${props =>
    !props.$isLeft &&
    `
    right: 0;
    transform: translateX(50%) translateY(-50%) scale(0.6);
  `}

  ${props => props.theme.media('medium')`
    transform: ${
      props.$isLeft
        ? 'translateX(-50%) translateY(-50%)'
        : 'translateX(50%) translateY(-50%)'
    };
  `}
`;

type ScrollButtonsProps = {
  $isActive?: boolean;
};

const ScrollButtons = styled.div<ScrollButtonsProps>`
  display: ${props => (props.$isActive ? 'block' : 'none')};
`;

const TableWrap = styled.div`
  position: relative;
  max-width: 100%;
  overflow: scroll;
  background:
    linear-gradient(to right, white 30%, rgba(255, 255, 255, 0)),
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
  background-size:
    40px 100%,
    40px 100%,
    14px 100%,
    14px 100%;
  background-position:
    0 0,
    100%,
    0 0,
    100%;
  background-attachment: local, local, scroll, scroll;
`;

const TableTable = styled.table.attrs({
  className: font('intr', 5),
})`
  width: 100%;
  border-collapse: collapse;
`;

const TableThead = styled.thead`
  text-align: left;
`;

const TableCaption = styled.caption.attrs({
  className: 'visually-hidden',
})``;

const TableTbody = styled.tbody``;

const TableTr = styled.tr<{ $withBorder?: boolean }>`
  ${TableTbody} & {
    border-bottom: ${props =>
      props.$withBorder
        ? `1px dotted
      ${props => props.theme.color('neutral.500')}`
        : 'none'};
  }

  ${TableTbody}.has-row-headers & {
    border-top: ${props =>
      props.$withBorder
        ? `1px dotted
      ${props => props.theme.color('neutral.500')}`
        : 'none'};
  }
`;

const TableTh = styled(Space).attrs<{ $plain: boolean }>({
  as: 'th',
  $v: { size: 's', properties: ['padding-top', 'padding-bottom'] },
  $h: { size: 's', properties: ['padding-left', 'padding-right'] },
})`
  font-weight: bold;
  background: ${props =>
    props.$plain ? 'transparent' : props.theme.color('warmNeutral.400')};
  white-space: nowrap;

  ${TableTbody}.has-row-headers & {
    background: transparent;
    text-align: left;
  }
`;

const TableTd = styled(Space).attrs<{ $vAlign?: string }>({
  as: 'td',
  $v: { size: 's', properties: ['padding-top', 'padding-bottom'] },
  $h: { size: 's', properties: ['padding-left', 'padding-right'] },
})`
  vertical-align: ${props => props.$vAlign};
  white-space: nowrap;
  height: 53px;
`;

export type Props = {
  rows: (string | ReactElement)[][];
  hasRowHeaders?: boolean;
  caption?: string;
  vAlign?: 'top' | 'middle' | 'bottom';
  plain?: boolean;
  withBorder?: boolean;
};

type TableRowProps = {
  items: (string | ReactElement)[];
  vAlign: 'top' | 'middle' | 'bottom';
  withBorder: boolean;
  hasHeader?: boolean;
  plain?: boolean;
};

const TableRow = ({
  items,
  hasHeader,
  vAlign,
  withBorder,
  plain,
}: TableRowProps) => {
  return (
    <TableTr $withBorder={withBorder}>
      {items.map((item, index) => (
        <Fragment key={index}>
          {hasHeader && index === 0 ? (
            isValidElement(item) ? (
              <TableTh scope="row" $plain={plain}>
                {item}
              </TableTh>
            ) : (
              <TableTh
                scope="row"
                $plain={plain}
                dangerouslySetInnerHTML={{ __html: item }}
              />
            )
          ) : isValidElement(item) ? (
            <TableTd $vAlign={vAlign}>{item}</TableTd>
          ) : (
            <TableTd
              $vAlign={vAlign}
              dangerouslySetInnerHTML={{ __html: item }}
            />
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
  vAlign = 'top',
  plain = false,
  withBorder = true,
}: Props): ReactElement<Props> => {
  const leftButtonRef = useRef(null);
  const rightButtonRef = useRef(null);
  const tableRef = useRef<HTMLTableElement>(null);
  const controlsRef = useRef(null);
  const tableWrapRef = useRef<HTMLDivElement>(null);
  const [isLeftActive, setIsLeftActive] = useState(false);
  const [isRightActive, setIsRightActive] = useState(false);
  const [isOverflown, setIsOverflown] = useState(false);

  const headerRow = hasRowHeaders ? null : rows[0];
  const bodyRows = hasRowHeaders ? rows : rows.slice(1);

  function getUiData() {
    return {
      tableWidth: tableRef?.current && tableRef.current.offsetWidth,
      tableWrapScrollLeft:
        tableWrapRef?.current && tableWrapRef.current.scrollLeft,
      tableWrapWidth: tableWrapRef?.current && tableWrapRef.current.offsetWidth,
    };
  }

  function checkOverflow() {
    setIsOverflown(
      (tableRef?.current &&
        tableWrapRef?.current &&
        tableRef.current.offsetWidth > tableWrapRef.current.offsetWidth) ||
        false
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

    tableWrapRef?.current &&
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
        <h2 className={font('wb', 3)} aria-hidden="true">
          {caption}
        </h2>
      )}
      <ControlsWrap ref={controlsRef}>
        <ScrollButtons $isActive={isOverflown}>
          <ScrollButtonWrap
            ref={leftButtonRef}
            $isLeft
            $isActive={isLeftActive}
          >
            <Rotator $rotate={180}>
              <Control colorScheme="light" icon={arrow} text="" />
            </Rotator>
          </ScrollButtonWrap>
          <ScrollButtonWrap $isActive={isRightActive} ref={rightButtonRef}>
            <Control colorScheme="light" icon={arrow} text="" />
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
                      <TableTh key={index} $plain={plain} scope="col">
                        {item}
                      </TableTh>
                    ) : (
                      <TableTh
                        key={index}
                        scope="col"
                        $plain={plain}
                        dangerouslySetInnerHTML={{ __html: item }}
                      />
                    )
                  )}
                </TableTr>
              </TableThead>
            )}
            <TableTbody className="has-row-headers">
              {bodyRows.map((row, index) => (
                <TableRow
                  key={index}
                  items={row}
                  plain={plain}
                  hasHeader={hasRowHeaders}
                  vAlign={vAlign}
                  withBorder={withBorder}
                />
              ))}
            </TableTbody>
          </TableTable>
        </TableWrap>
      </ControlsWrap>
    </>
  );
};

export default Table;
