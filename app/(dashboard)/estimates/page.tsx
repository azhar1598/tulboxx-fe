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
import { useDropdownOptions } from "@/lib/hooks/useDropdownOptions";
import { queryClient } from "@/lib/queryClient";
import { usePageNotifications } from "@/lib/hooks/useNotifications";
import { UserContext } from "@/app/layout";
import CustomCard from "@/components/common/Card";
import { Mail, MapPinIcon } from "lucide-react";
import StatisticsCards from "./StatisticsCards";

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
      sortable: true,
      render: ({ projectName, id, type }: any) => {
        return (
          <Link
            href={`/estimates/preview/${id}`}
            style={{ color: "blue", textDecoration: "underline" }}
          >
            {projectName || "N/A"}
          </Link>
        );
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
      title: "Customer",
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
            >
              Edit
            </Button>
          </Link>
          <Button
            style={{ fontSize: "12px" }}
            variant="table-btn-danger"
            // leftSection={<IconTrash size={16} />}
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

  const queryFilters: any = {
    url: "/estimates",
    key: "get-estimates",
    page: 1,
    pageSize: 10,
  };

  const getEstimatesQueryOptions = useDropdownOptions(queryFilters);

  const [options, setOptions] = useState([]);

  useEffect(() => {
    if (!getEstimatesQueryOptions) return;

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
          searchable={true}
          // onRecordsPerPageChange={handleRecordsPerPage}
        />

        <CustomTable
          url={"/estimates"}
          queryKey={["get-estimates"]}
          search={search}
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
