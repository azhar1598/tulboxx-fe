"use client";
import { PageHeader } from "@/components/common/PageHeader";
import React from "react";
import MerchantForm from "./MerchantForm";
import PageMainWrapper from "@/components/common/PageMainWrapper";
import MainLayout from "@/components/common/MainLayout";
import AddProductsForm from "./ProductForm";
import { useQuery } from "@tanstack/react-query";
import callApi from "@/services/apiService";
import { useParams } from "next/navigation";
import { IconPlus } from "@tabler/icons-react";
import { Button, Group } from "@mantine/core";
import Link from "next/link";

function AddProductPage() {
  const { id } = useParams();

  const getStoreById = useQuery({
    queryKey: ["get-store-by-id"],
    queryFn: async () => {
      const response = await callApi.get(`/v1/stores/${id}`);
      return response.data;
    },
    select: (data) => {
      // Update form with fetched data
      console.log("ddd", data.data);
      return data;
    },
  });
  return (
    <>
      <PageHeader
        title={`Add Product: ${getStoreById?.data?.data?.name}`}
        rightSection={
          <Group>
            <Link href={`/categories/${id}/add`}>
              <Button leftSection={<IconPlus size={16} />}>
                Create Category
              </Button>
            </Link>
          </Group>
        }
      />
      <PageMainWrapper w={"full"}>
        <AddProductsForm />
      </PageMainWrapper>
    </>
  );
}

export default AddProductPage;
