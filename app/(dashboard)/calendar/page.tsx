"use client";
import React, { useState } from "react";
import styles from "./calendar.module.css";
import { PageHeader } from "@/components/common/PageHeader";
import { Button, Group } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { ScheduleJobModal } from "./ScheduleJobModal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import callApi from "@/services/apiService";
import CalendarView from "./CalendarView";
import ScheduledJobs, { JobCard } from "./ScheduledJobs";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { usePageNotifications } from "@/lib/hooks/useNotifications";

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

function Calendar() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [activeJob, setActiveJob] = useState<Job | null>(null);
  const notification = usePageNotifications();
  const queryClient = useQueryClient();
  const [openScheduleJobModal, { open: openAddStage, close: closeAddStage }] =
    useDisclosure(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const getJobsQuery = useQuery({
    queryKey: ["get-jobs"],
    queryFn: async () => {
      const response = await callApi.get(`/jobs`, {
        params: {
          limit: -1,
        },
      });

      return response.data;
    },
    select(data) {
      return data?.data?.map((job: any) => ({
        ...job,
        startDate: job.start_date,
        endDate: job.end_date,
      }));
    },
  });

  const updateJobMutation = useMutation({
    mutationFn: (job: Partial<Job> & { id: string }) =>
      callApi.put(`/jobs/${job.id}`, {
        ...job,
        start_date: job.startDate,
        end_date: job.endDate,
      }),
    onSuccess: () => {
      notification.success("Job scheduled successfully.");
      queryClient.invalidateQueries({ queryKey: ["get-jobs"] });
    },
    onError: (error: any) => {
      notification.error(error.data.message);
    },
  });

  const handleJobSelect = (job: Job) => {
    const jobDate = new Date(job.startDate);
    setSelectedDate(jobDate);
    setSelectedJobId(job.id);
  };

  const handleDragStart = (event: DragStartEvent) => {
    if (event.active.data.current?.job) {
      setActiveJob(event.active.data.current.job as Job);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { over, active } = event;
    if (over && over.data.current) {
      const newStart = over.data.current.date as Date;
      const job = active.data.current?.job as Job;

      const oldStart = job.startDate ? new Date(job.startDate) : null;
      const oldEnd = job.endDate ? new Date(job.endDate) : null;

      // Calculate duration in milliseconds if previously scheduled
      let duration = 0;
      if (oldStart && oldEnd) {
        duration = oldEnd.getTime() - oldStart.getTime();
      }

      const newEnd = new Date(newStart.getTime() + duration);

      const isUnscheduled = !oldStart || isNaN(oldStart.getTime());

      if (
        isUnscheduled ||
        (oldStart && oldStart.toDateString() !== newStart.toDateString())
      ) {
        updateJobMutation.mutate({
          ...job,
          id: job.id,
          startDate: newStart.toISOString(),
          endDate: newEnd.toISOString(),
        });
      }
    }
    setActiveJob(null);
  };

  return (
    <>
      <div className="mb-4">
        <PageHeader title={`Calendar`} />
      </div>
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className={styles["calendar-container"]}>
          <ScheduledJobs onJobSelect={handleJobSelect} />
          <CalendarView
            selectedDate={selectedDate}
            selectedJobId={selectedJobId}
            getJobs={getJobsQuery?.data || []}
          />
        </div>
        <DragOverlay>
          {activeJob ? <JobCard job={activeJob} /> : null}
        </DragOverlay>
      </DndContext>
    </>
  );
}

export default Calendar;
