import { FC, useState, useEffect, useRef, useContext } from 'react';
import { AppContext } from '@weco/common/views/components/AppContext/AppContext';
import { DayNumber } from '@weco/common/model/opening-hours';
import { classNames, font } from '@weco/common/utils/classnames';
import {
  getCalendarRows,
  firstDayOfWeek,
  lastDayOfWeek,
  addMonths,
  addWeeks,
  countDaysInMonth,
} from './calendar-utils';
import { isRequestableDate } from '../../utils/dates';
import {
  DatePicker,
  Header,
  Table,
  Td,
  Number,
  CalendarButton,
  Message,
} from './CalendarStyles';
import Icon from '@weco/common/views/components/Icon/Icon';
import { chevron } from '@weco/common/icons';
import { calendarInstructions } from '@weco/common/data/microcopy';
import {
  addDays,
  isSameDay,
  isSameDayOrBefore,
  isSameMonth,
} from '@weco/common/utils/dates';

import {
  formatDay,
  formatLondon,
  formatYear,
} from '@weco/common/utils/format-date';

const LEFT = [37, 'ArrowLeft'];
const RIGHT = [39, 'ArrowRight'];
const DOWN = [40, 'ArrowDown'];
const UP = [38, 'ArrowUp'];
const HOME = [36, 'Home'];
const END = [35, 'End'];
const PAGEUP = [33, 'PageUp'];
const PAGEDOWN = [34, 'PageDown'];
const ENTER = [13, 'Enter'];
const SPACE = [32, ' '];

// e.g. "September"
export function month(d: Date): string {
  return formatLondon(d, { month: 'long' });
}

// e.g. 1st, 2nd, 3rd
export function ordinal(d: Date): string {
  const day = d.getDate();
  console.assert(day <= 31);

  if (day === 1 || day === 21 || day === 31) {
    return `${day}st`;
  } else if (day === 2 || day === 22) {
    return `${day}nd`;
  } else if (day === 3 || day === 23) {
    return `${day}rd`;
  } else {
    return `${day}th`;
  }
}

// e.g. 21/09/2022
export function formatWithSlashes(d: Date): string {
  const days = d.getUTCDate().toString().padStart(2, '0');
  const months = (d.getUTCMonth() + 1).toString().padStart(2, '0');
  const years = d.getUTCFullYear().toString();

  return `${days}/${months}/${years}`;
}

function newDate(date: Date, key: number | string): Date {
  const dates = getCalendarRows(date);
  switch (true) {
    case RIGHT.includes(key): {
      return addDays(date, 1);
      break;
    }
    case LEFT.includes(key): {
      return addDays(date, -1);
      break;
    }
    case DOWN.includes(key): {
      return addWeeks(date, 1);
      break;
    }
    case UP.includes(key): {
      return addWeeks(date, -1);
      break;
    }
    case HOME.includes(key): {
      return firstDayOfWeek(date, dates);
      break;
    }
    case END.includes(key): {
      return lastDayOfWeek(date, dates);
      break;
    }
    case PAGEUP.includes(key): {
      return addMonths(date, -1);
      break;
    }
    case PAGEDOWN.includes(key): {
      return addMonths(date, 1);
      break;
    }
  }
  return date;
}

