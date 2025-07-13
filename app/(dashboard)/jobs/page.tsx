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
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import React, { useEffect, useState } from "react";
// import PreviewQR from "./add/PreviewQR";
// import { PrintLayout } from "./PrintLayout";
import { checkStatus, extractAndParseJson } from "@/lib/constants";
import { useTableQuery } from "@/lib/hooks/useTableQuery";
import { Hourglass } from "lucide-react";
import dayjs from "dayjs";

function Clients() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [apiData, setApiData] = useState([]);

  const [state, setState] = useState({
    sortOrder: "",
    sortedColumn: "",
    metaData: {
      totalRecords: 0,
    },
  });

  const pageSize = 10;

  // const getClientsQuery: any = useQuery({
  //   queryKey: ["get-clients", search, page, pageSize, state],
  //   queryFn: () => {
  //     const params = new URLSearchParams();
  //     params.append("page", page.toString());
  //     params.append("pageSize", pageSize.toString());
  //     params.append("search", search);
  //     params.append("sortBy", `${state.sortedColumn}:${state.sortOrder}`);
  //     const response = callApi.get("clients", {
  //       params,
  //     });

  //     return response;
  //   },
  //   select: (data) => {
  //     return {
  //       data: data?.data?.data,
  //       metadata: data?.data?.metadata,
  //     };
  //   },
  // });

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
          {dayjs(date).format("MM-DD-YYYY")}
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
      title: <Box mr={6}>Row actions</Box>,
      textAlign: "left",
      render: (record) => (
        <Link href={`/jobs/edit/${record.id}`}>
          <Button
            style={{ fontSize: "12px" }}
            variant="table-btn-primary"
            leftSection={<IconEdit size={16} />}
          >
            Edit
          </Button>
        </Link>
      ),
    },
  ];

  const handleSearch = (value) => {
    setSearch(value);
  };

  const handleRecordsPerPage = () => {};

  const filters = [
    // {
    //   id: "type",
    //   label: "Merchants",
    //   options: [{ value: "1", label: "Type 1" }],
    //   // onChange: (value) => handleTypeChange(value),
    // },
    // ... more filters
  ];

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  console.log("apiData", state);
  return (
    <>
      <div className="mb-4">
        <PageHeader
          title={`Jobs (${state?.metaData?.totalRecords || 0})`}
          rightSection={
            <Group>
              <Link href={"/jobs/add"}>
                <Button leftSection={<IconPlus size={16} />}>New Job</Button>
              </Link>
            </Group>
          }
        />
      </div>
      <Stack gap={20} mb={20} className=" bg-white shadow-xl">
        <FilterLayout
          filters={filters}
          onSearch={handleSearch}
          searchable={false}
          // onRecordsPerPageChange={handleRecordsPerPage}
        />
        <CustomTable
          // getStoresQuery?.tableData ||
          url={"/jobs"}
          // records={getClientsQuery?.data?.data || []}
          search={search}
          // filters={filters}
          // operators={operators}
          columns={columns}
          pagination={true}
          // totalRecords={getClientsQuery?.data?.metadata?.totalRecords || 0}
          // currentPage={getClientsQuery?.data?.metadata?.currentPage || 0}
          // pageSize={getClientsQuery?.data?.metadata?.recordsPerPage || 0}
          // onPageChange={handlePageChange}
          // isLoading={getClientsQuery.isLoading}
          sortable
          defaultSortedColumn={"name"}
          defaultSortedColumnDirection={"asc"}
          setMetaData={setState}
          state={state}
        />
      </Stack>
    </>
  );
}

export default Clients;
