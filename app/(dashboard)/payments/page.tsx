"use client";
import CustomTable from "@/components/common/CustomTable";
import { FilterLayout } from "@/components/common/FilterLayout";
import MainLayout from "@/components/common/MainLayout";
import { PageHeader } from "@/components/common/PageHeader";
import { checkStatus } from "@/lib/constants";
import { useTableQuery } from "@/lib/hooks/useTableQuery";

import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Group,
  Stack,
  Text,
} from "@mantine/core";
import {
  IconDownload,
  IconEdit,
  IconEye,
  IconPlus,
  IconTrash,
} from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { DataTable } from "mantine-datatable";
import Link from "next/link";
import React, { useState } from "react";

function PaymentsPage() {
  let columns = [
    {
      accessor: "paymentCode",
      render: ({ id }: any) => id,
    },
    {
      accessor: "amount",
      render: ({ amount, currency }: any) => (
        <Text>
          {currency} {amount}
        </Text>
      ),
    },
    {
      accessor: "paymentType",
      index: "paymentType",
      render: ({ paymentType }: any) => paymentType,
    },
    {
      accessor: "paidAt",
      index: "paidAt",
      render: ({ paidAt }: any) => <Text>{paidAt || "N/A"}</Text>,
    },
    {
      accessor: "status",
      index: "status",
      render: ({ status }: any) => (
        <Badge color={checkStatus(status)}>{status}</Badge>
      ),
    },
    // {
    //   accessor: "actions",
    //   title: <Box mr={6}>Row actions</Box>,
    //   textAlign: "right",
    //   render: ({ id }) => (
    //     <Link href={`/stores/add?merchantId=${id}`}>
    //       <Button>Create store</Button>
    //     </Link>
    //   ),
    // },
  ];

  const [page, setPage] = useState(1);
  const pageSize = 10;
  const handleTypeChange = () => {};
  const handleSearch = () => {};

  const handleRecordsPerPage = () => {};

  const filters = [
    {
      id: "type",
      label: "Merchants",
      options: [{ value: "1", label: "Type 1" }],
      // onChange: (value) => handleTypeChange(value),
    },
    // ... more filters
  ];

  // const getPaymentsQuery = useQuery({
  //   queryKey: ["get-payments", page],
  //   queryFn: async () => {
  //     const response = await callApi.get(`v1/payments`, {
  //       params: {
  //         page: page,
  //         pageSize: pageSize,
  //       },
  //     });
  //     return response.data;
  //   },
  //   select: (data) => {
  //     return {
  //       tableData: data?.result,
  //       totalResults: data?.totalResults,
  //       currentPage: data?.currentPage,
  //       pageSize: data?.pageSize,
  //     };
  //   },
  //   keepPreviousData: true, // Important for smooth pagination
  //   staleTime: 0, // Ensure fresh data on page changes

  // });
  const queryFilters = {
    url: "v1/payments",
    key: "get-payments",
    page,
    pageSize,
  };
  const getPaymentsQuery = useTableQuery(queryFilters);

  console.log("mmm", getPaymentsQuery);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  return (
    <>
      <div className="mb-4">
        <PageHeader title={"Payments"} />
      </div>
      <Stack gap={20} mb={20} className=" bg-white shadow-xl">
        <FilterLayout
          filters={filters}
          onSearch={handleSearch}
          onRecordsPerPageChange={handleRecordsPerPage}
        />
        <CustomTable
          records={getPaymentsQuery?.tableData || []}
          columns={columns}
          totalRecords={getPaymentsQuery?.totalResults || 0}
          currentPage={getPaymentsQuery?.currentPage || 0}
          pageSize={getPaymentsQuery?.pageSize || 0}
          onPageChange={handlePageChange}
          isLoading={getPaymentsQuery.isLoading}
        />
      </Stack>
    </>
  );
}

export default PaymentsPage;
