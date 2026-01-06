"use client";
import CustomTable from "@/components/common/CustomTable";
import { FilterLayout } from "@/components/common/FilterLayout";
import MainLayout from "@/components/common/MainLayout";
import { PageHeader } from "@/components/common/PageHeader";
import callApi from "@/services/apiService";

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

import { useDropdownOptions } from "@/lib/hooks/useDropdownOptions";
import { useRouter } from "next/navigation";
import StatisticsCards from "./StatisticsCards";
import CustomModal from "@/components/common/CustomMoodal";
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
  const [status, setStatus] = useState("all");
  const [filterEstimate, setFilterEstimate] = useState<string | null>(null);
  const [filterClient, setFilterClient] = useState<string | null>(null);
  const pageSize = 10;

  const [state, setState] = useState({
    sortOrder: "",
    sortedColumn: "",
    metaData: {
      totalRecords: 0,
    },
  });

  const router = useRouter();

  const handleProjectSelect = (project) => {
    setSelectedProject(project);
    // closeProjectModal();
    // Navigate to the add invoice page with project ID
    // window.location.href = `/invoices/add/${project.id}`;
  };

  const { data: invoicesData, isLoading: invoicesLoading } = useQuery({
    queryKey: ["invoices-stats"],
    queryFn: () => callApi.get("/invoices?page=1&limit=1000"), // Fetch all for stats
    select: (data) => data?.data?.data,
  });

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
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
      accessor: "invoice_number",
      title: "Invoice #",
      align: "left",
      sortable: true,
      render: ({ invoice_number }: any) => invoice_number || "N/A",
    },
    {
      accessor: "project",
      title: "Estimate",
      align: "left",
      sortable: true,
      render: ({ project, id }: any) => (
        <Link
          href={`${project?.id ? `/estimates/preview/${project?.id}` : ""}`}
          style={
            project?.id
              ? { color: "blue", textDecoration: "underline" }
              : { color: "gray" }
          }
        >
          {project?.projectName || "N/A"}
        </Link>
      ),
    },

    {
      accessor: "invoice_total_amount",
      title: "Invoice Total Amount",
      align: "left",
      sortable: true,
      render: ({ invoice_total_amount }: any) =>
        `$${invoice_total_amount}` || "N/A",
    },
    {
      accessor: "client.name",
      title: "Customer Name",
      align: "left",
      sortable: true,
      render: ({ client }: any) => client?.name || "N/A",
    },
    {
      accessor: "due_date",
      title: "Due Date",
      align: "left",
      sortable: true,
      render: ({ due_date }: any) =>
        due_date ? new Date(due_date).toLocaleDateString() : "N/A",
    },

    //   render: ({ customerPhone }: any) => customerPhone || "N/A",
    // },
    {
      accessor: "status",
      title: "Status",
      align: "left",
      sortable: true,
      render: ({ status }: any) => (
        <Badge color={getStatusColor(status)}>{status}</Badge>
      ),
    },
    {
      accessor: "actions",
      title: <Box mr={6}>Actions</Box>,
      textAlign: "left",
      render: (record: any) => (
        <Group>
          <Button
            style={{ fontSize: "12px" }}
            variant="table-btn-primary"
            onClick={() => router.push(`/invoices/edit/${record.id}`)}
            // leftSection={<IconEdit size={16} />}
          >
            View
          </Button>
        </Group>
      ),
    },
  ];

  const handleTypeChange = (value) => {
    setStatus(value);
  };
  const handleSearch = (value) => {
    setSearch(value);
  };

  const queryFilters: any = {
    url: "/estimates",
    key: "get-estimates",
    page,
    pageSize,
    value: "id",
    label: "projectName",
  };

  const getEstimatesQuery = useDropdownOptions(queryFilters);

  const { data: clientOptions } = useQuery({
    queryKey: ["get-clients-dropdown"],
    queryFn: async () => {
      const response = await callApi.get(`/clients?limit=1000`);
      return response.data;
    },
    select: (data) =>
      data?.data?.map((client: any) => ({
        label: client.name,
        value: client.id.toString(),
      })),
  });

  const filters = [
    {
      id: "invoice_status",
      label: "Invoice Status",
      fieldName: "status",
      options: [
        { value: "all", label: "All" },
        { value: "paid", label: "Paid" },
        { value: "unpaid", label: "Unpaid" },
        { value: "pending", label: "Pending" },
        { value: "draft", label: "Draft" },
      ],
      onChange: (value) => handleTypeChange(value),
    },
    {
      id: "estimate",
      label: "Estimate",
      fieldName: "project.id",
      options: getEstimatesQuery || [],
      onChange: (value) => setFilterEstimate(value),
    },
    {
      id: "client",
      label: "Client",
      fieldName: "client.id",
      options: clientOptions || [],
      onChange: (value) => setFilterClient(value),
    },
  ];

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

      <StatisticsCards invoices={invoicesData || []} />

      <CustomModal
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
            onChange={(value) => {
              const project = getEstimatesQuery?.find((p) => p.value === value);

              if (project) {
                setSelectedProject(project);
              } else {
                setSelectedProject(null);
              }
            }}
            allowDeselect={false}
            searchable
          />
          <Button
            leftSection={<IconPlus size={16} />}
            onClick={() => {
              if (selectedProject) {
                router.push(`/invoices/add/${selectedProject.value}`);
                closeProjectModal();
              }
            }}
            disabled={!selectedProject}
            fullWidth
          >
            Create Invoice for Selected Project
          </Button>
          <Button
            leftSection={<IconPlus size={16} />}
            onClick={() => {
              router.push(`/invoices/add/standalone`);
              closeProjectModal();
            }}
          >
            Create Standalone Invoice
          </Button>
        </Stack>
      </CustomModal>

      <Stack gap={20} mb={20} className=" bg-white shadow-xl">
        <FilterLayout
          filters={filters}
          searchable={false}
          onSearch={handleSearch}
        />
        <CustomTable
          url={"/invoices"}
          search={search}
          filters={{
            ...(status && status !== "all" ? { status: [status] } : {}),
            ...(filterEstimate ? { "project.id": [filterEstimate] } : {}),
            ...(filterClient ? { "client.id": [filterClient] } : {}),
          }}
          columns={columns}
          pagination={true}
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

export default Estimates;
