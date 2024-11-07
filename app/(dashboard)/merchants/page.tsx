"use client";
import CustomTable from "@/components/common/CustomTable";
import { FilterLayout } from "@/components/common/FilterLayout";
import MainLayout from "@/components/common/MainLayout";
import { PageHeader } from "@/components/common/PageHeader";

import { ActionIcon, Box, Button, Group, Stack } from "@mantine/core";
import {
  IconDownload,
  IconEdit,
  IconEye,
  IconPlus,
  IconTrash,
} from "@tabler/icons-react";
import { DataTable } from "mantine-datatable";
import Link from "next/link";
import React from "react";

function page() {
  let columns = [
    { accessor: "name" },
    { accessor: "city" },
    { accessor: "state" },
    {
      accessor: "actions",
      title: <Box mr={6}>Row actions</Box>,
      textAlign: "right",
      render: (company) => (
        <Group gap={4} justify="right" wrap="nowrap">
          <ActionIcon
            size="sm"
            variant="subtle"
            color="green"
            // onClick={() => showModal({ company, action: 'view' })}
          >
            <IconEye size={16} />
          </ActionIcon>
          <ActionIcon
            size="sm"
            variant="subtle"
            color="blue"
            // onClick={() => showModal({ company, action: 'edit' })}
          >
            <IconEdit size={16} />
          </ActionIcon>
          <ActionIcon
            size="sm"
            variant="subtle"
            color="red"
            // onClick={() => showModal({ company, action: 'delete' })}
          >
            <IconTrash size={16} />
          </ActionIcon>
        </Group>
      ),
    },
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
      onChange: (value) => handleTypeChange(value),
    },
    // ... more filters
  ];
  return (
    <>
      <div className="mb-4">
        <PageHeader
          title={"Merchants"}
          rightSection={
            <Group>
              <Link href={"/merchants/add"}>
                <Button leftSection={<IconPlus size={16} />}>
                  Create Merchant
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
          onRecordsPerPageChange={handleRecordsPerPage}
        />
        <CustomTable records={records} columns={columns} />
      </Stack>
    </>
  );
}

export default page;
