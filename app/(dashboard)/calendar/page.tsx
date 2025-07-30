"use client";
import React, { useState } from "react";
import styles from "./calendar.module.css";
import { PageHeader } from "@/components/common/PageHeader";
import { Button, Group } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { ScheduleJobModal } from "./ScheduleJobModal";
import { useQuery } from "@tanstack/react-query";
import callApi from "@/services/apiService";
import CalendarView from "./CalendarView";
import ScheduledJobs from "./ScheduledJobs";

interface Job {
  id: string;
  name: string;
  type: string;
  amount: number;
  date: string;
  hours: number;
  notes: string;
  client: {
    name: string;
    email: string;
    phone: string;
  };
}

function Calendar() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);

  const [openScheduleJobModal, { open: openAddStage, close: closeAddStage }] =
    useDisclosure(false);

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
      return data?.data;
    },
  });

  const handleJobSelect = (job: Job) => {
    const jobDate = new Date(job.date);
    setSelectedDate(jobDate);
    setSelectedJobId(job.id);
  };

  return (
    <>
      <div className="mb-4">
        <PageHeader
          title={`Calendar`}
          // rightSection={
          //   <Group>
          //     <Button
          //       leftSection={<IconPlus size={16} />}
          //       onClick={openAddStage}
          //     >
          //       Schedule Job
          //     </Button>
          //   </Group>
          // }
        />
      </div>
      <div className={styles["calendar-container"]}>
        <ScheduledJobs onJobSelect={handleJobSelect} />
        <CalendarView
          selectedDate={selectedDate}
          selectedJobId={selectedJobId}
          getJobs={getJobsQuery?.data || []}
        />
        {/* <ScheduleJobModal
          opened={openScheduleJobModal}
          onClose={closeAddStage}
        /> */}
      </div>
    </>
  );
}

export default Calendar;
