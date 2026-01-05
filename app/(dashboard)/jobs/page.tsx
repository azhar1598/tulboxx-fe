"use client";
import CustomTable from "@/components/common/CustomTable";
import { FilterLayout } from "@/components/common/FilterLayout";
import MainLayout from "@/components/common/MainLayout";
import { PageHeader } from "@/components/common/PageHeader";
import callApi from "@/services/apiService";
import QRCode from "react-qr-code";

import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Flex,
  Group,
  Modal,
  Stack,
  Text,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconBrandFacebook,
  IconBrandLinkedin,
  IconBrandInstagram,
  IconDownload,
  IconEdit,
  IconEye,
  IconPlus,
  IconQrcode,
  IconTrash,
  IconHome,
  IconBuilding,
  IconMapPin,
  IconPhone,
  IconMail,
  IconTypeface,
  IconCalendar,
  IconUser,
  IconBriefcase,
  IconCurrencyDollar,
} from "@tabler/icons-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import StatisticsCards from "./StatisticsCards";
// import PreviewQR from "./add/PreviewQR";
// import { PrintLayout } from "./PrintLayout";
import { checkStatus, extractAndParseJson } from "@/lib/constants";
import { useTableQuery } from "@/lib/hooks/useTableQuery";
import dayjs from "dayjs";
import { usePageNotifications } from "@/lib/hooks/useNotifications";
import { SelectEstimateModal } from "./SelectEstimateModal";

