import { FC, useState, useEffect, useRef, useContext } from 'react';
import { AppContext } from '@weco/common/views/components/AppContext/AppContext';
import { Moment } from 'moment';
import { DayNumber } from '@weco/common/model/opening-hours';
import { classNames, font } from '@weco/common/utils/classnames';
import {
  getCalendarRows,
  firstDayOfWeek,
  lastDayOfWeek,
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
  excludedDates: Moment[],
  excludedDays: DayNumber[],
  setTabbableDate: (date: Moment) => void,
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
        date: date.toDate(),
        startDate: min.toDate(),
        endDate: max.toDate(),
        excludedDates: excludedDates.map(d => d.toDate()),
        excludedDays,
      })
    ) {
      setChosenDate(date.format('DD/MM/YYYY'));
      setShowModal(false);
    } else {
      setMessage(`The ${date.format('Do MMMM')} is not available.`);
    }
  } else {
    const moveToDate = newDate(date, key);
    setUpdateFocus(true);
    if (moveToDate.isBetween(min, max, 'day', '[]')) {
      // 'day' is for granularity, [] means inclusive (https://momentjscom.readthedocs.io/en/latest/moment/05-query/06-is-between/)
      setTabbableDate(moveToDate);
      setMessage('');
    } else {
      setTabbableDate(date);
      setMessage(
        `The ${moveToDate.format('Do MMMM')} is outside of the available range.`
      );
    }
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
    max.isSame(min, 'month')
  );
  const [message, setMessage] = useState('');
  const rows = tabbableDate ? getCalendarRows(tabbableDate) : [];
  const tabbableDateRef = useRef<HTMLTableCellElement>(null);
  const numberOfDaysInMonth = tabbableDate.daysInMonth();
  const closestTabbableDate =
    numberOfDaysInMonth >= tabbableDate.date()
      ? tabbableDate
      : tabbableDate.clone().set('date', numberOfDaysInMonth);
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
        <h2 id="id-grid-label" className="month-year" aria-live="assertive">
          {`${tabbableDate.format('MMMM')} ${tabbableDate.format('YYYY')}`}
        </h2>
        <div>
          <CalendarButton
            type="button"
            className="prev-month"
            aria-label="previous month"
            disabled={previousMonthDisabled}
            onClick={() => {
              setUpdateFocus(false); // if we are navigating the calendar by month controls, we don't want to update the focus
              const newMonth = tabbableDate.clone().subtract(1, 'month');
              if (newMonth.isBefore(min, 'day')) {
                setTabbableDate(min);
              } else {
                setTabbableDate(newMonth);
              }
              setPreviousMonthDisabled(
                newMonth.clone().subtract(1, 'month').isBefore(min, 'month')
              );
              setNextMonthDisabled(
                newMonth.clone().add(1, 'month').isAfter(max, 'month')
              );
            }}
          >
            <Icon
              matchText={true}
              color={'currentColor'}
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
              const newMonth = tabbableDate.clone().add(1, 'month');
              if (newMonth.isAfter(max, 'day')) {
                setTabbableDate(max);
              } else {
                setTabbableDate(newMonth);
              }
              setPreviousMonthDisabled(
                newMonth.clone().subtract(1, 'month').isBefore(min, 'month')
              );
              setNextMonthDisabled(
                newMonth.clone().add(1, 'month').isAfter(max, 'month')
              );
            }}
          >
            <Icon
              matchText={true}
              color={'currentColor'}
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
                    !date?.date() ||
                    !isRequestableDate({
                      date: date.toDate(),
                      startDate: min.toDate(),
                      endDate: max.toDate(),
                      excludedDates: excludedDates.map(d => d.toDate()),
                      excludedDays,
                    });
                  const isTabbable =
                    closestTabbableDate.format('DD/MM/YYYY') ===
                    date?.format('DD/MM/YYYY');
                  return (
                    <Td
                      isKeyboard={isKeyboard}
                      key={i}
                      onClick={() => {
                        if (!isDisabled && date) {
                          setChosenDate(date.format('DD/MM/YYYY'));
                          setUpdateFocus(true); // if we are navigating the calendar by day controls, we want to update the focus
                          setTabbableDate(date);
                          setShowModal(false);
                          setMessage('');
                        } else {
                          setMessage(
                            `The ${date.format('Do MMMM')} is not available`
                          );
                        }
                      }}
                      tabIndex={isTabbable ? 0 : -1}
                      ref={isTabbable ? tabbableDateRef : null}
                      aria-disabled={isDisabled}
                      aria-selected={
                        chosenDate ? chosenDate.isSame(date, 'day') : false
                      }
                    >
                      {isDisabled ? (
                        <span
                          aria-label={`Not available, ${date?.format(
                            'Do MMMM'
                          )}`}
                        >
                          <Number>{date?.date()}</Number>
                        </span>
                      ) : (
                        <span aria-label={date?.format('dddd Do MMMM')}>
                          <Number>{date?.date()}</Number>
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
