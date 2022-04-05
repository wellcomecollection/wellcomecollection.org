import { FC, useState, useEffect, useRef } from 'react';
import { Moment } from 'moment';
import { DayNumber } from '@weco/common/model/opening-hours';
import { londonFromFormat, london } from '@weco/common/utils/format-date';
import { isRequestableDate } from '../../utils/dates';
import TextInput from '@weco/common/views/components/TextInput/TextInput';
import Calendar from '../Calendar/Calendar';
import { BorderlessButton } from '@weco/common/views/components/BorderlessClickable/BorderlessClickable';
import Modal from '@weco/common/views/components/Modal/Modal';
import { calendar } from '@weco/common/icons';

type Props = {
  startDate?: Moment;
  endDate?: Moment;
  exceptionalClosedDates: Moment[];
  regularClosedDays: DayNumber[];
  pickUpDate?: string;
  setPickUpDate: (date: string) => void;
};

const RequestingDayPicker: FC<Props> = ({
  startDate,
  endDate,
  exceptionalClosedDates,
  regularClosedDays,
  pickUpDate,
  setPickUpDate,
}: Props) => {
  const [showModal, setShowModal] = useState(false);
  const [isCorrectFormat, setIsCorrectFormat] = useState(false);
  const [isOnRequestableDate, setIsOnRequestableDate] = useState(false);
  const isValid = isCorrectFormat && isOnRequestableDate;
  const stringFormat = 'DD/MM/YYYY';
  const openButton = useRef(null);

  useEffect(() => {
    const pickUpDateMoment = pickUpDate
      ? londonFromFormat(pickUpDate, stringFormat)
      : null;

    setIsCorrectFormat(
      Boolean(
        !pickUpDate || (pickUpDate && pickUpDate.match(/^\d{2}\/\d{2}\/\d{4}$/))
      )
    );

    setIsOnRequestableDate(
      Boolean(
        !pickUpDate ||
          (pickUpDateMoment &&
            pickUpDateMoment.isValid() &&
            isRequestableDate({
              date: pickUpDateMoment,
              startDate,
              endDate,
              excludedDates: exceptionalClosedDates,
              excludedDays: regularClosedDays,
            }))
      )
    );
  }, [pickUpDate]);

  return (
    <div style={{ position: 'relative' }}>
      <TextInput
        id={'selectDate'}
        label="Select a date"
        placeholder={stringFormat}
        value={pickUpDate || ''}
        setValue={setPickUpDate}
        isValid={isValid}
        showValidity={!isValid}
        errorMessage={
          isCorrectFormat
            ? 'Your chosen date is not available to book'
            : `Please enter a date in the correct format (${stringFormat})`
        }
        ariaDescribedBy={'pick-up-date-description'}
        required={true}
      />
      <div
        style={{ position: 'absolute', right: '0', top: '0', height: '100%' }}
      >
        <BorderlessButton
          aria-controls="calendar-modal"
          aria-expanded={showModal}
          isActive={showModal}
          clickHandler={() => setShowModal(!showModal)}
          icon={calendar}
          type="button"
          text={null}
          aria-label="calendar day picker"
          ref={openButton}
          style={{ height: '100%' }}
        />
        <Modal
          id="calendar-modal"
          isActive={showModal}
          setIsActive={setShowModal}
          removeCloseButton={true}
          openButtonRef={openButton}
          showOverlay={false}
          modalStyle={'calendar'}
        >
          <Calendar
            min={startDate || london()}
            max={endDate || london()}
            excludedDates={exceptionalClosedDates}
            excludedDays={regularClosedDays}
            initialFocusDate={
              pickUpDate
                ? londonFromFormat(pickUpDate, stringFormat)
                : startDate || london()
            }
            chosenDate={
              (pickUpDate && londonFromFormat(pickUpDate, stringFormat)) ||
              undefined
            }
            setChosenDate={setPickUpDate}
            setShowModal={setShowModal}
          />
        </Modal>
      </div>
    </div>
  );
};

export default RequestingDayPicker;
