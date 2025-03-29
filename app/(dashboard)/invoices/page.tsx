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
  const router = useRouter();

  // Add this query to fetch projects
  const { data: projects = [], isLoading: projectsLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: () => callApi("/api/projects"), // Adjust the API endpoint as needed
  });

  const handleProjectSelect = (project) => {
    setSelectedProject(project);
    // closeProjectModal();
    // Navigate to the add invoice page with project ID
    // window.location.href = `/invoices/add/${project.id}`;
  };

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
      render: ({ number }: any) => number || "N/A",
    },
    {
      accessor: "name",
      title: "Project Name",
      align: "left",
      render: ({ name, id }: any) => (
        <Link
          href={`/stores/${id}`}
          style={{ color: "blue", textDecoration: "underline" }}
        >
          {name}
        </Link>
      ),
    },
    {
      accessor: "estimate",
      title: "Project Estimate",
      align: "left",
      render: ({ estimate }: any) => estimate || "N/A",
    },
    {
      accessor: "customerName",
      title: "Customer Name",
      align: "left",
      render: ({ customerName }: any) => customerName || "N/A",
    },
    {
      accessor: "customerEmail",
      title: "Customer Email",
      align: "left",
      render: ({ customerEmail }: any) => customerEmail || "N/A",
    },
    // {
    //   accessor: "customerPhone",
    //   title: "Customer Phone",
    //   align: "left",
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
            Edit
          </Button>
          <Button
            style={{ fontSize: "12px" }}
            variant="table-btn-danger"
            // onClick={() => router.push(`/patients/customize/${record.id}`)}
            leftSection={<IconTrash size={16} />}
          >
            Delete
          </Button>
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
  const handleSearch = () => {};

  const handleRecordsPerPage = () => {};

  const filters = [
    {
      id: "type",
      label: "Choose Project",
      options: [
        { value: "1", label: "All" },
        { value: "2", label: "Type 1" },
      ],
      // onChange: (value) => handleTypeChange(value),
    },
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

  const [page, setPage] = useState(1);
  const pageSize = 10;

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

  // Generate QR data based on merchant info

  // Function to download QR code as SVG
  const downloadQRCode = () => {
    const svg = document.getElementById("merchant-qr-code");
    const svgData = new XMLSerializer()?.serializeToString(svg);
    const svgBlob = new Blob([svgData], {
      type: "image/svg+xml;charset=utf-8",
    });
    const svgUrl = URL.createObjectURL(svgBlob);

    const downloadLink = document.createElement("a");
    downloadLink.href = svgUrl;
    // downloadLink.download = `store-${storeId}-qr.svg`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(svgUrl);
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
          records={invoiceData}
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
