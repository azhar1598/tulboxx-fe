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
  IconHourglass,
  IconTypeface,
  IconCategory,
  IconCalendar,
  IconUser,
  IconBriefcase,
} from "@tabler/icons-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import StatisticsCards from "./StatisticsCards";
// import PreviewQR from "./add/PreviewQR";
// import { PrintLayout } from "./PrintLayout";
import { checkStatus, extractAndParseJson } from "@/lib/constants";
import { useTableQuery } from "@/lib/hooks/useTableQuery";
import { Hourglass } from "lucide-react";
import dayjs from "dayjs";
import { usePageNotifications } from "@/lib/hooks/useNotifications";

function Jobs() {
  const [search, setSearch] = useState("");
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
      render: ({ name }: any) => (
        <Text size="14px" className="flex items-center gap-3">
          <IconBriefcase size={16} />
          {name}
        </Text>
      ),
    },
    {
      accessor: "client",
      title: "Client",
      textAlign: "left",
      sortable: true,
      render: ({ client }: any) => (
        <Text size="14px" className="flex items-center gap-3">
          <IconUser size={16} />
          {client?.name}
        </Text>
      ),
    },
    // {
    //   accessor: "client",
    //   title: "Client",
    //   textAlign: "left",
    //   sortable: true,
    // },
    {
      accessor: "hours",
      title: "Hours",
      textAlign: "left",
      sortable: true,
      render: ({ hours }: any) => (
        <Text size="14px" className="flex items-center gap-3">
          <Hourglass size={16} />
          {hours}
        </Text>
      ),
    },

    {
      accessor: "type",
      title: "Type",
      textAlign: "left",
      sortable: true,
      render: ({ type }: any) => (
        <Text size="14px" className="flex items-center gap-3">
          <IconCategory size={16} />
          {type}
        </Text>
      ),
    },

    {
      accessor: "date",
      title: "Date",
      textAlign: "left",
      sortable: true,
      render: ({ date }: any) => (
        <Text size="14px" className="flex items-center gap-2">
          <IconCalendar size={16} />
          {date ? dayjs(date).format("MM-DD-YYYY") : "Unscheduled"}
        </Text>
      ),
    },

    // {
    //   accessor: "location",
    //   title: "Location",
    //   textAlign: "left",
    //   sortable: true,
    //   render: ({ location }: any) => (
    //     <Text size="14px" className="flex items-center gap-2">
    //       <IconMapPin size={16} />
    //       {location}
    //     </Text>
    //   ),
    // },

    // {
    //   accessor: "name",
    //   title: "Project Name",
    //   textAlign: "left",
    //   render: ({ estimates, project_id }: any) => (
    //     <Link href={`#`} style={{ color: "blue", textDecoration: "underline" }}>
    //       {estimates?.projectName || "N/A"}
    //     </Link>
    //   ),
    // },

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

  console.log("apiData", state);
  return (
    <>
      <div className="mb-4">
        <PageHeader
          title={`Jobs (${state?.allRecords || 0})`}
          rightSection={
            <Group>
              <Link href={"/jobs/add"}>
                <Button leftSection={<IconPlus size={16} />}>New Job</Button>
              </Link>
            </Group>
          }
        />
      </div>
      <StatisticsCards jobs={state.data} />
      <Stack gap={20} mb={20} className=" bg-white shadow-xl">
        <FilterLayout
          // filters={filters}
          onSearch={handleSearch}
          searchable={false}
        />
        <CustomTable
          url={"/jobs"}
          queryKey={["get-jobs"]}
          search={search}
          columns={columns}
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
