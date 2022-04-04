import { FC, useState, useEffect } from 'react';
import { Moment } from 'moment';
import { DayNumber } from '@weco/common/model/opening-hours';
import { classNames, font } from '@weco/common/utils/classnames';
import {
  getCalendarRows,
  firstDayOfWeek,
  lastDayOfWeek,
} from './calendar-utils';
import { isRequestableDate } from '../../utils/dates';
import { DatePicker, Header, Table, Td } from './CalendarStyles';

const LEFT = [37, 'ArrowLeft'];
const RIGHT = [39, 'ArrowRight'];
const DOWN = [40, 'ArrowDown'];
const UP = [38, 'ArrowUp'];
const HOME = [36, 'Home'];
const END = [35, 'End'];
const PAGEUP = [33, 'PageUp'];
const PAGEDOWN = [34, 'PageDown'];
const ENTER = [13, 'Enter'];

function newDate(date: Moment, key: number | string): Moment {
  const dates = getCalendarRows(date);
  switch (true) {
    case RIGHT.includes(key): {
      return date.clone().add(1, 'day');
      break;
    }
    case LEFT.includes(key): {
      return date.clone().subtract(1, 'day');
      break;
    }
    case DOWN.includes(key): {
      return date.clone().add(1, 'week');
      break;
    }
    case UP.includes(key): {
      return date.clone().subtract(1, 'week');
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
      return date.clone().subtract(1, 'month');
      break;
    }
    case PAGEDOWN.includes(key): {
      return date.clone().add(1, 'month');
      break;
    }
  }
  return date;
}

function handleKeyDown(
  event: React.KeyboardEvent<HTMLTableElement>,
  date: Moment,
  min: Moment,
  max: Moment,
  setTabbableDate: (date: Moment) => void,
  setChosenDate: (date: string) => void
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
  ].includes(key);
  if (!isKeyOfInterest) return;
  event.preventDefault();
  if (ENTER.includes(key)) {
    // TODO need this logic for onclick too
    // TODO and isRequestable
    // TODO this shouldn't be part of new date
    // set pickup date (and close calendar modal)
    // TODO not if target has disabled prop
    setChosenDate(date.format('DD/MM/YYYY'));
  }
  const moveToDate = newDate(date, key);
  if (moveToDate.isBetween(min, max, 'day', '[]')) {
    // 'day' is for granularity, [] means inclusive (https://momentjscom.readthedocs.io/en/latest/moment/05-query/06-is-between/)
    setTabbableDate(moveToDate);
  } else {
    // TODO let the user know that the can't go to dates outside of the range - aria-live?
    setTabbableDate(date);
  }
}

type Props = {
  min: Moment;
  max: Moment;
  excludedDates: Moment[];
  excludedDays: DayNumber[];
  initialFocusDate: Moment;
  chosenDate: Moment | undefined;
  setChosenDate: (date: string) => void;
};

const Calendar: FC<Props> = ({
  min,
  max,
  excludedDates,
  excludedDays,
  initialFocusDate,
  chosenDate,
  setChosenDate,
}) => {
  const [tabbableDate, setTabbableDate] = useState(initialFocusDate);
  const [previousMonthDisabled, setPreviousMonthDisabled] = useState(true);
  const [nextMonthDisabled, setNextMonthDisabled] = useState(
    tabbableDate.isAfter(max, 'month')
  );
  const rows = tabbableDate ? getCalendarRows(tabbableDate) : [];

  useEffect(() => {
    const currentFocusElement = document.activeElement;
    if (currentFocusElement?.nodeName.toLowerCase() === 'td') {
      // if we're focused on a date, then we want to update the focus when the tabbable date changes
      const currentDateElement = document.querySelector(
        'td[tabindex="0"]'
      ) as HTMLElement;
      currentDateElement?.focus();
    }
  }, [tabbableDate]);

  return (
    <DatePicker id="myDatepicker">
      <Header>
        <h2 id="id-grid-label" className="month-year" aria-live="assertive">
          {`${tabbableDate.format('MMMM')} ${tabbableDate.format('YYYY')}`}
        </h2>
        <div>
          <button
            type="button"
            className="prev-month"
            aria-label="previous month"
            disabled={previousMonthDisabled}
            onClick={() => {
              const newMonth = tabbableDate.clone().subtract(1, 'month');
              setTabbableDate(newMonth);
              setPreviousMonthDisabled(
                newMonth.clone().subtract(1, 'month').isBefore(min, 'month')
              );
              setNextMonthDisabled(
                newMonth.clone().add(1, 'month').isAfter(max, 'month')
              );
            }}
          >
            previous
          </button>
          <button
            type="button"
            className="next-month"
            aria-label="next month"
            disabled={nextMonthDisabled}
            onClick={() => {
              const newMonth = tabbableDate.clone().add(1, 'month');
              setTabbableDate(newMonth);
              setTabbableDate(newMonth);
              setPreviousMonthDisabled(
                newMonth.clone().subtract(1, 'month').isBefore(min, 'month')
              );
              setNextMonthDisabled(
                newMonth.clone().add(1, 'month').isAfter(max, 'month')
              );
            }}
          >
            next
          </button>
        </div>
      </Header>
      {/* // TODO label to match labelledby-id */}
      <Table
        className={classNames({
          [font('hnb', 6)]: true,
        })}
        role="grid"
        aria-labelledby="id-grid-label"
        onKeyDown={event => {
          handleKeyDown(
            event,
            tabbableDate,
            min,
            max,
            setTabbableDate,
            setChosenDate
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
                  const numberOfDaysInMonth = tabbableDate.daysInMonth();
                  const closestTabbableDate =
                    numberOfDaysInMonth >= tabbableDate.date()
                      ? tabbableDate
                      : tabbableDate.clone().set('date', numberOfDaysInMonth);
                  const isDisabled =
                    !date?.date() ||
                    !isRequestableDate({
                      date: date,
                      startDate: min,
                      endDate: max,
                      excludedDates,
                      excludedDays,
                    });
                  return (
                    <Td
                      key={i}
                      tabIndex={
                        closestTabbableDate.format('DD/MM/YYYY') ===
                          date?.format('DD/MM/YYYY') && !isDisabled
                          ? 0
                          : -1
                      }
                      disabled={isDisabled}
                      aria-selected={
                        chosenDate ? chosenDate.isSame(date, 'day') : false
                      }
                    >
                      {date?.date()}
                    </Td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </Table>
    </DatePicker>
  );
};

export default Calendar;
