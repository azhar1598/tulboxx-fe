import { usePageNotifications } from "@/lib/hooks/useNotifications";
import callApi from "@/services/apiService";
import {
  Button,
  Group,
  Select,
  SimpleGrid,
  Text,
  Textarea,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import React from "react";
import { z } from "zod";

const formSchema = z.object({
  categoryProducts: z.array(
    z.object({
      categoryId: z.string().min(1, "Category ID is required"),
      products: z.array(
        z.object({
          name: z.string(),
          price: z.string(),
        })
      ),
    })
  ),
});

function AddProductForm({ getCategoriesQuery, id, storeId, storeName }: any) {
  const router = useRouter();
  const notification = usePageNotifications();
  const form = useForm({
    initialValues: {
      categoryProducts: [
        {
          categoryId: "",
          products: [{ name: "", price: "" }],
        },
      ],
    },
  });

  // Sample categories - replace with your actual categories
  console.log("getCategories", getCategoriesQuery);

  const handleTextAreaChange = (value: string, index: number) => {
    // Split the textarea content by new lines
    const lines = value.split("\n").filter((line) => line.trim()); // Remove empty lines

    // Create a new products array by parsing comma-separated values
    const newProducts = lines.map((line) => {
      const [name, price] = line.split(",").map((item) => item.trim());
      return {
        name: name || "",
        price: price || "",
      };
    });

    console.log("Parsed products:", {
      lines,
      newProducts,
    });

    // Update the form with new products array
    form.setFieldValue(`categoryProducts.${index}.products`, newProducts);
  };

  const handleSubmit = (values) => {
    console.log("Submitted data:", values);
  };

  const addProducts = useMutation({
    mutationFn: () => callApi.post(`/v1/stores/${id}/products`, form.values),
    onSuccess: async (res) => {
      const { data } = res;
      router.push(`/products?storeName=${storeName}&storeId=${storeId}`);
      notification.success(`Products added   successfully`);
    },
    onError: (err) => {
      notification.error(err.message);
      console.error(err);
    },
  });

  return (
    <form
      onSubmit={form.onSubmit((values) => {
        addProducts.mutate();
      })}
    >
      <SimpleGrid cols={2} spacing="lg">
        {form.values.categoryProducts.map((item, index) => (
          <React.Fragment key={index}>
            <Group gap={0}>
              <Select
                label="Choose category"
                placeholder="Select a category"
                data={getCategoriesQuery}
                w="100%"
                {...form.getInputProps(`categoryProducts.${index}.categoryId`)}
              />
              <Text
                size="xs"
                color="blue"
                td="underline"
                className="cursor-pointer"
                onClick={() => {
                  const categoryId =
                    form.values.categoryProducts[index].categoryId;
                  if (categoryId) {
                    console.log(`View products for category ${categoryId}`);
                  }
                }}
              >
                View Products belong to this category
              </Text>
            </Group>
            <Group>
              <Textarea
                label="Bulk Add Products"
                placeholder="Enter products as: name,price (one per line)"
                description="Example: Product Name,100"
                w="100%"
                minRows={4}
                onChange={(event) =>
                  handleTextAreaChange(event.currentTarget.value, index)
                }
              />
            </Group>
          </React.Fragment>
        ))}
      </SimpleGrid>

      <Group mt="xl" justify="flex-start">
        <Button
          w={200}
          variant="outline"
          onClick={() =>
            form.insertListItem("products", {
              categoryId: "",
              products: [{ name: "", price: "" }],
            })
          }
        >
          Add Another Category
        </Button>
        <Button type="submit" w={200}>
          Save Changes
        </Button>
      </Group>
    </form>
  );
}

export default AddProductForm;
