import { FC, useState, useContext } from 'react';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import { london } from '@weco/common/utils/format-date';
import 'react-day-picker/lib/style.css';
import LocaleUtils from 'react-day-picker/moment';
import styled from 'styled-components';
import AlignFont from '@weco/common/views/components/styled/AlignFont';
import Icon from '@weco/common/views/components/Icon/Icon';
import { chevron, calendar } from '@weco/common/icons';
import { classNames, font } from '@weco/common/utils/classnames';
import { fontFamilyMixin } from '@weco/common/views/themes/typography';
// import { getExceptionalOpeningDates } from '@weco/common/services/prismic/opening-times';
// $FlowFixMe (tsx)
import OpeningTimesContext from '@weco/common/views/components/OpeningTimesContext/OpeningTimesContext';
import { collectionVenueId } from '@weco/common/services/prismic/hardcoded-id';
import Day from '@weco/common/model/opening-hours';

const { formatDate, parseDate } = LocaleUtils;

type DayPickerWrapperProps = {
  isPrevMonthDisabled: boolean;
  isNextMonthDisabled: boolean;
};

const DayPickerWrapper = styled.div<DayPickerWrapperProps>`
  .DayPicker-Day {
    line-height: 1;
  }

  .DayPickerInput-Overlay {
    &:before {
      content: '';
      position: absolute;
      top: 0;
      left: 50%;
      width: 0;
      height: 0;
      border-left: 10px solid transparent;
      border-right: 10px solid transparent;
      border-top: 10px solid ${props => props.theme.color('white')};
      transform: translateX(-50%) rotate(180deg) translateY(100%);
    }
  }

  .DayPicker-Day--disabled,
  .DayPicker-Day--today {
    color: ${props => props.theme.color('marble')};
  }

  .DayPicker-Day--today {
    font-weight: inherit;
  }

  .DayPicker-Day--selected:not(.DayPicker-Day--disabled):not(.DayPicker-Day--outside) {
    background-color: ${props => props.theme.color('yellow')};
    color: ${props => props.theme.color('black')};
  }

  .DayPicker:not(.DayPicker--interactionDisabled)
    .DayPicker-Day:not(.DayPicker-Day--disabled):not(.DayPicker-Day--selected):not(.DayPicker-Day--outside):hover {
    background-color: ${props => props.theme.color('yellow', 'light')};
  }

  .DayPicker-NavBar {
    position: absolute;
    right: 1rem;
    top: 20px;

    button:nth-of-type(1) {
      visibility: ${props =>
        props.isPrevMonthDisabled ? 'hidden' : 'visible'};
      pointer-events: ${props => (props.isPrevMonthDisabled ? 'none' : 'auto')};
    }

    button:nth-of-type(2) {
      visibility: ${props =>
        props.isNextMonthDisabled ? 'hidden' : 'visible'};
      pointer-events: ${props => (props.isNextMonthDisabled ? 'none' : 'auto')};
    }
  }

  .DayPicker-Caption {
    color: ${props => props.theme.color('pewter')};
    font-size: 15px;
    ${fontFamilyMixin('hnb', true)};
  }

  .DayPickerInput {
    min-width: 190px;
    position: relative;
    display: flex;
    align-items: center;
    padding: 10px;
    border-radius: 6px;
    border: 1px solid ${props => props.theme.color('marble')};

    &:focus-within {
      box-shadow: ${props => props.theme.focusBoxShadow};
    }

    input {
      width: 100%;

      &,
      &:focus,
      &:focus-visible {
        border: 0;
        outline: 0;
        appearance: none;
      }
    }
  }

  .DayPickerInput-OverlayWrapper {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }

  .DayPickerInput-Overlay {
    border-radius: 6px;
    right: 0;
    left: auto;
    top: calc(100% + 10px);
  }
`;

const IconWrapper = styled.div.attrs({
  className: classNames({
    [font('hnr', 3)]: true,
  }),
})`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: ${props => props.theme.color('smoke')};
  transition: background-color ${props => props.theme.transitionProperties};
  cursor: pointer;

  &:hover {
    background-color: ${props => props.theme.color('marble')};
  }
`;

function getDayNumber(day: Day): number {
  switch (day) {
    case 'Monday':
      return 1;
    case 'Tuesday':
      return 2;
    case 'Wednesday':
      return 3;
    case 'Thursday':
      return 4;
    case 'Friday':
      return 5;
    case 'Saturday':
      return 6;
    case 'Sunday':
      return 0;
    default:
      return 8;
  }
}

type Props = {
  pickUpDate?: Date;
  setPickUpDate: (date: Date) => void;
};

