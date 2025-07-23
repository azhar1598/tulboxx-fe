"use client";
import React, { useState } from "react";
import styles from "./calendar.module.css";
import UnscheduledJobs from "./UnScheduledJobs";
import { PageHeader } from "@/components/common/PageHeader";
import { Button, Flex, Group } from "@mantine/core";
import Link from "next/link";
import { IconPlus } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { ScheduleJobModal } from "./ScheduleJobModal";
import { useQuery } from "@tanstack/react-query";
import callApi from "@/services/apiService";
import CalendarView from "./CalendarView";

function Calendar() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

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
      console.log("data", data);
      return data?.data;
    },
  });

  console.log("getJobsQuery", getJobsQuery?.data);

  return (
    <>
      <div className="mb-4">
        <PageHeader
          title={`Calendar`}
          rightSection={
            <Group>
              <Button
                leftSection={<IconPlus size={16} />}
                onClick={openAddStage}
              >
                Schedule Job
              </Button>
            </Group>
          }
        />
      </div>
      <div className={styles["calendar-container"]}>
        <UnscheduledJobs />
        <CalendarView
          selectedDate={selectedDate}
          getJobs={getJobsQuery?.data || []}
        />
        <ScheduleJobModal
          opened={openScheduleJobModal}
          onClose={closeAddStage}
        />
      </div>
    </>
  );
}

export default Calendar;
