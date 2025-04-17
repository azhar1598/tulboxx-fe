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
} from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { DataTable } from "mantine-datatable";
import Link from "next/link";
import React, { useEffect, useState } from "react";
// import PreviewQR from "./add/PreviewQR";
// import { PrintLayout } from "./PrintLayout";
import { checkStatus, extractAndParseJson } from "@/lib/constants";
import { useTableQuery } from "@/lib/hooks/useTableQuery";

function Clients() {
  const [search, setSearch] = useState("");
  const getClientsQuery: any = useQuery({
    queryKey: ["get-clients", search],
    queryFn: () => {
      const response = callApi.get("/clients", {
        params: {
          search,
        },
      });

      return response;
    },
    select: (data) => {
      return {
        data: data?.data?.data,
        metadata: data?.data?.metadata,
      };
    },
  });

  let columns = [
    {
      accessor: "name",
      title: "Name",
      textAlign: "left",
    },
    {
      accessor: "email",
      title: "Email",
      textAlign: "left",
    },
    {
      accessor: "phone",
      title: "Phone",
      textAlign: "left",
    },
    {
      accessor: "address",
      title: "Address",
      textAlign: "left",
    },
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
        <Link href={`/clients/edit/${record.id}`}>
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

  const records = [{ id: 1, name: "azhar", city: "kmm", state: "telangana" }];

  const handleTypeChange = () => {};
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

  const [page, setPage] = useState(1);
  const pageSize = 10;

  const queryFilters = {
    url: "/v1/stores",
    key: "get-stores",
    page,
    pageSize,
  };

  //   const getStoresQuery = useTableQuery(queryFilters);
  const getStoresQuery = {
    totalResults: [],
    currentPage: 1,
    pageSize: 1,
    isLoading: false,
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  return (
    <>
      <div className="mb-4">
        <PageHeader
          title={"Clients"}
          rightSection={
            <Group>
              <Link href={"/clients/add"}>
                <Button leftSection={<IconPlus size={16} />}>New Client</Button>
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

          records={getClientsQuery?.data?.data || []}
          columns={columns}
          totalRecords={getClientsQuery?.data?.metadata?.totalRecords || 0}
          currentPage={getClientsQuery?.data?.metadata?.currentPage || 0}
          pageSize={getClientsQuery?.data?.metadata?.recordsPerPage || 0}
          onPageChange={handlePageChange}
          isLoading={getClientsQuery.isLoading}
        />
      </Stack>
    </>
  );
}

export default Clients;
