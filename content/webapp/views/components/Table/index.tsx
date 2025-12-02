import {
  Fragment,
  FunctionComponent,
  isValidElement,
  ReactElement,
  useEffect,
  useRef,
  useState,
} from 'react';

import { arrow } from '@weco/common/icons';
import { font } from '@weco/common/utils/classnames';
import Control from '@weco/common/views/components/Control';
import Rotator from '@weco/common/views/components/styled/Rotator';

import {
  ControlsWrap,
  ScrollButtons,
  ScrollButtonWrap,
  TableCaption,
  TableTable,
  TableTbody,
  TableTd,
  TableTh,
  TableThead,
  TableTr,
  TableWrap,
} from './Table.styles';

export type Props = {
  rows: (string | ReactElement)[][];
  hasRowHeaders?: boolean;
  caption?: string;
  vAlign?: 'top' | 'middle' | 'bottom';
  plain?: boolean;
  withBorder?: boolean;
  hasSmallerCopy?: boolean;
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
  hasSmallerCopy = false,
}: Props): ReactElement<Props> => {
  const leftButtonRef = useRef<HTMLDivElement>(null);
  const rightButtonRef = useRef<HTMLDivElement>(null);
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
        (tableWrapRef?.current && tableWrapRef.current.scrollLeft) || 0,
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

    if (tableWidth && tableWrapWidth) {
      setIsLeftActive(tableWrapScrollLeft > 0);
      setIsRightActive(tableWrapScrollLeft < tableWidth - tableWrapWidth);
    }
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

    tableWrapRef?.current &&
      tableWrapRef.current.addEventListener('scroll', updateButtonVisibility);
    leftButtonRef?.current &&
      leftButtonRef.current.addEventListener('click', scrollLeft);
    rightButtonRef?.current &&
      rightButtonRef.current.addEventListener('click', scrollRight);

    checkOverflow();
    updateButtonVisibility();

    return () => {
      window.removeEventListener('resize', checkOverflow);
      window.removeEventListener('resize', updateButtonVisibility);
      tableWrapRef?.current &&
        tableWrapRef.current.removeEventListener(
          'scroll',
          updateButtonVisibility
        );
      leftButtonRef?.current &&
        leftButtonRef.current.removeEventListener('click', scrollLeft);
      rightButtonRef?.current &&
        rightButtonRef.current.removeEventListener('click', scrollRight);
    };
  }, []);

  return (
    <div data-component="table">
      {caption && (
        <h2 className={font('brand', 1)} aria-hidden="true">
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
          <TableTable
            id="table"
            ref={tableRef}
            $hasSmallerCopy={hasSmallerCopy}
          >
            {caption && <TableCaption>{caption}</TableCaption>}

            {headerRow && (
              <TableThead>
                <TableTr>
                  {headerRow.map((item, index) =>
                    isValidElement(item) ? (
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
    </div>
  );
};

export default Table;
