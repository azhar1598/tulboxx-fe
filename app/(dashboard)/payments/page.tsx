"use client";
import CustomTable from "@/components/common/CustomTable";
import { FilterLayout } from "@/components/common/FilterLayout";
import MainLayout from "@/components/common/MainLayout";
import { PageHeader } from "@/components/common/PageHeader";
import callApi from "@/services/apiService";

import { ActionIcon, Box, Button, Group, Stack } from "@mantine/core";
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
import React from "react";

function page() {
  let columns = [
    {
      accessor: "name",
      render: ({ name }: any) => name,
    },
    { accessor: "email", index: "email", render: ({ email }: any) => email },
    {
      accessor: "phoneNumber",
      index: "phoneNumber",
      render: ({ phoneNumber }: any) => phoneNumber,
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

  const records = [{ id: 1, name: "azhar", city: "kmm", state: "telangana" }];

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

  const getPaymentsQuery = useQuery({
    queryKey: ["get-payments"],
    queryFn: async () => {
      const response = await callApi.get(`v1/payments`);
      return response.data;
    },
    select: (data) => {
      console.log("ddd", data);
      return {
        tableData: data?.data?.result,
      };
    },
  });

  console.log("mmm", getPaymentsQuery?.data?.tableData);

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
          records={getPaymentsQuery?.data?.tableData}
          columns={columns}
        />
      </Stack>
    </>
  );
}

export default page;
