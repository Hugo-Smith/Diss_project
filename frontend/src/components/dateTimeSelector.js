import { useState } from "react";
import moment from 'moment';
import DateTimePicker from 'react-datetime';
import 'react-datetime/css/react-datetime.css';

const DateTimeSelector = ({ handleDateInput }) => {
  const [selectedDateTime, setSelectedDateTime] = useState(null);
  const [feedback, setFeedback] = useState('');

  const currentDate = new Date();
  const latestDate = new Date();
  latestDate.setDate(currentDate.getDate() + 14);

  const validateHour = (selection) => {
    const hour = selection.hour();
    return hour >= 9 && hour <= 17;
  };

  const handleDateTimeChange = (dateObj) => {
    if (!dateObj.isValid()) {
      setFeedback('Invalid date selection');
      return;
    }

    const isValidHour = validateHour(dateObj);
    if (!isValidHour) {
      setFeedback('Open hours are from 9AM to 5PM, please reselect');
    } else {
      setFeedback('');
    }
    const formattedDate = moment(dateObj).format('YYYY-MM-DD HH:MM');

    setSelectedDateTime(formattedDate);
    handleDateInput(formattedDate)
  };

  return (
    <div className="dateTimePicker">
      <DateTimePicker
        value={selectedDateTime}
        onChange={handleDateTimeChange}
        isValidDate={(current) => current.isBetween(currentDate, latestDate, null, '[]')}
        timeFormat="HH:mm"
        dateFormat="YYYY-MM-DD"
        inputProps={{ placeholder: 'Select a date and time' }}
        closeOnSelect={false}
      />
      {feedback && <p className="feedback">{feedback}</p>}
      {selectedDateTime && (
        <div>
          <p className="feedback">Selected Date and Time: {selectedDateTime.toString()}</p>
        </div>
      )}
    </div>
  );
};

export default DateTimeSelector;
