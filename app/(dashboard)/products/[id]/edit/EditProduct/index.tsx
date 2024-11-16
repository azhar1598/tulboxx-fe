"use client";
import { PageHeader } from "@/components/common/PageHeader";
import React, { useEffect } from "react";
import PageMainWrapper from "@/components/common/PageMainWrapper";
import MainLayout from "@/components/common/MainLayout";
import AddProductsForm from "./EditProductForm";
import { useQuery } from "@tanstack/react-query";
import callApi from "@/services/apiService";
import { useParams, useSearchParams } from "next/navigation";
import { IconPlus } from "@tabler/icons-react";
import { Button, Group } from "@mantine/core";
import Link from "next/link";
import { useDropdownOptions } from "@/lib/hooks/useDropdownOptions";
import EditProductForm from "./EditProductForm";

function EditProductPage() {
  const { id } = useParams();

  const searchParams = useSearchParams();
  const storeId = searchParams.get("storeId");

  const getStoreById = useQuery({
    queryKey: ["get-store-by-id"],
    queryFn: async () => {
      const response = await callApi.get(`/v1/stores/${storeId}`);
      return response.data;
    },
    select: (data) => {
      return data;
    },
  });

  const getProductById = useQuery({
    queryKey: ["get-product-by-id"],
    queryFn: async () => {
      const response = await callApi.get(
        `/v1/stores/${storeId}/products/${id}`
      );
      return response.data;
    },
    select: (data) => {
      return data;
    },
  });

  const queryFilters = {
    url: `/v1/stores/${storeId}/categories`,
    key: "get-stores",
    page: 1,
    pageSize: 100,
  };

  const getCategoriesQuery = useDropdownOptions(queryFilters);

  return (
    <>
      <PageHeader
        title={`Edit Product: ${getStoreById?.data?.data?.name}`}
        rightSection={
          <Group>
            <Link href={`/categories/${storeId}/add`}>
              <Button leftSection={<IconPlus size={16} />}>
                Create Category
              </Button>
            </Link>
          </Group>
        }
      />
      <PageMainWrapper w={"full"}>
        <EditProductForm
          storeId={getStoreById?.data?.data?.id}
          storeName={getStoreById?.data?.data?.name}
          getProductById={getProductById?.data}
          id={id}
        />
      </PageMainWrapper>
    </>
  );
}

export default EditProductPage;
