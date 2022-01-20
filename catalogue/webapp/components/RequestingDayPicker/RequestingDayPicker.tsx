import { FC, forwardRef, MutableRefObject } from 'react';
import { Moment } from 'moment';
import {
  OpeningHoursDay,
  ExceptionalOpeningHoursDay,
} from '@weco/common/model/opening-hours';
import { london } from '@weco/common/utils/format-date';
import { collectionVenueId } from '@weco/common/services/prismic/hardcoded-id';
import {
  determineNextAvailableDate,
  convertOpeningHoursDayToDayNumber,
  extendEndDate,
  findClosedDays,
  isValidDate,
} from '@weco/catalogue/utils/dates';
// import { usePrismicData } from '@weco/common/server-data/Context';
import {
  // parseCollectionVenues,
  getVenueById,
} from '@weco/common/services/prismic/opening-times';
import DateAdapter from '@mui/lab/AdapterMoment';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import TextField from '@mui/material/TextField';
import DatePicker from '@mui/lab/DatePicker';
import styled from 'styled-components';
import { venues } from '@weco/common/test/fixtures/components/venues'; // TODO just for dev as building not currently open
import Icon from '@weco/common/views/components/Icon/Icon';
import { calendar } from '@weco/common/icons';

type Props = {
  pickUpDate: Moment | null | undefined;
  setPickUpDate: (date: Moment) => void;
};

const DatePickerWrapper = styled.div`
  && {
    label {
      transform: none;
      padding: 10px;
      &[data-shrink='true'],
      &.Mui-focused {
        visibility: hidden;
      }
    }
    legend {
      display: none;
    }

    .Mui-focused {
      fieldset {
        border-color: ${props => props.theme.color('pumice')};
        box-shadow: ${props => props.theme.focusBoxShadow};
      }
    }

    .MuiOutlinedInput-root {
      &:hover {
        fieldset {
          border-color: ${props => props.theme.color('pumice')};
        }
      }
    }

    .Mui-selected {
      background-color: ${props => props.theme.color('yellow')};
    }

    input {
      height: unset;
      padding: 10px;
    }
  }
`;

const CalendarWrapper = styled.div`
  && {
    .Mui-selected {
      color: ${props => props.theme.color('black')};
      background-color: ${props => props.theme.color('yellow')} !important;
    }
  }
`;

const PaperComponent = forwardRef(function PaperComponent(props, ref) {
  return (
    <CalendarWrapper ref={ref as MutableRefObject<HTMLDivElement>} {...props}>
      {props.children}
    </CalendarWrapper>
  );
});

const OpenPickerIcon = () => <Icon icon={calendar} color={'pewter'} />;

const RequestingDayPicker: FC<Props> = ({
  pickUpDate,
  setPickUpDate,
}: Props) => {
  // We get the regular and exceptional days on which the library is closed from Prismic data,
  // so we can make these unavailable in the calendar.
  // const { collectionVenues } = usePrismicData(); // TODO just for dev as building not currently open
  // const venues = parseCollectionVenues(collectionVenues); // TODO just for dev as building not currently open
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

  // There should be a minimum of a 2 week window in which to select a date
  const lastAvailableDate = nextAvailableDate?.clone().add(13, 'days') || null;
  // If the library is closed on any days during the selection window
  // we extend the lastAvailableDate to take these into account
  const extendedLastAvailableDate = extendEndDate({
    startDate: nextAvailableDate,
    endDate: lastAvailableDate,
    exceptionalClosedDates,
    regularClosedDays,
  });

  return (
    <LocalizationProvider dateAdapter={DateAdapter}>
      <DatePickerWrapper>
        <DatePicker
          label="Select a date"
          inputFormat="DD/MM/yyyy"
          value={pickUpDate}
          views={['day']}
          minDate={nextAvailableDate}
          maxDate={extendedLastAvailableDate}
          shouldDisableDate={date => {
            return Boolean(
              date &&
                london(date).isValid() &&
                !isValidDate({
                  date: london(date),
                  startDate: nextAvailableDate,
                  endDate: extendedLastAvailableDate,
                  excludedDates: exceptionalClosedDates,
                  excludedDays: regularClosedDays,
                })
            );
          }}
          onChange={date => {
            date && setPickUpDate(london(date));
          }}
          renderInput={params => <TextField {...params} />}
          PaperProps={{
            component: PaperComponent,
          }}
          components={{
            OpenPickerIcon,
          }}
        />
      </DatePickerWrapper>
    </LocalizationProvider>
  );
};

export default RequestingDayPicker;
