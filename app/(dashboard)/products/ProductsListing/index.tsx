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

function ProductsListing() {
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

  useEffect(() => {
    if (!id) open();
    formFilters.setFieldValue("store", { label: name, value: id });
  }, [id]);

  const handleContinue = () => {
    router.push(
      `/products?storeName=${formFilters.values.store.label}&storeId=${formFilters.values.store.value}`
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
      title: "Product Name",
      render: ({ name, tagLine, id }: any) => (
        <Link
          href={`/stores/${id}`}
          style={{ color: "blue", textDecoration: "underline" }}
        >
          {name}{" "}
          <small>
            <i className="text-gray-500">({tagLine})</i>
          </small>
        </Link>
      ),
    },
    {
      accessor: "price",
      title: "Price",
      render: ({ licenseId }: any) => licenseId || "N/A",
    },
    {
      accessor: "category",
      title: "Category",
      render: ({ city }: any) => city || "N/A",
    },

    {
      accessor: "actions",
      title: <Box mr={6}>Row actions</Box>,
      textAlign: "right",
      render: (record) => (
        <Button
          style={{ fontSize: "12px" }}
          variant="table"
          onClick={() => {
            handleModal(record.id, record);
          }}
          leftSection={<IconQrcode size={16} />}
        >
          Generate QR
        </Button>
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
          `/products?storeName=${option.label}&storeId=${option.value}`
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

  return (
    <>
      <div className="mb-4">
        <PageHeader
          title={`Products: ${name}`}
          rightSection={
            <Group>
              <Link href={`/products/${id}/add`}>
                <Button leftSection={<IconPlus size={16} />}>
                  Add Products
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
          records={getStoresQuery?.tableData || []}
          columns={columns}
          totalRecords={getStoresQuery?.totalResults || 0}
          currentPage={getStoresQuery?.currentPage || 0}
          pageSize={getStoresQuery?.pageSize || 0}
          onPageChange={handlePageChange}
          //   isLoading={getStoresQuery.isLoading}
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

export default ProductsListing;
