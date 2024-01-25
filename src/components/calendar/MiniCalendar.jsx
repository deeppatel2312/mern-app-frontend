import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import Card from "components/card";
import "react-calendar/dist/Calendar.css";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import "assets/css/MiniCalendar.css";

const MiniCalendar = ({ onSelect, selectedDate }) => {
  // useEffect(() => {
  //   if (selectedDate) {
  //     setDate(selectedDate);
  //   }
  // }, [selectedDate]);

  // if date is not set, set it to today
  const [value, onChange] = useState(selectedDate ? selectedDate : new Date());
  onSelect(value);

  return (
    <div>
      <Card extra="flex w-full h-full flex-col px-3 py-3">
        <Calendar
          onChange={onChange}
          value={value}
          prevLabel={<MdChevronLeft className="ml-1 h-6 w-6 " />}
          nextLabel={<MdChevronRight className="ml-1 h-6 w-6 " />}
          view={"month"}
        />
      </Card>
    </div>
  );
};

export default MiniCalendar;
