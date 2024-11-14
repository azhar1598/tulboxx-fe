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
import { Button, Group, SimpleGrid, Stack, TextInput } from "@mantine/core";
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
        title={`Create Category: ${getStoreById?.data?.data?.name}`}
      />
      <PageMainWrapper>
        <Stack>
          <Group>
            <TextInput label="Category" w={"70%"} />
          </Group>
          <Button w={200}>Create</Button>
        </Stack>
      </PageMainWrapper>
    </>
  );
}

export default AddProductPage;
