"use client";
import CustomTable from "@/components/common/CustomTable";
import { FilterLayout } from "@/components/common/FilterLayout";
import { PageHeader } from "@/components/common/PageHeader";
import callApi from "@/services/apiService";
import dayjs from "dayjs";

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
import { useDebouncedState, useDisclosure } from "@mantine/hooks";
import {
  IconBuilding,
  IconDownload,
  IconEdit,
  IconEye,
  IconHome,
  IconPlus,
  IconQrcode,
  IconTrash,
} from "@tabler/icons-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { DataTable } from "mantine-datatable";
import Link from "next/link";
import React, { useContext, useEffect, useState } from "react";
// import PreviewQR from "./add/PreviewQR";
// import { PrintLayout } from "./PrintLayout";
import { checkStatus } from "@/lib/constants";
import { useTableQuery } from "@/lib/hooks/useTableQuery";

import { esimatesData } from "@/apiData";
import { createClient } from "@/utils/supabase/client";
import AuthProvider from "@/components/auth/AuthProvider";
import { useDropdownOptions } from "@/lib/hooks/useDropdownOptions";
import { queryClient } from "@/lib/queryClient";
import { usePageNotifications } from "@/lib/hooks/useNotifications";
import { UserContext } from "@/app/layout";

function Estimates() {
  const [opened, { open, close }] = useDisclosure(false);
  // const [storeId, setStoreId] = useState();
  const [qrCode, setQrCode] = useState("");
  const [storeInfo, setStoreInfo] = useState();
  const [search, setSearch] = useDebouncedState("", 500);
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const notification = usePageNotifications();
  const [deletEstimateId, setDeletEstimateId] = useState();

  useEffect(() => {
    if (!qrCode) return;
    open();
  }, [qrCode]);

  const deletEstimateMutation = useMutation({
    mutationFn: (id: any) => {
      console.log("id", id);
      setDeletEstimateId(id);
      return callApi.delete(`/estimates/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-estimates"] });
      notification.success("Estimate deleted successfully");
    },
    onError: () => {
      notification.error("Failed to delete estimate");
    },
  });

  let columns = [
    {
      accessor: "projectName",
      title: "Project Name",
      render: ({ projectName, id }: any) => (
        <Link
          href={`/estimates/preview/${id}`}
          style={{ color: "blue", textDecoration: "underline" }}
        >
          {projectName || "N/A"}
        </Link>
      ),
    },
    {
      accessor: "projectEstimate",
      title: "Project Estimate",
      render: ({ projectEstimate }: any) => projectEstimate || "N/A",
    },
    {
      accessor: "customerName",
      title: "Customer Name",
      render: ({ customerName }: any) => customerName || "N/A",
    },
    {
      accessor: "email",
      textAlign: "left",
      title: "Customer Email",
      render: ({ email }: any) => email || "N/A",
    },

    {
      accessor: "type",
      textAlign: "left",
      title: "Project Type",
      render: ({ type }: any) => (
        <Flex gap={4} align="center">
          {type === "home" ? (
            <IconHome size={16} />
          ) : type === "commercial" ? (
            <IconBuilding size={16} />
          ) : (
            <IconHome size={16} />
          )}
          <Text size="14px">{type || "N/A"}</Text>
        </Flex>
      ),
    },

    {
      accessor: "total_amount",
      title: "Total Amount",
      render: ({ total_amount }: any) => (
        <Text size="14px" fw={600}>
          {total_amount ? `$${total_amount}` : "N/A"}
        </Text>
      ),
    },

    {
      accessor: "actions",
      title: <Box mr={6}>Actions</Box>,
      textAlign: "left",
      render: (record: any) => (
        <Group>
          {/* <Button
            style={{ fontSize: "12px" }}
            variant="table-btn-primary"
            leftSection={<IconEdit size={16} />}
          >
            Edit
          </Button> */}

          <Button
            style={{ fontSize: "12px" }}
            variant="table-btn-danger"
            leftSection={<IconTrash size={16} />}
            onClick={() => deletEstimateMutation.mutate(record.id)}
            loading={
              record.id === deletEstimateId && deletEstimateMutation.isPending
            }
          >
            Delete
          </Button>
        </Group>
      ),
    },
  ];

  const records = [{ id: 1, name: "azhar", city: "kmm", state: "telangana" }];

  const queryFilters = {
    url: "/estimates",
    key: "get-estimates",
    page: 1,
    pageSize: 10,
  };

  const getEstimatesQueryOptions = useDropdownOptions(queryFilters);

  const [options, setOptions] = useState([]);

  useEffect(() => {
    if (!getEstimatesQueryOptions) return;
    console.log("getEstimatesQueryOptions", getEstimatesQueryOptions);
    setOptions([{ value: "", label: "All" }, ...getEstimatesQueryOptions]);
  }, [getEstimatesQueryOptions]);

  const [projectId, setProjectId] = useState();

  const handleTypeChange = (value) => {
    setProjectId(value.value);
  };
  const handleSearch = (value) => {
    setSearch(value);
  };

  const handleRecordsPerPage = () => {};

  const filters = [
    {
      id: "type",
      label: "Project Name",
      options: options,
      onChange: (value) => handleTypeChange(value),
    },
    // ... more filters
  ];

  const user = useContext(UserContext);

  console.log("user", user);

  const getEstimatesQuery = useQuery({
    queryKey: ["get-estimates", search, page, projectId, user],
    queryFn: () => {
      const params = new URLSearchParams();
      params.append("page", page.toString());
      params.append("pageSize", pageSize.toString());
      params.append("search", search);
      if (projectId) {
        params.append("filter.id", projectId);
      }
      const response = callApi.get("/estimates", { params });
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

  console.log("getEstimatesQuery---->", getEstimatesQuery?.data?.data);

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

  return (
    <>
      <div className="mb-4">
        <PageHeader
          title={"Estimates"}
          rightSection={
            <Group>
              <Link href={"/estimates/add"}>
                <Button leftSection={<IconPlus size={16} />}>
                  New Estimate
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
          searchable={true}
          // onRecordsPerPageChange={handleRecordsPerPage}
        />
        <CustomTable
          // getStoresQuery?.tableData ||
          records={getEstimatesQuery?.data?.data || []}
          columns={columns}
          totalRecords={getEstimatesQuery?.data?.metadata?.totalRecords || 0}
          currentPage={getEstimatesQuery?.data?.metadata?.currentPage || 0}
          pageSize={getEstimatesQuery?.data?.metadata?.recordsPerPage || 0}
          onPageChange={handlePageChange}
          isLoading={getEstimatesQuery.isLoading}
        />
      </Stack>
    </>
  );
}

export default Estimates;