function Jobs() {
  const [opened, { open, close }] = useDisclosure(false);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [apiData, setApiData] = useState([]);
  const [deleteJobId, setDeleteJobId] = useState();

  const notifications = usePageNotifications();
  const queryClient = useQueryClient();

  const [state, setState] = useState({
    sortOrder: "",
    sortedColumn: "",
    allRecords: 0,
    metaData: {
      totalRecords: 0,
    },
    data: null,
  });

  const { tableFilters, tableOperators } = React.useMemo(() => {
    const tableFilters: any = {};
    const tableOperators: any = {};
    const now = dayjs().format("YYYY-MM-DD");

    if (status === "not started") {
      tableFilters.start_date = now;
      tableOperators.start_date = "$gt";
    } else if (status === "completed") {
      tableFilters.end_date = now;
      tableOperators.end_date = "$lt";
    } else if (status === "inprogress") {
      tableFilters.start_date = now;
      tableOperators.start_date = "$lte";
      tableFilters.end_date = now;
      tableOperators.end_date = "$gte";
    } else if (status === "unscheduled") {
      tableFilters.start_date = "null";
      tableOperators.start_date = "$is";
    }

    return { tableFilters, tableOperators };
  }, [status]);

  const deleteJobMutation = useMutation({
    mutationFn: (id: any) => {
      setDeleteJobId(id);
      return callApi.delete(`/jobs/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-jobs"] });
      notifications.success("Job deleted successfully");
    },
    onError: () => {
      notifications.error("Failed to delete job");
    },
  });

  const pageSize = 10;

  console.log("state", state);

  let columns = [
    {
      accessor: "name",
      title: "Job Name",
      textAlign: "left",
      sortable: true,
      render: ({ name }: any) =>
        name ? (
          <Text size="14px" className="flex items-center gap-3">
            <IconBriefcase size={16} />
            {name}
          </Text>
        ) : (
          <Text size="14px">N/A</Text>
        ),
    },
    {
      accessor: "client",
      title: "Client",
      textAlign: "left",
      sortable: true,
      render: ({ client }: any) =>
        client?.name ? (
          <Text size="14px" className="flex items-center gap-3">
            <IconUser size={16} />
            {client?.name}
          </Text>
        ) : (
          <Text size="14px">N/A</Text>
        ),
    },
    {
      accessor: "amount",
      title: "Amount",
      textAlign: "left",
      sortable: true,
      render: ({ amount }: any) =>
        amount ? (
          <Text size="14px" className="flex items-center gap-2">
            <IconCurrencyDollar size={16} />
            {amount}
          </Text>
        ) : (
          <Text size="14px">N/A</Text>
        ),
    },
    {
      accessor: "start_date",
      title: "Start Date",
      textAlign: "left",
      sortable: true,
      render: ({ start_date }: any) =>
        start_date ? (
          <Text size="14px" className="flex items-center gap-2">
            <IconCalendar size={16} />
            {dayjs(start_date).format("MM-DD-YYYY")}
          </Text>
        ) : (
          <Text size="14px">Unscheduled</Text>
        ),
    },
    {
      accessor: "end_date",
      title: "End Date",
      textAlign: "left",
      sortable: true,
      render: ({ end_date }: any) =>
        end_date ? (
          <Text size="14px" className="flex items-center gap-2">
            <IconCalendar size={16} />
            {dayjs(end_date).format("MM-DD-YYYY")}
          </Text>
        ) : (
          <Text size="14px">Unscheduled</Text>
        ),
    },
    {
      accessor: "status",
      title: "Status",
      textAlign: "left",
      sortable: true,
      render: ({ start_date, end_date }: any) => {
        const getStatus = () => {
          if (!start_date || !end_date)
            return { label: "Unscheduled", color: "gray" };
          const now = dayjs();
          const start = dayjs(start_date);
          const end = dayjs(end_date);

          if (now.isBefore(start, "day"))
            return { label: "Not Started", color: "blue" };
          if (now.isAfter(end, "day"))
            return { label: "Completed", color: "green" };
          return { label: "In Progress", color: "yellow" };
        };

        const status = getStatus();
        return (
          <Badge
            color={status.color}
            variant="light"
            size="xs"
            style={{ fontSize: "10px" }}
          >
            {status.label}
          </Badge>
        );
      },
    },
    {
      accessor: "actions",
      title: <Box mr={6}>Actions</Box>,
      textAlign: "left",
      width: "250px",
      render: (record) => (
        <Flex gap={5}>
          <Link href={`/jobs/edit/${record.id}`}>
            <Button
              style={{ fontSize: "12px" }}
              variant="table-btn-primary"
              // leftSection={<IconEdit size={16} />}
            >
              EDIT
            </Button>
          </Link>
          <Button
            style={{ fontSize: "12px" }}
            variant="table-btn-danger"
            // leftSection={<IconTrash size={16} />}
            onClick={() => deleteJobMutation.mutate(record.id)}
            loading={record?.id === deleteJobId && deleteJobMutation.isPending}
          >
            DELETE
          </Button>
        </Flex>
      ),
    },
  ];

  const handleSearch = (value) => {
    setSearch(value);
  };

  const handleRecordsPerPage = () => {};

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const filters = [
    {
      label: "Status",
      fieldName: "status",
      options: [
        { value: "unscheduled", label: "Unscheduled" },
        { value: "not started", label: "Not Started" },
        { value: "inprogress", label: "In Progress" },
        { value: "completed", label: "Completed" },
      ],
      onChange: (value: any) => setStatus(value),
    },
  ];

  console.log("apiData", state);
  return (
    <>
      <div className="mb-4">
        <PageHeader
          title={`Jobs (${state?.allRecords || 0})`}
          rightSection={
            <Group>
              <Button leftSection={<IconPlus size={16} />} onClick={open}>
                New Job
              </Button>
            </Group>
          }
        />
        <SelectEstimateModal opened={opened} onClose={close} />
      </div>
      <StatisticsCards jobs={state.data} />
      <Stack gap={20} mb={20} className=" bg-white shadow-xl">
        <FilterLayout
          filters={filters}
          onSearch={handleSearch}
          searchable={false}
        />
        <CustomTable
          url={"/jobs"}
          queryKey={["get-jobs"]}
          search={search}
          columns={columns}
          filters={tableFilters}
          operators={tableOperators}
          pagination={true}
          sortable
          defaultSortedColumn={"name"}
          defaultSortedColumnDirection={"asc"}
          setMetaData={setState}
          setState={setState}
          state={state}
        />
      </Stack>
    </>
  );
}

export default Jobs;