function handleKeyDown(
  event: React.KeyboardEvent<HTMLTableElement>,
  date: Date,
  min: Date,
  max: Date,
  excludedDates: Date[],
  excludedDays: DayNumber[],
  setTabbableDate: (date: Date) => void,
  setChosenDate: (date: string) => void,
  setShowModal: (boolean: boolean) => void,
  setUpdateFocus: (boolean: boolean) => void,
  setMessage: (string: string) => void
) {
  const key = event.key || event.keyCode;
  const isKeyOfInterest = [
    ...LEFT,
    ...RIGHT,
    ...DOWN,
    ...UP,
    ...HOME,
    ...END,
    ...PAGEUP,
    ...PAGEDOWN,
    ...ENTER,
    ...SPACE,
  ].includes(key);
  if (!isKeyOfInterest) return;
  event.preventDefault();
  if (ENTER.includes(key) || SPACE.includes(key)) {
    if (
      isRequestableDate({
        date,
        startDate: min,
        endDate: max,
        excludedDates,
        excludedDays,
      })
    ) {
      setChosenDate(formatWithSlashes(date));
      setShowModal(false);
    } else {
      // e.g. The 1st September is not available
      setMessage(`The ${ordinal(date)} ${month(date)} is not available.`);
    }
  } else {
    const moveToDate = newDate(date, key);
    setUpdateFocus(true);
    if (
      isSameDayOrBefore(min, moveToDate) &&
      isSameDayOrBefore(moveToDate, max)
    ) {
      // 'day' is for granularity, [] means inclusive (https://momentjscom.readthedocs.io/en/latest/moment/05-query/06-is-between/)
      setTabbableDate(moveToDate);
      setMessage('');
    } else {
      setTabbableDate(date);
      // e.g. The 1st September is outside of the available range
      setMessage(
        `The ${ordinal(date)} ${month(date)} is outside of the available range.`
      );
    }
  }
}

type Props = {
  min: Date;
  max: Date;
  excludedDates: Date[];
  excludedDays: DayNumber[];
  initialFocusDate: Date;
  chosenDate: Date | undefined;
  setChosenDate: (date: string) => void;
  showModal: boolean;
  setShowModal: (boolean: boolean) => void;
};

