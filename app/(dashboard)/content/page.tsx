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
  Group,
  Modal,
  Stack,
  Text,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
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
import { checkStatus } from "@/lib/constants";
import { useTableQuery } from "@/lib/hooks/useTableQuery";

function Estimates() {
  const [opened, { open, close }] = useDisclosure(false);
  // const [storeId, setStoreId] = useState();
  const [qrCode, setQrCode] = useState("");
  const [storeInfo, setStoreInfo] = useState();

  const handleModal = (id, record) => {
    // console.log("siteurl", process.env.NEXT_PUBLIC_SITE_URL);
    // setStoreId(id);
    setQrCode(`${process.env.NEXT_PUBLIC_SITE_URL}/stores/${id}`);

    setStoreInfo(record);
  };

  useEffect(() => {
    if (!qrCode) return;
    open();
  }, [qrCode]);

  let columns = [
    {
      accessor: "name",
      title: "Project Name",
      render: ({ name, tagLine, id }: any) => (
        <Link
          href={`/stores/${id}`}
          style={{ color: "blue", textDecoration: "underline" }}
        >
          {name}{" "}
          <small>
            <i className="text-gray-500">({tagLine})</i>
          </small>
        </Link>
      ),
    },
    {
      accessor: "estimate",
      title: "Project Estimate",
      render: ({ licenseId }: any) => licenseId || "N/A",
    },
    {
      accessor: "customerName",
      title: "Customer Name",
      render: ({ city }: any) => city || "N/A",
    },
    {
      accessor: "customerEmail",
      title: "Customer Email",
      render: ({ state }: any) => state || "N/A",
    },
    {
      accessor: "customerPhone",
      title: "Customer Phone",
      render: ({ status }: any) => (
        <Badge color={checkStatus(status)}>{status}</Badge>
      ),
    },

    {
      accessor: "actions",
      title: <Box mr={6}>Row actions</Box>,
      textAlign: "right",
      render: (record) => (
        <Button
          style={{ fontSize: "12px" }}
          variant="table"
          onClick={() => {
            handleModal(record.id, record);
          }}
          leftSection={<IconQrcode size={16} />}
        >
          Generate QR
        </Button>
      ),
    },
  ];

  const records = [{ id: 1, name: "azhar", city: "kmm", state: "telangana" }];

  const handleTypeChange = () => {};
  const handleSearch = () => {};

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
          records={[]}
          columns={columns}
          totalRecords={getStoresQuery?.totalResults || 0}
          currentPage={getStoresQuery?.currentPage || 0}
          pageSize={getStoresQuery?.pageSize || 0}
          onPageChange={handlePageChange}
          isLoading={getStoresQuery.isLoading}
        />
      </Stack>
    </>
  );
}

export default Estimates;
