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
  Select,
} from "@mantine/core";
import { useDebouncedState, useDisclosure } from "@mantine/hooks";
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

import { invoiceData } from "@/apiData";
import { useDropdownOptions } from "@/lib/hooks/useDropdownOptions";
import { useRouter } from "next/navigation";
function Estimates() {
  const [opened, { open, close }] = useDisclosure(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [
    projectModalOpened,
    { open: openProjectModal, close: closeProjectModal },
  ] = useDisclosure(false);
  const [qrCode, setQrCode] = useState("");
  const [storeInfo, setStoreInfo] = useState();
  const [search, setSearch] = useDebouncedState("", 500);
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const router = useRouter();

  const handleProjectSelect = (project) => {
    setSelectedProject(project);
    // closeProjectModal();
    // Navigate to the add invoice page with project ID
    // window.location.href = `/invoices/add/${project.id}`;
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
        return "green"; // Success
      case "pending":
        return "yellow"; // Warning
      case "draft":
        return "gray"; // Neutral
      default:
        return "red"; // Error (Invalid Status)
    }
  };

  const columns = [
    {
      accessor: "number",
      title: "Invoice #",
      align: "left",
      render: ({ invoice_number }: any) => invoice_number || "N/A",
    },
    // {
    //   accessor: "name",
    //   title: "Project Name",
    //   align: "left",
    //   render: ({ name, id }: any) => (
    //     <Link
    //       href={`/stores/${id}`}
    //       style={{ color: "blue", textDecoration: "underline" }}
    //     >
    //       {name}
    //     </Link>
    //   ),
    // },
    {
      accessor: "invoice_total_amount",
      title: "Invoice Total Amount",
      align: "left",
      render: ({ invoice_total_amount }: any) =>
        `$${invoice_total_amount}` || "N/A",
    },
    {
      accessor: "customerName",
      title: "Customer Name",
      align: "left",
      render: ({ customer_name }: any) => customer_name || "N/A",
    },
    {
      accessor: "due_date",
      title: "Due Date",
      align: "left",
      render: ({ due_date }: any) =>
        due_date ? new Date(due_date).toLocaleDateString() : "N/A",
    },

    //   render: ({ customerPhone }: any) => customerPhone || "N/A",
    // },
    {
      accessor: "status",
      title: "Status",
      align: "left",
      render: ({ status }: any) => (
        <Badge color={getStatusColor(status)}>{status}</Badge>
      ),
    },
    {
      accessor: "actions",
      title: <Box mr={6}>Row actions</Box>,
      textAlign: "left",
      render: (record: any) => (
        <Group>
          <Button
            style={{ fontSize: "12px" }}
            variant="table-btn-primary"
            // onClick={() => router.push(`/patients/edit/${record.id}`)}
            leftSection={<IconEdit size={16} />}
          >
            View
          </Button>
          {/* <Button
            style={{ fontSize: "12px" }}
            variant="table-btn-danger"
            // onClick={() => router.push(`/patients/customize/${record.id}`)}
            leftSection={<IconTrash size={16} />}
          >
            Delete
          </Button> */}
          {/* <Button
        style={{ fontSize: "12px" }}
        variant="table"
        onClick={() => router.push(`/patients/customize/${record.id}`)}
        leftSection={<IconQrcode size={16} />}
      >
        App Settings
      </Button> */}
        </Group>
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
    //   label: "Choose Project",
    //   options: [
    //     { value: "1", label: "All" },
    //     { value: "2", label: "Type 1" },
    //   ],
    //   // onChange: (value) => handleTypeChange(value),
    // },
    {
      id: "invoice_status",
      label: "Invoice Status",
      options: [
        { value: "1", label: "All" },
        { value: "2", label: "Paid" },
        { value: "3", label: "Pending" },
        { value: "4", label: "Draft" },
      ],
      // onChange: (value) => handleTypeChange(value),
    },
    // ... more filters
  ];

  const getInvoicesQuery = useQuery({
    queryKey: ["get-invoices", search, page],
    queryFn: () => {
      const params = new URLSearchParams();
      params.append("page", page.toString());
      params.append("pageSize", pageSize.toString());
      params.append("search", search);

      const response = callApi.get("/invoices", { params });
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

  console.log("getInvoicesQuery", getInvoicesQuery?.data?.data);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const queryFilters = {
    url: "/estimates",
    key: "get-estimates",
    page,
    pageSize,
  };

  const getEstimatesQuery = useDropdownOptions(queryFilters);

  console.log("getEstimatesQuery", getEstimatesQuery);

  return (
    <>
      <div className="mb-4">
        <PageHeader
          title={"Invoices"}
          rightSection={
            <Group>
              <Button
                leftSection={<IconPlus size={16} />}
                onClick={openProjectModal}
              >
                New Invoice
              </Button>
            </Group>
          }
        />
      </div>

      {/* Add the Project Selection Modal */}
      <Modal
        opened={projectModalOpened}
        onClose={closeProjectModal}
        title="Select Project"
        size="md"
      >
        <Stack gap="md">
          <Text size="sm" c="dimmed">
            Please select a project from the dropdown below to create a new
            invoice. You can search for projects by name.
          </Text>
          <Select
            label="Search and select project"
            placeholder="Type to search projects..."
            data={getEstimatesQuery}
            // searchable
            onChange={(value) => {
              const project = getEstimatesQuery?.find((p) => p.value === value);
              console.log("project", project);
              if (project) {
                setSelectedProject(project);
              } else {
                setSelectedProject(null);
              }
            }}
            allowDeselect={false}
          />
          <Button
            leftSection={<IconPlus size={16} />}
            onClick={() => {
              if (selectedProject) {
                // window.location.href = `/invoices/add/${selectedProject.value}`;
                router.push(`/invoices/add/${selectedProject.value}`);
                closeProjectModal();
              }
            }}
            disabled={!selectedProject}
            fullWidth
          >
            Create Invoice for Selected Project
          </Button>
        </Stack>
      </Modal>

      <Stack gap={20} mb={20} className=" bg-white shadow-xl">
        <FilterLayout
          filters={filters}
          searchable={false}
          onSearch={handleSearch}
          // onRecordsPerPageChange={handleRecordsPerPage}
        />
        <CustomTable
          // getStoresQuery?.tableData ||
          records={getInvoicesQuery?.data?.data || []}
          columns={columns}
          totalRecords={getInvoicesQuery?.data?.metadata?.totalRecords || 0}
          currentPage={getInvoicesQuery?.data?.metadata?.currentPage || 0}
          pageSize={getInvoicesQuery?.data?.metadata?.pageSize || 0}
          onPageChange={handlePageChange}
          isLoading={getInvoicesQuery.isLoading}
        />
      </Stack>
    </>
  );
}

export default Estimates;
