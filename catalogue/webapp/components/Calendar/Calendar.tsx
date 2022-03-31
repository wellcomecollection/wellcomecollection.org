import { FC, useState } from 'react';
import { DatePicker, Header, Table, Td } from './CalendarStyles';
import { getCalendarRows } from './calendar-utils';
import { isRequestableDate } from '../../utils/dates';
import { londonFromFormat } from '@weco/common/utils/format-date';
import { Moment } from 'moment';

const LEFT = [37, 'ArrowLeft'];
const RIGHT = [39, 'ArrowRight'];
const DOWN = [40, 'ArrowDown'];
const UP = [38, 'ArrowUp'];
const HOME = [36, 'Home'];
const END = [35, 'End'];
const ESCAPE = [27, 'Escape'];
const ENTER = [13, 'Enter'];

function handleKeyDown(event, date: Moment, setTabbableDate, setDisplayMonth) {
  event.stopPropagation();
  const key = event.key || event.keyCode;
  const isKeyOfInterest = [
    ...LEFT,
    ...RIGHT,
    ...DOWN,
    ...UP,
    ...HOME,
    ...END,
    ...ESCAPE,
    ...ENTER,
  ].includes(key);
  if (!isKeyOfInterest) return;
  event.preventDefault();
  switch (true) {
    // TODO prevent going past to and from
    case RIGHT.includes(key): {
      const newDate = date.clone().add(1, 'day');
      setTabbableDate(newDate);
      setDisplayMonth(newDate);
      break;
    }
    case LEFT.includes(key): {
      const newDate = date.clone().subtract(1, 'day');
      setTabbableDate(newDate);
      setDisplayMonth(newDate);
      break;
    }
    case DOWN.includes(key): {
      const newDate = date.clone().add(1, 'week');
      setTabbableDate(newDate);
      setDisplayMonth(newDate);
      break;
    }
    case UP.includes(key): {
      const newDate = date.clone().subtract(1, 'week');
      setTabbableDate(newDate);
      setDisplayMonth(newDate);
      break;
    }

    // TODO add functionality for the following keys:
    case HOME.includes(key): {
      // first day of week
      console.log('HOME');
      break;
    }
    case END.includes(key): {
      // last day of week
      console.log('END');
      break;
    }
    case ENTER.includes(key): {
      // set pickup date (and close calendar modal)
      console.log('ENTER');
      break;
    }
    case ESCAPE.includes(key): {
      // close calendar modal
      console.log('ESCAPE');
      break;
    }
  }
}

type Props = {
  min: Moment;
  max: Moment;
  // excludedDates: Moment[];
  // excludedDays: DayNumber[];
  initialFocusDate: Moment;
  chosenDate: Moment | undefined;
  // setChosenDate: (date: Moment) => void;
};

const Calendar: FC<Props> = ({
  min,
  max,
  initialFocusDate,
  chosenDate,
  // setChosenDate,
}) => {
  const [displayMonth, setDisplayMonth] = useState(min);
  const [tabableDate, setTabableDate] = useState(initialFocusDate);
  const [previousMonthDisabled, setPreviousMonthDisabled] = useState(true);
  const [nextMonthDisabled, setNextMonthDisabled] = useState(
    displayMonth.isAfter(max, 'month')
  );
  const rows = displayMonth ? getCalendarRows(displayMonth) : [];

  return (
    <DatePicker id="myDatepicker">
      <Header>
        <h2 id="id-grid-label" className="month-year" aria-live="assertive">
          {`${displayMonth.format('MMMM')} ${displayMonth.format('YYYY')}`}
        </h2>
        <div>
          <button
            type="button"
            className="prev-month"
            aria-label="previous month"
            disabled={previousMonthDisabled}
            onClick={() => {
              const newMonth = displayMonth.clone().subtract(1, 'month');
              setTabableDate(newMonth); // TODO don't do these separately, - use single value? // or desiredTabbableDate
              setDisplayMonth(newMonth);
              setPreviousMonthDisabled(
                newMonth.clone().subtract(1, 'month').isBefore(min, 'month')
              );
              setNextMonthDisabled(
                newMonth.clone().add(1, 'month').isAfter(max, 'month')
              );
            }}
          >
            {/* TODO make accessible */}prev
          </button>
          <button
            type="button"
            className="next-month"
            aria-label="next month"
            disabled={nextMonthDisabled}
            onClick={() => {
              const newMonth = displayMonth.clone().add(1, 'month');
              setTabableDate(newMonth);
              setDisplayMonth(newMonth);
              setPreviousMonthDisabled(
                newMonth.clone().subtract(1, 'month').isBefore(min, 'month')
              );
              setNextMonthDisabled(
                newMonth.clone().add(1, 'month').isAfter(max, 'month')
              );
            }}
          >
            {/* TODO make accessible */}next
          </button>
        </div>
      </Header>
      {/* // TODO label to match labelledby-id */}
      <Table
        role="grid"
        aria-labelledby="id-grid-label"
        onKeyDown={event => {
          handleKeyDown(event, tabableDate, setTabableDate, setDisplayMonth);
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
                  const numberOfDaysInMonth = displayMonth.daysInMonth();
                  const closestTabableDate =
                    numberOfDaysInMonth >= tabableDate.date()
                      ? tabableDate.date()
                      : numberOfDaysInMonth;
                  // console.log('tab', tabableDate.date());
                  // console.log('closest', closestTabableDate);
                  const isDisabled =
                    !date?.date() ||
                    !isRequestableDate({
                      date: date,
                      startDate: min,
                      endDate: max,
                      excludedDates: [
                        londonFromFormat('11-03-2022', 'DD-MM-YYYY'),
                        londonFromFormat('11-05-2022', 'DD-MM-YYYY'),
                      ], // TODO pass these in
                      excludedDays: [0], // TODO pass these in
                    });
                  // TODO if there isn't a selected date use nextAvaliableDate
                  return (
                    <Td
                      key={i}
                      tabIndex={
                        closestTabableDate === date?.get('date') ? 0 : -1
                      }
                      disabled={isDisabled}
                      aria-selected={
                        !(
                          !chosenDate ||
                          (chosenDate && chosenDate.isSame(date, 'day'))
                        )
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
