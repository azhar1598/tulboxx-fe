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
  Card,
} from "@mantine/core";
import { useDebouncedState, useDisclosure } from "@mantine/hooks";
import {
  IconBook,
  IconBuilding,
  IconCurrencyDollar,
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
// import { useDropdownOptions } from "@/lib/hooks/useDropdownOptions";
import { queryClient } from "@/lib/queryClient";
import { usePageNotifications } from "@/lib/hooks/useNotifications";
import { UserContext } from "@/app/layout";
import CustomCard from "@/components/common/Card";
import { Mail, MapPinIcon } from "lucide-react";
import StatisticsCards from "./StatisticsCards";

function Estimates() {
  const [opened, { open, close }] = useDisclosure(false);
  const [
    deleteModalOpened,
    { open: openDeleteModal, close: closeDeleteModal },
  ] = useDisclosure(false);
  // const [storeId, setStoreId] = useState();
  const [qrCode, setQrCode] = useState("");
  const [storeInfo, setStoreInfo] = useState();
  const [search, setSearch] = useDebouncedState("", 500);
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const notification = usePageNotifications();
  const [deletEstimateId, setDeletEstimateId] = useState();
  const [estimateToDelete, setEstimateToDelete] = useState<any>(null);

  const [state, setState] = useState({
    sortOrder: "",
    sortedColumn: "",
    metaData: {
      totalRecords: 0,
    },
  });

  const { data: estimatesData, isLoading: estimatesLoading } = useQuery({
    queryKey: ["estimates-stats"],
    queryFn: () => callApi.get("/estimates?page=1&limit=1000"), // Fetch all for stats
    select: (data) => data?.data?.data,
  });

  useEffect(() => {
    if (!qrCode) return;
    open();
  }, [qrCode]);

  const deletEstimateMutation = useMutation({
    mutationFn: (id: any) => {
      setDeletEstimateId(id);
      return callApi.delete(`/estimates/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-estimates"] });
      queryClient.invalidateQueries({ queryKey: ["estimates-stats"] });
      notification.success("Estimate deleted successfully");
      closeDeleteModal();
      setEstimateToDelete(null);
    },
    onError: () => {
      notification.error("Failed to delete estimate");
    },
  });

  const handleDeleteClick = (record: any) => {
    setEstimateToDelete(record);
    openDeleteModal();
  };

  const handleConfirmDelete = () => {
    if (estimateToDelete) {
      deletEstimateMutation.mutate(estimateToDelete.id);
    }
  };

  let columns = [
    {
      accessor: "projectName",
      title: "Estimate",
      sortable: true,
      render: ({ projectName, id, type }: any) => {
        if (type === "detailed") {
          return (
            <Link
              href={`/estimates/preview/${id}`}
              style={{ color: "blue", textDecoration: "underline" }}
            >
              {projectName || "N/A"}
            </Link>
          );
        }
        return <Text size="14px">{projectName || "N/A"}</Text>;
      },
    },
    // {
    //   accessor: "projectEstimate",
    //   title: "Project Estimate",
    //   sortable: true,
    //   render: ({ projectEstimate }: any) => projectEstimate || "N/A",
    // },
    {
      accessor: "customerName",
      title: "Client",
      sortable: true,
      render: ({ clients }: any) => (
        <Stack gap={4}>
          {clients?.name || "N/A"}
          <br />
          <Flex gap={4} align="center" c="gray">
            <Mail size={12} />
            <Text size="12px" c="gray">
              {clients?.email || "N/A"}
            </Text>
          </Flex>

          {/* <Flex gap={4} align="center" c="gray">
            <span>
              {" "}
              <MapPinIcon size={14} />
            </span>
            <Text size="12px">{clients?.address || "N/A"}</Text>
          </Flex> */}
        </Stack>
      ),
    },

    {
      accessor: "type",
      textAlign: "left",
      title: "Estimation Type",
      sortable: true,
      render: ({ type }: any) => (
        <Flex gap={4} align="center">
          {/* {type === "home" ? (
            <IconHome size={16} />
          ) : type === "commercial" ? (
            <IconBuilding size={16} />
          ) : (
            <IconHome size={16} />
          )} */}
          <Text size="14px">{type === "detailed" ? "Detailed" : "Quick"}</Text>
        </Flex>
      ),
    },

    {
      accessor: "invoices",
      title: "# of Invoices",
      sortable: true,
      render: ({ invoices }: any) => {
        if (invoices?.length > 0) {
          return (
            <Link
              href={`/invoices/edit/${invoices[0]?.id}`}
              target="_blank"
              style={{ color: "blue", textDecoration: "underline" }}
            >
              <Text size="14px">{invoices.length}</Text>
            </Link>
          );
        }
        return <Text size="14px">{invoices?.length || 0}</Text>;
      },
    },

    {
      accessor: "total_amount",
      title: "Total Amount",
      sortable: true,
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
          {/* */}

          <Link
            href={`/estimates/preview/${record.id}`}
            style={{ color: "blue", textDecoration: "underline" }}
          >
            <Button
              style={{ fontSize: "12px" }}
              variant="table-btn-primary"
              // leftSection={<IconEdit size={16} />}
              disabled={record.type !== "detailed"}
            >
              Edit
            </Button>
          </Link>
          <Button
            style={{ fontSize: "12px" }}
            variant="table-btn-danger"
            // leftSection={<IconTrash size={16} />}
            onClick={() => handleDeleteClick(record)}
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

  const queryFilters: any = {
    url: "/estimates",
    key: "get-estimates",
    page: 1,
    pageSize: 10,
  };

  // const getEstimatesQueryOptions = useDropdownOptions(queryFilters);

  const [options, setOptions] = useState([
    { value: "detailed", label: "Detailed" },
    { value: "quick", label: "Quick" },
  ]);

  const [filterType, setFilterType] = useState<string | null>(null);
  const [filterClientId, setFilterClientId] = useState<string | null>(null);

  const handleTypeChange = (value: string | null) => {
    setFilterType(value);
  };

  const handleClientChange = (value: string | null) => {
    setFilterClientId(value);
  };

  const handleSearch = (value) => {
    setSearch(value);
  };

  const handleRecordsPerPage = () => {};

  const { data: clientOptions } = useQuery({
    queryKey: ["get-clients-dropdown"],
    queryFn: async () => {
      const response = await callApi.get(`/clients`, {
        params: {
          limit: -1,
        },
      });

      return response.data;
    },
    select(data) {
      const options = data?.data?.map((option) => ({
        label: `${option.name} - ${option.email}`,
        value: option.id.toString(),
      }));

      return options;
    },
  });

  const filters = [
    {
      id: "type",
      label: "Estimation Type",
      options: options,
      onChange: (value) => handleTypeChange(value),
    },
    {
      id: "clientId",
      label: "Client",
      options: clientOptions || [],
      onChange: (value) => handleClientChange(value),
    },
    // ... more filters
  ];

  const user = useContext(UserContext);

  const invoicesCount = estimateToDelete?.invoices?.length || 0;
  const jobsCount = estimateToDelete?.jobs?.length || 0;

  return (
    <>
      <Modal
        opened={deleteModalOpened}
        onClose={closeDeleteModal}
        title={
          <Text size="lg" fw={600}>
            Delete Estimate
          </Text>
        }
        centered
        size="md"
      >
        <Stack gap={20}>
          <Text size="sm" c="dimmed">
            Are you sure you want to delete the estimate for{" "}
            <Text component="span" fw={600} c="dark">
              {estimateToDelete?.projectName}
            </Text>
            ?
          </Text>

          {(invoicesCount > 0 || jobsCount > 0) && (
            <Card withBorder padding="md" radius="md" bg="red.0">
              <Stack gap={8}>
                <Text size="sm" fw={600} c="red.7">
                  Warning: This estimate has associated records
                </Text>
                <Stack gap={4}>
                  {invoicesCount > 0 && (
                    <Text size="sm" c="red.7">
                      • {invoicesCount}{" "}
                      {invoicesCount === 1 ? "invoice" : "invoices"}
                    </Text>
                  )}
                  {jobsCount > 0 && (
                    <Text size="sm" c="red.7">
                      • {jobsCount} {jobsCount === 1 ? "job" : "jobs"}
                    </Text>
                  )}
                </Stack>
                <Text size="xs" c="red.6" mt={4}>
                  Deleting this estimate may affect these related records.
                </Text>
              </Stack>
            </Card>
          )}

          <Group justify="flex-end" gap={12}>
            <Button
              variant="subtle"
              color="gray"
              onClick={closeDeleteModal}
              disabled={deletEstimateMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              color="red"
              onClick={handleConfirmDelete}
              loading={deletEstimateMutation.isPending}
            >
              Yes, Delete Estimate
            </Button>
          </Group>
        </Stack>
      </Modal>

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
      <StatisticsCards estimates={estimatesData || []} />
      <div className="flex gap-6 mb-6">
        {/* Total Estimates Card */}
        {/* <CustomCard
// ... existing code ...
          description={`${approvedValue} approved (${winRate}% win rate)`}
        /> */}
      </div>

      <Stack
        gap={20}
        mb={20}
        className=" bg-white shadow-xl rounded-lg shadow-2xl"
      >
        <FilterLayout
          filters={filters}
          onSearch={handleSearch}
          searchable={false}
          // onRecordsPerPageChange={handleRecordsPerPage}
        />

        <CustomTable
          url={"/estimates"}
          queryKey={["get-estimates"]}
          search={search}
          filters={{ type: filterType, clientId: filterClientId }}
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
