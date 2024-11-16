import React, { useEffect } from "react";
import { usePageNotifications } from "@/lib/hooks/useNotifications";
import callApi from "@/services/apiService";
import { Button, Group, TextInput, Paper, Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

function EditProductForm({ id, storeId, storeName, getProductById }) {
  const router = useRouter();
  const notification = usePageNotifications();

  const form = useForm({
    initialValues: {
      name: "",
      price: "",
      currency: "INR",
    },
  });

  useEffect(() => {
    if (!getProductById?.data) return;

    form.setValues({
      name: getProductById.data.name,
      price: getProductById.data.price.toString(),
      currency: getProductById.data.currency,
    });
    form.resetDirty();
  }, [getProductById?.data]);

  const saveProductQuery = useMutation({
    mutationFn: () =>
      callApi.patch(`/v1/stores/${storeId}/products/${id}`, form.values),
    onSuccess: async () => {
      router.push(`/products?storeName=${storeName}&storeId=${storeId}`);
      notification.success(`Product updated successfully`);
    },
    onError: (err) => {
      notification.error(err.message);
      console.error(err);
    },
  });

  const isFormValid = () => {
    return (
      form.values.name?.trim() && form.values.price?.trim() && form.isDirty()
    );
  };

  return (
    <Paper shadow="xs" p="md">
      <form onSubmit={form.onSubmit(() => saveProductQuery.mutate())}>
        <Stack gap="md">
          <TextInput
            label="Product Name"
            placeholder="Enter product name"
            {...form.getInputProps("name")}
            required
          />

          <TextInput
            label="Price"
            placeholder="Enter price"
            type="number"
            {...form.getInputProps("price")}
            required
          />

          <Group justify="flex-start">
            <Button
              type="submit"
              w={200}
              disabled={!isFormValid()}
              loading={saveProductQuery.isPending}
            >
              Update Product
            </Button>
          </Group>
        </Stack>
      </form>
    </Paper>
  );
}

export default EditProductForm;