const Calendar: FC<Props> = ({
  min,
  max,
  excludedDates,
  excludedDays,
  initialFocusDate,
  chosenDate,
  setChosenDate,
  showModal,
  setShowModal,
}) => {
  const [tabbableDate, setTabbableDate] = useState(initialFocusDate);
  const [updateFocus, setUpdateFocus] = useState(true);
  const [previousMonthDisabled, setPreviousMonthDisabled] = useState(true);
  const [nextMonthDisabled, setNextMonthDisabled] = useState(
    isSameMonth(min, max)
  );
  const [message, setMessage] = useState('');
  const rows = tabbableDate ? getCalendarRows(tabbableDate) : [];
  const tabbableDateRef = useRef<HTMLTableCellElement>(null);
  const numberOfDaysInMonth = countDaysInMonth(tabbableDate);
  const closestTabbableDate =
    numberOfDaysInMonth >= tabbableDate.getDate()
      ? tabbableDate
      : new Date(
          tabbableDate.getFullYear(),
          tabbableDate.getMonth(),
          numberOfDaysInMonth
        );
  const { isKeyboard } = useContext(AppContext);

  useEffect(() => {
    if (updateFocus) {
      tabbableDateRef.current?.focus();
    }
  }, [tabbableDate]);

  useEffect(() => {
    if (tabbableDate && showModal) {
      tabbableDateRef.current?.focus();
    }
  }, [showModal]);

  return (
    <DatePicker id="myDatepicker">
      <Header>
        {/* e.g. September 2022 */}
        <h2 id="id-grid-label" className="month-year" aria-live="assertive">
          {month(tabbableDate)} {formatYear(tabbableDate)}
        </h2>
        <div>
          <CalendarButton
            type="button"
            className="prev-month"
            aria-label="previous month"
            disabled={previousMonthDisabled}
            onClick={() => {
              setUpdateFocus(false); // if we are navigating the calendar by month controls, we don't want to update the focus
              const newMonth = addMonths(tabbableDate, -1);
              if (newMonth < min && !isSameDay(newMonth, min)) {
                setTabbableDate(min);
              } else {
                setTabbableDate(newMonth);
              }
              setPreviousMonthDisabled(
                addMonths(newMonth, -1) < min &&
                  !isSameMonth(addMonths(newMonth, -1), min)
              );
              setNextMonthDisabled(
                addMonths(newMonth, 1) > max &&
                  !isSameMonth(addMonths(newMonth, -1), max)
              );
            }}
          >
            <Icon
              matchText={true}
              color="currentColor"
              icon={chevron}
              rotate={90}
            />
            <span className="visually-hidden">previous month</span>
          </CalendarButton>
          <CalendarButton
            type="button"
            className="next-month"
            aria-label="next month"
            disabled={nextMonthDisabled}
            onClick={() => {
              setUpdateFocus(false); // if we are navigating the calendar by month controls, we don't want to update the focus
              const newMonth = addMonths(tabbableDate, 1);
              if (newMonth > max && !isSameDay(newMonth, max)) {
                setTabbableDate(max);
              } else {
                setTabbableDate(newMonth);
              }
              setPreviousMonthDisabled(
                addMonths(newMonth, -1) < min &&
                  !isSameMonth(addMonths(newMonth, -1), min)
              );
              setNextMonthDisabled(
                addMonths(newMonth, 1) > max &&
                  !isSameMonth(addMonths(newMonth, -1), max)
              );
            }}
          >
            <Icon
              matchText={true}
              color="currentColor"
              icon={chevron}
              rotate={270}
            />
            <span className="visually-hidden">next month</span>
          </CalendarButton>
        </div>
      </Header>
      {isKeyboard && <Message>{calendarInstructions}</Message>}
      <Table
        className={classNames({
          [font('intb', 6)]: true,
        })}
        role="grid"
        aria-labelledby="id-grid-label"
        onKeyDown={event => {
          handleKeyDown(
            event,
            tabbableDate,
            min,
            max,
            excludedDates,
            excludedDays,
            setTabbableDate,
            setChosenDate,
            setShowModal,
            setUpdateFocus,
            setMessage
          );
        }}
      >
        <thead>
          <tr>
            <th scope="col" abbr="Monday">
              M
            </th>
            <th scope="col" abbr="Tuesday">
              T
            </th>
            <th scope="col" abbr="Wednesday">
              W
            </th>
            <th scope="col" abbr="Thursday">
              T
            </th>
            <th scope="col" abbr="Friday">
              F
            </th>
            <th scope="col" abbr="Saturday">
              S
            </th>
            <th scope="col" abbr="Sunday">
              S
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => {
            return (
              <tr key={i}>
                {row.map((date, i) => {
                  const isDisabled =
                    !date?.getDate() ||
                    !isRequestableDate({
                      date,
                      startDate: min,
                      endDate: max,
                      excludedDates,
                      excludedDays,
                    });
                  const isTabbable =
                    date && isSameDay(closestTabbableDate, date);
                  return (
                    <Td
                      isKeyboard={isKeyboard}
                      key={i}
                      onClick={() => {
                        if (!isDisabled && date) {
                          setChosenDate(formatWithSlashes(date));
                          setUpdateFocus(true); // if we are navigating the calendar by day controls, we want to update the focus
                          setTabbableDate(date);
                          setShowModal(false);
                          setMessage('');
                        } else {
                          // e.g. The 1st September is not available
                          setMessage(
                            `The ${ordinal(date)} ${month(
                              date
                            )} is not available`
                          );
                        }
                      }}
                      tabIndex={isTabbable ? 0 : -1}
                      ref={isTabbable ? tabbableDateRef : null}
                      aria-disabled={isDisabled}
                      aria-selected={
                        chosenDate ? isSameDay(chosenDate, date) : false
                      }
                    >
                      {isDisabled ? (
                        // e.g. Not available, 1st September
                        <span
                          aria-label={`Not available, ${ordinal(date)} ${month(
                            date
                          )}`}
                        >
                          <Number>{date.getDate()}</Number>
                        </span>
                      ) : (
                        // e.g. Thursday 1st September
                        <span
                          aria-label={`${formatDay(date)} ${ordinal(
                            date
                          )} ${month(date)}`}
                        >
                          <Number>{date.getDate()}</Number>
                        </span>
                      )}
                    </Td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </Table>
      <Message aria-live="assertive">{message}</Message>
    </DatePicker>
  );
};

export default Calendar;
