import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const CalendarView = () => {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 6, 23)); // July 23, 2025
  const [currentView, setCurrentView] = useState("month"); // Add this state

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Add previous month's trailing days
    const prevMonth = new Date(year, month - 1, 0);
    const prevMonthDays = prevMonth.getDate();
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      days.push({
        day: prevMonthDays - i,
        isCurrentMonth: false,
        isToday: false,
      });
    }

    // Add current month's days
    const today = new Date();
    for (let day = 1; day <= daysInMonth; day++) {
      const isToday =
        year === today.getFullYear() &&
        month === today.getMonth() &&
        day === today.getDate();
      days.push({
        day,
        isCurrentMonth: true,
        isToday,
      });
    }

    // Add next month's leading days to complete the grid
    const remainingDays = 42 - days.length; // 6 rows × 7 days
    for (let day = 1; day <= remainingDays; day++) {
      days.push({
        day,
        isCurrentMonth: false,
        isToday: false,
      });
    }

    return days;
  };

  const handlePreviousNavigation = () => {
    switch (currentView) {
      case "day":
        setCurrentDate(
          new Date(currentDate.setDate(currentDate.getDate() - 1))
        );
        break;
      case "week":
        setCurrentDate(
          new Date(currentDate.setDate(currentDate.getDate() - 7))
        );
        break;
      case "month":
        setCurrentDate(
          new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
        );
        break;
    }
  };

  const handleNextNavigation = () => {
    switch (currentView) {
      case "day":
        setCurrentDate(
          new Date(currentDate.setDate(currentDate.getDate() + 1))
        );
        break;
      case "week":
        setCurrentDate(
          new Date(currentDate.setDate(currentDate.getDate() + 7))
        );
        break;
      case "month":
        setCurrentDate(
          new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
        );
        break;
    }
  };

  // Add view rendering functions
  const renderDayView = () => {
    return (
      <div className="p-6">
        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-4">
            {currentDate.toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </h3>
          <div className="grid grid-cols-1 gap-4">
            {Array.from({ length: 24 }).map((_, hour) => (
              <div key={hour} className="flex items-center border-t py-2">
                <span className="w-20 text-sm text-gray-500">
                  {hour.toString().padStart(2, "0")}:00
                </span>
                <div className="flex-1 h-12 border-l"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderWeekView = () => {
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());

    const weekDays = Array.from({ length: 7 }).map((_, index) => {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + index);
      return day;
    });

    return (
      <div className="p-6">
        {/* Week header showing days and dates */}
        <div className="grid grid-cols-7 border-b">
          {weekDays.map((day, index) => (
            <div
              key={index}
              className={`text-center p-4 ${
                day.getDate() === currentDate.getDate()
                  ? "border-t-2 border-blue-500"
                  : ""
              }`}
            >
              <div className="text-base font-semibold text-gray-900">
                {daysOfWeek[day.getDay()]}
              </div>
              <div
                className={`text-2xl mt-1 ${
                  day.getDate() === currentDate.getDate()
                    ? "text-blue-500"
                    : "text-gray-500"
                }`}
              >
                {day.getDate()}
              </div>
            </div>
          ))}
        </div>

        {/* Week content area */}
        <div className="grid grid-cols-7 border rounded-lg mt-4">
          {weekDays.map((day, index) => (
            <div
              key={index}
              className={`min-h-[500px] border-r last:border-r-0 ${
                day.getDate() === currentDate.getDate() ? "bg-blue-50" : ""
              }`}
            >
              {/* You can add event rendering here */}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const days = getDaysInMonth(currentDate);
  const currentMonth = monthNames[currentDate.getMonth()];
  const currentYear = currentDate.getFullYear();

  return (
    <div className="w-full max-w-6xl mx-auto bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        {/* View Toggle Buttons */}
        <div className="flex items-center space-x-1">
          <button
            onClick={() => setCurrentView("day")}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              currentView === "day"
                ? "text-white bg-blue-500 hover:bg-blue-600"
                : "text-gray-600 bg-gray-100 hover:bg-gray-200"
            }`}
          >
            Day
          </button>
          <button
            onClick={() => setCurrentView("week")}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              currentView === "week"
                ? "text-white bg-blue-500 hover:bg-blue-600"
                : "text-gray-600 bg-gray-100 hover:bg-gray-200"
            }`}
          >
            Week
          </button>
          <button
            onClick={() => setCurrentView("month")}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              currentView === "month"
                ? "text-white bg-blue-500 hover:bg-blue-600"
                : "text-gray-600 bg-gray-100 hover:bg-gray-200"
            }`}
          >
            Month
          </button>
        </div>

        {/* Navigation */}
        <div className="flex items-center space-x-4">
          <button
            onClick={handlePreviousNavigation}
            className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Previous{" "}
            {currentView.charAt(0).toUpperCase() + currentView.slice(1)}
          </button>

          <h2 className="text-xl font-semibold text-gray-900">
            {currentView === "month"
              ? `${currentMonth} ${currentYear}`
              : currentView === "week"
              ? `${new Date(
                  currentDate.setDate(
                    currentDate.getDate() - currentDate.getDay()
                  )
                ).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                })} - ${new Date(
                  currentDate.setDate(
                    currentDate.getDate() - currentDate.getDay() + 6
                  )
                ).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}`
              : currentDate.toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
          </h2>

          <button
            onClick={handleNextNavigation}
            className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Next {currentView.charAt(0).toUpperCase() + currentView.slice(1)}
            <ChevronRight className="w-4 h-4 ml-2" />
          </button>
        </div>
      </div>

      {/* Render the appropriate view based on currentView state */}
      {currentView === "day" && renderDayView()}
      {currentView === "week" && renderWeekView()}
      {currentView === "month" && (
        // Calendar Grid
        <div className="p-6">
          {/* Days of Week Header */}
          <div className="grid grid-cols-7 mb-2">
            {daysOfWeek.map((day) => (
              <div key={day} className="p-4 text-center">
                <span className="text-sm font-medium text-gray-900">{day}</span>
              </div>
            ))}
          </div>

          {/* Calendar Days Grid */}
          <div className="grid grid-cols-7 gap-px bg-gray-200">
            {days.map((dayInfo, index) => (
              <div
                key={index}
                className={`
                  h-32 bg-white border border-gray-200 p-2 hover:bg-gray-50 transition-colors cursor-pointer
                  ${dayInfo.isToday ? "bg-blue-50 border-blue-200" : ""}
                `}
              >
                <span
                  className={`
                    text-sm font-medium
                    ${
                      dayInfo.isCurrentMonth ? "text-gray-900" : "text-gray-400"
                    }
                    ${dayInfo.isToday ? "text-blue-600 font-semibold" : ""}
                  `}
                >
                  {dayInfo.day}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarView;
