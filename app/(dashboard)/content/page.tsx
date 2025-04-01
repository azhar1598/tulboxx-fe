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
} from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { DataTable } from "mantine-datatable";
import Link from "next/link";
import React, { useEffect, useState } from "react";
// import PreviewQR from "./add/PreviewQR";
// import { PrintLayout } from "./PrintLayout";
import { checkStatus, extractAndParseJson } from "@/lib/constants";
import { useTableQuery } from "@/lib/hooks/useTableQuery";

function Content() {
  const [search, setSearch] = useState("");
  const getContentQuery: any = useQuery({
    queryKey: ["get-content", search],
    queryFn: () => {
      const response = callApi.get("/content", {
        params: {
          search,
        },
      });

      console.log("response", response);
      return response;
    },
    select: (data) => {
      console.log("data", data);

      return {
        data: data?.data?.data,
        metadata: data?.data?.metadata,
      };
    },
  });

  console.log("getContentQuery---->", getContentQuery?.data?.data);

  let columns = [
    {
      accessor: "title",
      title: "Title",
      textAlign: "left",
      render: ({ content }: any) =>
        extractAndParseJson(content)?.title || "N/A",
    },
    {
      accessor: "name",
      title: "Project Name",
      textAlign: "left",
      render: ({ estimates, project_id }: any) => (
        <Link href={`#`} style={{ color: "blue", textDecoration: "underline" }}>
          {estimates?.projectName || "N/A"}
        </Link>
      ),
    },

    {
      accessor: "platform",
      title: "Platform",
      render: ({ platform }: any) => (
        <Flex gap={4} align="center">
          {platform === "Facebook" && (
            <>
              <IconBrandFacebook size={16} color="blue" />
              {platform}
            </>
          )}
          {platform === "Instagram" && (
            <>
              <IconBrandInstagram size={16} color="red" />
              {platform}
            </>
          )}
          {platform === "LinkedIn" && (
            <>
              <IconBrandLinkedin size={16} />
              {platform}
            </>
          )}
        </Flex>
      ),
    },

    {
      accessor: "actions",
      title: <Box mr={6}>Row actions</Box>,
      textAlign: "left",
      render: (record) => (
        <Link href={`/content/view/${record.id}`}>
          <Button
            style={{ fontSize: "12px" }}
            variant="table-btn-primary"
            leftSection={<IconEye size={16} />}
          >
            View
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
          title={"Content"}
          rightSection={
            <Group>
              <Link href={"/content/add"}>
                <Button leftSection={<IconPlus size={16} />}>
                  New Content
                </Button>
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

          records={getContentQuery?.data?.data || []}
          columns={columns}
          totalRecords={getContentQuery?.metadata?.totalRecords || 0}
          currentPage={getContentQuery?.metadata?.currentPage || 0}
          pageSize={getContentQuery?.metadata?.pageSize || 0}
          onPageChange={handlePageChange}
          isLoading={getContentQuery.isLoading}
        />
      </Stack>
    </>
  );
}

export default Content;
