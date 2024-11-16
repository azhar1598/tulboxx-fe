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
  Flex,
  Group,
  Modal,
  Select,
  Stack,
  Text,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconArrowRight, IconPlus, IconQrcode } from "@tabler/icons-react";

import Link from "next/link";
import React, { useEffect, useState } from "react";

import { checkStatus } from "@/lib/constants";
import { useRouter, useSearchParams } from "next/navigation";
import { useDropdownOptions } from "@/lib/hooks/useDropdownOptions";
import { useForm } from "@mantine/form";
import { useTableQuery } from "@/lib/hooks/useTableQuery";
import { useMutation } from "@tanstack/react-query";
import { usePageNotifications } from "@/lib/hooks/useNotifications";

function CategoryListing() {
  const formFilters = useForm({
    initialValues: {
      store: { label: "", value: "" },
      categories: "",
    },
  });

  const [opened, { open, close }] = useDisclosure(false);
  const [qrCode, setQrCode] = useState("");
  const [storeInfo, setStoreInfo] = useState();
  //   const [selectedStore, setSelectedStore] = useState({ label: "", value: "" });

  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("storeId");
  const name = searchParams.get("storeName");
  const notification = usePageNotifications();

  useEffect(() => {
    if (!id) open();
    formFilters.setFieldValue("store", { label: name, value: id });
  }, [id]);

  const handleContinue = () => {
    router.push(
      `/categories?storeName=${formFilters.values.store.label}&storeId=${formFilters.values.store.value}`
    );
    close();
  };

  console.log("form.valies", formFilters.values.store);

  const handleModalClose = () => {
    // Only allow closing if a store is selected
    if (id) {
      setQrCode("");
      close();
    }
  };

  let columns = [
    {
      accessor: "name",
      title: "Category Name",
      render: ({ name, tagLine, id }: any) => name,
    },
    {
      accessor: "price",
      title: "Price",
      render: ({ currency, price }: any) => (
        <Text size="14px" c={"gray"}>
          {currency} {price}
        </Text>
      ),
    },
    {
      accessor: "actions",
      title: <Box mr={6}>Row actions</Box>,
      width: "220px",
      textAlign: "right",
      render: (record) => (
        <Flex gap={5}>
          <Link href={`/categories/${record.id}/edit?storeId=${id}`}>
            <Button variant="table-btn-primary" onClick={() => {}}>
              Edit
            </Button>
          </Link>
          <Button
            variant="table-btn-danger"
            onClick={() => {
              deleteCategoryMutation.mutate(record);
            }}
            loading={deleteCategoryMutation.isPending}
          >
            Delete
          </Button>
        </Flex>
      ),
    },
  ];

  const handleTypeChange = () => {};
  const handleSearch = () => {};
  const handleRecordsPerPage = () => {};

  const [page, setPage] = useState(1);
  const pageSize = 10;

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const queryFilters = {
    url: "/v1/stores",
    key: "get-stores",
    page,
    pageSize,
  };

  const getStoresQuery = useDropdownOptions(queryFilters);

  const filters = [
    {
      id: "type",
      label: "Stores",
      options: getStoresQuery,
      form: formFilters,
      fieldName: "store",

      onChange: (option) => {
        // formFilters.getInputProps("store").onChange(option);
        // setSelectedStore(option);
        console.log("ooo", option);
        router.push(
          `/categories?storeName=${option.label}&storeId=${option.value}`
        );
      },
    },
    {
      id: "type",
      label: "Categories",
      options: [],
      onChange: () => {},
    },
  ];

  const tableQueryFilters = {
    url: `/v1/stores/${id}/categories`,
    key: "get-categories",
    page,
    pageSize,
  };

  const getCategoriesQuery = useTableQuery(tableQueryFilters);

  const deleteCategoryMutation = useMutation({
    mutationFn: (record: any) =>
      callApi.delete(`/v1/stores/${id}/categories/${record.id}`, {
        data: {
          sharedColorwayIds: [record.id],
        },
      }),
    onSuccess: (record) => {
      //   getCategoriesQuery.refetch;
      notification.success(`Category deleted successfully`);
    },
  });

  return (
    <>
      <div className="mb-4">
        <PageHeader
          title={`Categories: ${name}`}
          rightSection={
            <Group>
              <Link href={`/categories/${id}/add`}>
                <Button leftSection={<IconPlus size={16} />}>
                  Add Category
                </Button>
              </Link>
            </Group>
          }
        />
      </div>
      <Stack gap={20} mb={20} className="bg-white shadow-xl">
        <FilterLayout
          filters={!id ? [filters[0]] : filters}
          onSearch={handleSearch}
          onRecordsPerPage={handleRecordsPerPage}
        />
        <CustomTable
          records={getCategoriesQuery?.tableData || []}
          columns={columns}
          totalRecords={getCategoriesQuery?.totalResults || 0}
          currentPage={getCategoriesQuery?.currentPage || 0}
          pageSize={getCategoriesQuery?.pageSize || 0}
          onPageChange={handlePageChange}
          isLoading={getCategoriesQuery.isLoading}
        />
      </Stack>

      <Modal
        opened={opened}
        onClose={handleModalClose}
        title="Choose Store"
        size="md"
        centered
        closeOnClickOutside={!!id}
        closeOnEscape={!!id}
      >
        <Stack className="items-center p-4">
          <Select
            label="Please select the store to continue"
            placeholder="Pick store"
            data={getStoresQuery || []}
            searchable
            {...formFilters.getInputProps("store.value")}
            onChange={(value, option) => {
              formFilters.setFieldValue("store", option);
              //   handleStoreSelect(option);
            }}
            required
            allowDeselect={false}
          />
          <Button
            rightSection={<IconArrowRight stroke={2} size={20} />}
            className="mt-4"
            onClick={handleContinue}
            disabled={!formFilters.values.store?.value}
          >
            Continue
          </Button>
        </Stack>
      </Modal>
    </>
  );
}

export default CategoryListing;
