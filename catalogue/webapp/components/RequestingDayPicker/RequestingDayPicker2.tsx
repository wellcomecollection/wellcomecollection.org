import { FC /* useState */ } from 'react';
// import { Moment } from 'moment';
// import {
//   OpeningHoursDay,
//   ExceptionalOpeningHoursDay,
// } from '@weco/common/model/opening-hours';
// import { london } from '@weco/common/utils/format-date';
// import { collectionVenueId } from '@weco/common/services/prismic/hardcoded-id';
// import {
//   determineNextAvailableDate,
//   convertOpeningHoursDayToDayNumber,
//   extendEndDate,
//   findClosedDays,
// } from '@weco/catalogue/utils/dates';
// // import { usePrismicData } from '@weco/common/server-data/Context';
// import {
//   // parseCollectionVenues,
//   getVenueById,
// } from '@weco/common/services/prismic/opening-times';
import DateAdapter from '@mui/lab/AdapterMoment';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import TextField from '@mui/material/TextField';
import DatePicker from '@mui/lab/DatePicker';
// // import AdapterDateFns from '@mui/lab/AdapterDateFns';
// // import MobileDatePicker from '@mui/lab/MobileDatePicker';

// import { venues } from '@weco/common/test/fixtures/components/venues'; // TODO just for dev as building not currently open

type Props = {
  pickUpDate?: Date;
  setPickUpDate: (date: Date) => void;
};

const RequestingDayPicker: FC<Props> = ({
  pickUpDate,
  setPickUpDate,
}: Props) => {
  // We get the regular and exceptional days on which the library is closed from Prismic data,
  // so we can make these unavailable in the calendar.
  // const { collectionVenues } = usePrismicData();
  // const venues = parseCollectionVenues(collectionVenues); // TODO just for dev as building not currently open
  // const libraryVenue = getVenueById(venues, collectionVenueId.libraries.id);
  // const regularLibraryOpeningTimes = libraryVenue?.openingHours.regular || [];
  // const regularClosedDays = findClosedDays(regularLibraryOpeningTimes).map(
  //   day => convertOpeningHoursDayToDayNumber(day as OpeningHoursDay)
  // );
  // const exceptionalLibraryOpeningTimes =
  //   libraryVenue?.openingHours.exceptional || [];
  // const exceptionalClosedDates = findClosedDays(exceptionalLibraryOpeningTimes)
  //   .map(day => {
  //     const exceptionalDay = day as ExceptionalOpeningHoursDay;
  //     return exceptionalDay.overrideDate as Moment;
  //   })
  //   .filter(Boolean);
  // const nextAvailableDate = determineNextAvailableDate(
  //   london(new Date()),
  //   regularClosedDays
  // );

  // // There should be a 2 week window in which to select a date
  // const lastAvailableDate = nextAvailableDate?.clone().add(13, 'days') || null;
  // // We want to know if the library is closed on any days during the selection window
  // // so that we can extend the lastAvailableDate to take these into account
  // const extendedLastAvailableDate = extendEndDate({
  //   startDate: nextAvailableDate,
  //   endDate: lastAvailableDate,
  //   exceptionalClosedDates,
  //   regularClosedDays,
  // });

  // const fromMonth = nextAvailableDate?.toDate() ?? new Date();
  // const toMonth = extendedLastAvailableDate?.toDate() ?? new Date();

  // // const [isPrevMonthDisabled, setIsPrevMonthDisabled] = useState(true);
  // // const [isNextMonthDisabled, setIsNextMonthDisabled] = useState(false);

  // const disabledDays = [
  //   {
  //     before: nextAvailableDate?.toDate() ?? new Date(),
  //     after: extendedLastAvailableDate?.toDate() ?? new Date(),
  //   },
  //   { daysOfWeek: regularClosedDays },
  //   ...exceptionalClosedDates.map(moment => moment.toDate()),
  // ];
  // TODO use follwing for min max
  // nextAvailableDate;
  // extendedLastAvailableDate;
  // return (

  // );

  // <DesktopDatePicker
  //   label="Date desktop"
  //   inputFormat="MM/dd/yyyy"
  //   value={value}
  //   onChange={handleChange}
  //   renderInput={params => <TextField {...params} />}
  // />;
  return (
    <LocalizationProvider dateAdapter={DateAdapter}>
      <DatePicker
        label="Basic example"
        value={pickUpDate}
        onChange={newValue => {
          // TODO add validation stuff
          if (newValue) {
            setPickUpDate(newValue);
          }
        }}
        renderInput={params => <TextField {...params} />}
      />
    </LocalizationProvider>
  );
};

export default RequestingDayPicker;
