import { FC } from 'react';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import { london } from '@weco/common/utils/format-date';
import 'react-day-picker/lib/style.css';
import { formatDate, parseDate } from 'react-day-picker/moment';
import styled from 'styled-components';
import AlignFont from '@weco/common/views/components/styled/AlignFont';
import Icon from '@weco/common/views/components/Icon/Icon';
import { chevron, calendar } from '@weco/common/icons';
import { classNames, font } from '@weco/common/utils/classnames';
import { fontFamilyMixin } from '@weco/common/views/themes/typography';

const DayPickerWrapper = styled.div`
  .DayPicker-Day {
    line-height: 1;
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
  }

  .DayPicker-Caption {
    color: ${props => props.theme.color('pewter')};
    font-size: 15px;
    ${fontFamilyMixin('hnb', true)};
  }

  .DayPickerInput {
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
        <button className="plain-button" onClick={() => onNextClick()}>
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

  const now = london(new Date());
  const nextAvailableDate = london(new Date());
  const twoWeeksFromNow = london(new Date());
  twoWeeksFromNow.add(14, 'days');
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

  function handleOnDayChange(date: Date) {
    setPickUpDate(date);
  }
  return (
    <DayPickerWrapper>
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
        dayPickerProps={{
          renderDay: renderDay,
          navbarElement: Navbar,
          weekdayElement: Weekday,
          firstDayOfWeek: 1,
          fromMonth: nextAvailableDate.toDate(),
          toMonth: twoWeeksFromNow.toDate(),
          disabledDays: [
            { daysOfWeek: [0] }, // Sundays
            {
              before: nextAvailableDate.toDate(),
              after: twoWeeksFromNow.toDate(),
            },
            // TODO: add holidays/exceptional dates from Prismic
          ],
        }}
      />
    </DayPickerWrapper>
  );
};

export default RequestingDayPicker;
