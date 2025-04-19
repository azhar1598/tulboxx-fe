"use client";
import CustomTable from "@/components/common/CustomTable";
import { FilterLayout } from "@/components/common/FilterLayout";
import MainLayout from "@/components/common/MainLayout";
import { PageHeader } from "@/components/common/PageHeader";
import { useTableQuery } from "@/lib/hooks/useTableQuery";
import callApi from "@/services/apiService";

import { ActionIcon, Box, Button, Flex, Group, Stack } from "@mantine/core";
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

function page() {
  let columns = [
    {
      accessor: "storeName",
      title: "Store Name",

      render: ({ storeName }: any) => storeName,
    },
    {
      accessor: "qrId",
      title: "RID",

      render: ({ id }: any) => id,
    },
    {
      accessor: "googleReviewPid",
      title: "Review PID",

      render: ({ googleReviewPid }: any) => googleReviewPid,
    },
    {
      accessor: "ownerName",
      title: "Owner Name",

      render: ({ ownerName }: any) => ownerName,
    },
    {
      accessor: "phoneNumber",
      index: "phoneNumber",
      render: ({ phoneNumber }: any) => phoneNumber,
    },
    {
      accessor: "email",

      render: ({ email }: any) => email,
    },
    {
      accessor: "actions",
      title: <Box mr={6}>Row actions</Box>,
      width: "220px",
      textAlign: "right",
      render: ({ id }) => (
        <Flex gap={2}>
          <Link href={`/stores/add?merchantId=${id}`}>
            <Button variant="table-btn-danger">Delete</Button>
          </Link>
        </Flex>
      ),
    },
  ];

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

  const [page, setPage] = useState(1);
  const pageSize = 10;

  const queryFilters: any = {
    url: "/v1/google/stores",
    key: "get-review-stores",
    page,
    pageSize,
  };

  const getMerchantsQuery = useTableQuery(queryFilters);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  return (
    <>
      <div className="mb-4">
        <PageHeader
          title={"Review Stores"}
          rightSection={
            <Group>
              <Link href={"/review-stores/add"}>
                <Button leftSection={<IconPlus size={16} />}>
                  Create Review Store
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
          // onRecordsPerPageChange={handleRecordsPerPage}
        />
        <CustomTable
          records={getMerchantsQuery?.tableData || []}
          columns={columns}
          totalRecords={getMerchantsQuery?.totalResults || 0}
          currentPage={getMerchantsQuery?.currentPage || 0}
          pageSize={getMerchantsQuery?.pageSize || 0}
          onPageChange={handlePageChange}
          isLoading={getMerchantsQuery.isLoading}
        />
      </Stack>
    </>
  );
}

export default page;
