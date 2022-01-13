import { FC, useState } from 'react';
import { Moment } from 'moment';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import {
  OpeningHoursDay,
  ExceptionalOpeningHoursDay,
} from '@weco/common/model/opening-hours';
import { london } from '@weco/common/utils/format-date';
// import 'react-day-picker/lib/style.css';
import LocaleUtils from 'react-day-picker/moment';
import styled from 'styled-components';
import AlignFont from '@weco/common/views/components/styled/AlignFont';
import Icon from '@weco/common/views/components/Icon/Icon';
import { chevron, calendar } from '@weco/common/icons';
import { classNames, font } from '@weco/common/utils/classnames';
import { fontFamilyMixin } from '@weco/common/views/themes/typography';
import { collectionVenueId } from '@weco/common/services/prismic/hardcoded-id';
import {
  determineNextAvailableDate,
  convertOpeningHoursDayToDayNumber,
  extendEndDate,
  findClosedDays,
} from '@weco/catalogue/utils/dates';
import { usePrismicData } from '@weco/common/server-data/Context';
import {
  parseCollectionVenues,
  getVenueById,
} from '@weco/common/services/prismic/opening-times';

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

  // We get the regular and exceptional days on which the library is closed from Prismic data,
  // so we can make these unavailable in the calendar.
  const { collectionVenues } = usePrismicData();
  const venues = parseCollectionVenues(collectionVenues);
  const libraryVenue = getVenueById(venues, collectionVenueId.libraries.id);
  const regularLibraryOpeningTimes = libraryVenue?.openingHours.regular || [];
  const regularClosedDays = findClosedDays(regularLibraryOpeningTimes).map(
    day => convertOpeningHoursDayToDayNumber(day as OpeningHoursDay)
  );
  const exceptionalLibraryOpeningTimes =
    libraryVenue?.openingHours.exceptional || [];
  const exceptionalClosedDates = findClosedDays(exceptionalLibraryOpeningTimes)
    .map(day => {
      const exceptionalDay = day as ExceptionalOpeningHoursDay;
      return exceptionalDay.overrideDate as Moment;
    })
    .filter(Boolean);
  const nextAvailableDate = determineNextAvailableDate(
    london(new Date()),
    regularClosedDays
  );

  // There should be a 2 week window in which to select a date
  const lastAvailableDate = nextAvailableDate?.clone().add(13, 'days') || null;
  // We want to know if the library is closed on any days during the selection window
  // so that we can extend the lastAvailableDate to take these into account
  const extendedLastAvailableDate = extendEndDate({
    startDate: nextAvailableDate,
    endDate: lastAvailableDate,
    exceptionalClosedDates,
    regularClosedDays,
  });

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

  const fromMonth = nextAvailableDate?.toDate() ?? new Date();
  const toMonth = extendedLastAvailableDate?.toDate() ?? new Date();

  const [isPrevMonthDisabled, setIsPrevMonthDisabled] = useState(true);
  const [isNextMonthDisabled, setIsNextMonthDisabled] = useState(false);

  function handleOnMonthChange(month: Date) {
    setIsPrevMonthDisabled(london(month).isSameOrBefore(fromMonth, 'month'));
    setIsNextMonthDisabled(london(month).isSameOrAfter(toMonth, 'month'));
  }

  function handleOnDayChange(date: Date) {
    setPickUpDate(date);
  }

  const disabledDays = [
    {
      before: nextAvailableDate?.toDate() ?? new Date(),
      after: extendedLastAvailableDate?.toDate() ?? new Date(),
    },
    { daysOfWeek: regularClosedDays },
    ...exceptionalClosedDates.map(moment => moment.toDate()),
  ];

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
          disabledDays,
        }}
      />
    </DayPickerWrapper>
  );
};

export default RequestingDayPicker;
