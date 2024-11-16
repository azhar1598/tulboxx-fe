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
import React, { useEffect } from "react";

function AddProductForm({ getCategoriesQuery, id, storeId, storeName }: any) {
  const router = useRouter();
  const notification = usePageNotifications();

  useEffect(() => {
    if (getCategoriesQuery?.length > 0) {
      const initialCategoryProducts = getCategoriesQuery.map(() => ({
        categoryId: "",
        products: [],
      }));
      form.setValues({ categoryProducts: initialCategoryProducts });
    }
  }, [getCategoriesQuery]);

  const form = useForm({
    initialValues: {
      categoryProducts: [
        {
          categoryId: "",
          products: [],
        },
      ],
    },
    validate: {
      categoryProducts: {
        categoryId: (value, values, path) => {
          const index = parseInt(path.split(".")[1]);

          // If no category is selected, that's fine
          if (!value) return null;

          // If category is selected, check for duplicates
          const categories = values.categoryProducts
            .filter((cp) => cp.categoryId) // Only consider categories that are selected
            .map((cp) => cp.categoryId);
          const duplicateCount = categories.filter((c) => c === value).length;

          if (duplicateCount > 1) return "This category is already selected";

          // If category is selected but no products, show error
          const products = values.categoryProducts[index].products;
          if (products.length === 0)
            return "Please add products for this category";

          return null;
        },
      },
    },
  });

  const handleTextAreaChange = (value: string, index: number) => {
    const lines = value.split("\n").filter((line) => line.trim());
    const newProducts = lines.map((line) => {
      const [name, price] = line.split(",").map((item) => item.trim());
      return {
        name: name || "",
        price: parseFloat(price) || 0,
      };
    });
    form.setFieldValue(`categoryProducts.${index}.products`, newProducts);
  };

  const addProducts = useMutation({
    mutationFn: () => {
      // Filter out empty categories and transform data
      const transformedData = {
        categoryProducts: form.values.categoryProducts
          .filter((cp) => cp.categoryId && cp.products.length > 0) // Only include categories with products
          .map((cp) => ({
            categoryId: parseInt(cp.categoryId),
            products: cp.products,
          })),
      };

      return callApi.post(`/v1/stores/${id}/products`, transformedData);
    },
    onSuccess: async (res) => {
      const { data } = res;
      router.push(`/products?storeName=${storeName}&storeId=${storeId}`);
      notification.success(`Products added successfully`);
    },
    onError: (err) => {
      notification.error(err.message);
      console.error(err);
    },
  });

  // Check if form has at least one valid category with products
  const hasValidData = () => {
    return form.values.categoryProducts.some(
      (cp) => cp.categoryId && cp.products.length > 0
    );
  };

  return (
    <form
      onSubmit={form.onSubmit(() => {
        addProducts.mutate();
      })}
    >
      <SimpleGrid cols={2} spacing="lg">
        {getCategoriesQuery?.map((item, index) => (
          <React.Fragment key={index}>
            <Group gap={0}>
              <Select
                label="Choose category"
                placeholder="Select a category"
                data={getCategoriesQuery}
                w="100%"
                error={
                  form.getInputProps(`categoryProducts.${index}.categoryId`)
                    .error
                }
                {...form.getInputProps(`categoryProducts.${index}.categoryId`)}
              />
            </Group>
            <Group>
              <Textarea
                label="Bulk Add Products"
                placeholder="Enter products as: name,price (one per line)"
                description="Example: Product Name,100"
                w="100%"
                minRows={6}
                onChange={(event) =>
                  handleTextAreaChange(event.currentTarget.value, index)
                }
              />
              {form.values.categoryProducts[index]?.categoryId &&
                form.values.categoryProducts[index].products.length === 0 && (
                  <Text color="red" size="sm" mt={5}>
                    Please add products for this category
                  </Text>
                )}
            </Group>
          </React.Fragment>
        ))}
      </SimpleGrid>

      <Group mt="xl" justify="flex-start">
        <Button type="submit" w={200} disabled={!hasValidData()}>
          Add Product
        </Button>
      </Group>
    </form>
  );
}

export default AddProductForm;
