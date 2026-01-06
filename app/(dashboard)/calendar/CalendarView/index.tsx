import React, { useState, ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Badge, Card, Text } from "@mantine/core";
import { JobDetailsModal } from "../JobDetailsModal";
import { useDraggable, useDroppable } from "@dnd-kit/core";
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
  startDate: string;
  endDate: string;
  hours: number;
  notes: string;
  client: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
}

interface DraggableJobProps {
  job: Job;
  children: React.ReactNode;
}

const DraggableJob = ({ job, children }: DraggableJobProps) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: job.id,
    data: { job, fromCalendar: true },
  });

  const style: React.CSSProperties = {
    opacity: isDragging ? 0.5 : 1,
    cursor: "grab",
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children}
    </div>
  );
};

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
        min-h-[10rem] h-full bg-white border-t border-l border-gray-200 transition-colors cursor-pointer relative
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
      if (!job.startDate || !job.endDate) return false;
      const start = new Date(job.startDate);
      const end = new Date(job.endDate);
      const current = new Date(date);
      
      // Reset time parts for comparison
      start.setHours(0, 0, 0, 0);
      end.setHours(0, 0, 0, 0);
      current.setHours(0, 0, 0, 0);

      return current.getTime() >= start.getTime() && current.getTime() <= end.getTime();
    });
  };

  const isSameDay = (d1: Date, d2: Date) => {
    return (
      d1.getDate() === d2.getDate() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getFullYear() === d2.getFullYear()
    );
  };

  const getJobColor = (jobId: string) => {
    const colors = [
      { bg: "bg-blue-100", border: "border-blue-200", text: "text-blue-800", hover: "hover:bg-blue-200", ring: "ring-blue-500" },
      { bg: "bg-green-100", border: "border-green-200", text: "text-green-800", hover: "hover:bg-green-200", ring: "ring-green-500" },
      { bg: "bg-purple-100", border: "border-purple-200", text: "text-purple-800", hover: "hover:bg-purple-200", ring: "ring-purple-500" },
      { bg: "bg-orange-100", border: "border-orange-200", text: "text-orange-800", hover: "hover:bg-orange-200", ring: "ring-orange-500" },
      { bg: "bg-pink-100", border: "border-pink-200", text: "text-pink-800", hover: "hover:bg-pink-200", ring: "ring-pink-500" },
      { bg: "bg-teal-100", border: "border-teal-200", text: "text-teal-800", hover: "hover:bg-teal-200", ring: "ring-teal-500" },
      { bg: "bg-indigo-100", border: "border-indigo-200", text: "text-indigo-800", hover: "hover:bg-indigo-200", ring: "ring-indigo-500" },
      { bg: "bg-yellow-100", border: "border-yellow-200", text: "text-yellow-800", hover: "hover:bg-yellow-200", ring: "ring-yellow-500" },
    ];
    
    // Simple hash function to get a deterministic index
    let hash = 0;
    for (let i = 0; i < jobId.length; i++) {
      hash = jobId.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    const index = Math.abs(hash) % colors.length;
    return colors[index];
  };

  const JobCard = ({
    job,
    isStart,
    isEnd,
  }: {
    job: Job;
    isStart?: boolean;
    isEnd?: boolean;
  }) => {
    const color = getJobColor(job.id);
    
    return (
      <div
        className={`
          p-1 px-2 text-xs font-medium cursor-pointer transition-all
          ${color.bg} ${color.border} ${color.text}
          ${color.hover}
          ${isStart ? "rounded-l-md ml-1" : ""}
          ${isEnd ? "rounded-r-md mr-1" : ""}
          ${!isStart ? "-ml-[1px] border-l-0 pl-2" : ""} 
          ${!isEnd ? "-mr-[1px] border-r-0 pr-2" : ""}
          ${selectedJobId === job.id ? `ring-2 ${color.ring} z-10` : ""}
        `}
        onClick={(e) => {
          e.stopPropagation();
          setSelectedJob(job);
        }}
      >
        <div className="truncate">{job.name}</div>
      </div>
    );
  };

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
                  <div className="h-full flex flex-col">
                    <div className="p-2 flex justify-between items-start">
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
                      {dayInfo.isCurrentMonth && dayJobs.length > 1 && (
                        <Badge
                          variant="light"
                          color="gray"
                          size="sm"
                          radius="sm"
                        >
                          {dayJobs.length}
                        </Badge>
                      )}
                    </div>
                    <div className="mt-1 space-y-1 flex-1">
                      {dayInfo.isCurrentMonth &&
                        dayJobs.map((job) => {
                          const isStart =
                            isSameDay(dayInfo.date, new Date(job.startDate)) ||
                            index % 7 === 0;
                          const isEnd =
                            isSameDay(dayInfo.date, new Date(job.endDate)) ||
                            index % 7 === 6;

                          return (
                            <DraggableJob key={job.id} job={job}>
                              <JobCard
                                job={job}
                                isStart={isStart}
                                isEnd={isEnd}
                              />
                            </DraggableJob>
                          );
                        })}
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
                    min-h-[500px] border-r last:border-r-0 overflow-y-auto
                    ${
                      day.getDate() === currentDate.getDate()
                        ? "bg-blue-50"
                        : ""
                    }
                  `}
                >
                  <CalendarDay dayInfo={dayInfo}>
                    <div className="h-full flex flex-col">
                      {dayJobs.map((job) => {
                        // Week view logic - simplified for vertical list since week view is columns
                        // But user asked for continuous. Vertical list doesn't need continuity across columns.
                        // For week view, usually it's time-based or just a list.
                        // We will keep card style but maybe consistent with month view.
                        return (
                          <div key={job.id} className="mb-1 px-2">
                             <DraggableJob job={job}>
                              <JobCard job={job} isStart={true} isEnd={true} />
                            </DraggableJob>
                          </div>
                         
                        );
                      })}
                    </div>
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