const RequestingDayPicker: FC<Props> = ({
  pickUpDate,
  setPickUpDate,
}: Props) => {
  function renderDay(day: Date) {
    const date = day.getDate();
    return <AlignFont>{date}</AlignFont>;
  }

  const Weekday = ({ weekday, className, localeUtils, locale }) => {
    const weekdayName = localeUtils.formatWeekdayLong(weekday, locale);
    return (
      <div
        className={classNames({
          [className]: true,
          [font('hnb', 5)]: true,
        })}
        title={weekdayName}
      >
        {weekdayName.slice(0, 1)}
      </div>
    );
  };

  const Navbar = ({ onPreviousClick, onNextClick, className }) => {
    return (
      <div className={className}>
        <button
          type="button"
          className="plain-button no-padding"
          onClick={() => onPreviousClick()}
        >
          <IconWrapper>
            <Icon
              matchText={true}
              color={'pewter'}
              icon={chevron}
              rotate={90}
            />
          </IconWrapper>
        </button>
        <button
          type="button"
          className="plain-button"
          onClick={() => onNextClick()}
        >
          <IconWrapper>
            <Icon
              matchText={true}
              color={'pewter'}
              icon={chevron}
              rotate={270}
            />
          </IconWrapper>
        </button>
      </div>
    );
  };

  const Overlay = ({ classNames, selectedDay, children, ...props }) => {
    return (
      <div className={classNames.overlayWrapper} {...props}>
        <div className={classNames.overlay}>{children}</div>
      </div>
    );
  };

  const openingTimes = useContext(OpeningTimesContext);
  const now = london(new Date());
  const nextAvailableDate = london(new Date());
  const twoWeeksFromNow = london(new Date()).add(14, 'days');

  const libraryVenue =
    openingTimes?.collectionOpeningTimes.placesOpeningHours.find(
      venue => venue.id === collectionVenueId.libraries.id
    );
  const regularLibraryOpeningTimes = libraryVenue?.openingHours.regular || [];
  const regularClosedDays = regularLibraryOpeningTimes
    ?.filter(day => day.opens === null)
    .map(day => getDayNumber(day.dayOfWeek));
  const exceptionalLibraryOpeningTimes =
    libraryVenue?.openingHours.exceptional || [];
  const exceptionalClosedDates = exceptionalLibraryOpeningTimes
    .filter(day => day.opens === null)
    .map(day => {
      return day.overrideDate.toDate();
    });

  const isBeforeTen = now.isBefore(10);
  // If it's before 10am, we can request on the next day
  // otherwise, in two days' time
  nextAvailableDate.add(isBeforeTen ? 1 : 2, 'days');
  const nextAvailableDateIsSunday = nextAvailableDate.day() === 0;
  // …if that's a Sunday, move it to Monday
  nextAvailableDate.add(nextAvailableDateIsSunday ? 1 : 0, 'days');

  const WrappedInput = props => {
    return (
      <>
        <input {...props} />
        <span
          className={classNames({
            [font('hnr', 3)]: true,
            'flex-inline': true,
          })}
        >
          <Icon color={'pewter'} matchText icon={calendar} />
        </span>
      </>
    );
  };

  const fromMonth = nextAvailableDate.toDate();
  const toMonth = twoWeeksFromNow.toDate();

  const [isPrevMonthDisabled, setIsPrevMonthDisabled] = useState(true);
  const [isNextMonthDisabled, setIsNextMonthDisabled] = useState(false);

  function handleOnMonthChange(month: Date) {
    setIsPrevMonthDisabled(london(month).isSameOrBefore(fromMonth, 'month'));
    setIsNextMonthDisabled(london(month).isSameOrAfter(toMonth, 'month'));
  }

  function handleOnDayChange(date: Date) {
    setPickUpDate(date);
  }

  return (
    <DayPickerWrapper
      isPrevMonthDisabled={isPrevMonthDisabled}
      isNextMonthDisabled={isNextMonthDisabled}
    >
      <DayPickerInput
        formatDate={formatDate}
        parseDate={parseDate}
        format="D MMMM YYYY"
        placeholder={`Select a date`}
        onDayChange={handleOnDayChange}
        value={pickUpDate}
        component={WrappedInput}
        inputProps={{
          required: true,
        }}
        overlayComponent={Overlay}
        dayPickerProps={{
          renderDay: renderDay,
          navbarElement: Navbar,
          weekdayElement: Weekday,
          onMonthChange: handleOnMonthChange,
          firstDayOfWeek: 1,
          fromMonth,
          toMonth,
          disabledDays: [
            { daysOfWeek: regularClosedDays },
            {
              before: nextAvailableDate.toDate(),
              after: twoWeeksFromNow.toDate(),
            },
            ...exceptionalClosedDates,
          ],
        }}
      />
    </DayPickerWrapper>
  );
};

export default RequestingDayPicker;
