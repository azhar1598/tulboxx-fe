import React, { useState, ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Badge, Card, Text } from "@mantine/core";
import { JobDetailsModal } from "../JobDetailsModal";
import { useDroppable } from "@dnd-kit/core";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
} from "@dnd-kit/core";
import { usePageNotifications } from "@/lib/hooks/useNotifications";
import { JobCard } from "../ScheduledJobs";

interface Job {
  id: string;
  name: string;
  type: string;
  amount: number;
  date: string;
  hours: number;
  notes: string;
  client: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
}

interface CalendarViewProps {
  getJobs?: Job[];
  selectedDate?: Date | null;
  selectedJobId?: string | null;
}

interface DayInfo {
  day: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  date: Date;
}
const CalendarDay = ({
  dayInfo,
  children,
}: {
  dayInfo: DayInfo;
  children: ReactNode;
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id: dayInfo.date.toISOString(),
    data: { date: dayInfo.date },
  });

  return (
    <div
      ref={setNodeRef}
      className={`
        h-40 bg-white border-t border-l border-gray-200 transition-colors cursor-pointer relative
        ${!dayInfo.isCurrentMonth ? "bg-gray-50" : ""}
        ${isOver ? "bg-green-100" : ""}
      `}
    >
      {children}
    </div>
  );
};

const CalendarView: React.FC<CalendarViewProps> = ({
  getJobs = [],
  selectedDate,
  selectedJobId,
}) => {
  const [currentDate, setCurrentDate] = useState(
    selectedDate || new Date(2025, 6, 23)
  );
  const [currentView, setCurrentView] = useState("month");
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  React.useEffect(() => {
    if (selectedDate) {
      setCurrentDate(selectedDate);
    }
  }, [selectedDate]);

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

  const getDaysInMonth = (date: Date): DayInfo[] => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: DayInfo[] = [];

    const prevMonth = new Date(year, month - 1, 0);
    const prevMonthDays = prevMonth.getDate();
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const day = prevMonthDays - i;
      days.push({
        day,
        isCurrentMonth: false,
        isToday: false,
        date: new Date(year, month - 1, day),
      });
    }

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
        date: new Date(year, month, day),
      });
    }

    const remainingDays = 42 - days.length; // 6 rows × 7 days
    for (let day = 1; day <= remainingDays; day++) {
      days.push({
        day,
        isCurrentMonth: false,
        isToday: false,
        date: new Date(year, month + 1, day),
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

  const getJobsForDate = (date: Date) => {
    return getJobs.filter((job) => {
      if (!job.date) return false;
      const jobDate = new Date(job.date);
      return (
        jobDate.getDate() === date.getDate() &&
        jobDate.getMonth() === date.getMonth() &&
        jobDate.getFullYear() === date.getFullYear()
      );
    });
  };

  const JobCard = ({ job }: { job: Job }) => (
    <Card
      withBorder
      shadow="sm"
      radius="sm"
      className={`mb-2 p-2 transition-all ${
        selectedJobId === job.id
          ? "border-2 border-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]"
          : ""
      }`}
      style={{ backgroundColor: "#f8f9fa" }}
      onClick={(e) => {
        e.stopPropagation();
        setSelectedJob(job);
      }}
    >
      <Text size="xs" fw={500} truncate>
        {job.name}
      </Text>
    </Card>
  );

  const days = getDaysInMonth(currentDate);

  const startOfWeek = new Date(currentDate);
  startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
  const weekDays = Array.from({ length: 7 }).map((_, index) => {
    const day = new Date(startOfWeek);
    day.setDate(startOfWeek.getDate() + index);
    return day;
  });

  return (
    <div className="w-full bg-white rounded-lg border border-gray-200 shadow-sm p-4">
      <div className="flex items-center justify-between pb-4">
        <h2 className="text-2xl font-bold text-gray-800 tracking-tight">
          {`${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`}
        </h2>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1 p-1 bg-gray-100 rounded-lg">
            <button
              onClick={() => setCurrentView("month")}
              className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                currentView === "month"
                  ? "text-white bg-gray-800 shadow"
                  : "text-gray-600 hover:bg-white"
              }`}
            >
              Month
            </button>
            <button
              onClick={() => setCurrentView("week")}
              className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                currentView === "week"
                  ? "text-white bg-gray-800 shadow"
                  : "text-gray-600 hover:bg-white"
              }`}
            >
              Week
            </button>
          </div>
          <div className="flex items-center">
            <button
              onClick={handlePreviousNavigation}
              className="p-2 text-gray-500 rounded-full hover:bg-gray-100 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNextNavigation}
              className="p-2 text-gray-500 rounded-full hover:bg-gray-100 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {currentView === "month" && (
        <div>
          <div className="grid grid-cols-7 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-200">
            {daysOfWeek.map((day) => (
              <div key={day} className="py-3">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7">
            {days.map((dayInfo, index) => {
              const dayJobs = dayInfo.isCurrentMonth
                ? getJobsForDate(dayInfo.date)
                : [];

              return (
                <CalendarDay key={index} dayInfo={dayInfo}>
                  <div className="p-2 h-full">
                    <span
                      className={`
                        text-xs font-semibold
                        ${
                          dayInfo.isCurrentMonth
                            ? "text-gray-900"
                            : "text-gray-400"
                        }
                        ${
                          dayInfo.isToday
                            ? "text-white bg-blue-600 rounded-full w-6 h-6 flex items-center justify-center"
                            : ""
                        }
                      `}
                    >
                      {dayInfo.day}
                    </span>
                    <div className="mt-2 space-y-1 overflow-y-auto max-h-24">
                      {dayInfo.isCurrentMonth &&
                        dayJobs.map((job) => (
                          <JobCard key={job.id} job={job} />
                        ))}
                    </div>
                  </div>
                </CalendarDay>
              );
            })}
          </div>
        </div>
      )}

      {currentView === "week" && (
        <div className="p-6">
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

          <div className="grid grid-cols-7 border rounded-lg mt-4">
            {weekDays.map((day, index) => {
              const dayJobs = getJobsForDate(day);
              const dayInfo = {
                day: day.getDate(),
                isCurrentMonth: true,
                isToday: day.toDateString() === new Date().toDateString(),
                date: day,
              };

              return (
                <div
                  key={index}
                  className={`
                    min-h-[500px] border-r last:border-r-0 p-2 overflow-y-auto
                    ${
                      day.getDate() === currentDate.getDate()
                        ? "bg-blue-50"
                        : ""
                    }
                  `}
                >
                  <CalendarDay dayInfo={dayInfo}>
                    {dayJobs.map((job) => (
                      <JobCard key={job.id} job={job} />
                    ))}
                  </CalendarDay>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <JobDetailsModal
        job={selectedJob}
        opened={selectedJob !== null}
        onClose={() => setSelectedJob(null)}
      />
    </div>
  );
};

export default CalendarView;
