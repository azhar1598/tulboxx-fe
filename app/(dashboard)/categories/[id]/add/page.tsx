"use client";
import { PageHeader } from "@/components/common/PageHeader";
import { useForm, zodResolver } from "@mantine/form";
import { z } from "zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import callApi from "@/services/apiService";
import { useParams, useRouter } from "next/navigation";
import { IconPlus } from "@tabler/icons-react";
import { Button, Flex, Stack, FileInput, TextInput } from "@mantine/core";
import PageMainWrapper from "@/components/common/PageMainWrapper";
import { usePageNotifications } from "@/lib/hooks/useNotifications";

const formSchema = z.object({
  categories: z.array(
    z.object({
      name: z.string().min(1, "Category name is required"),
      image: z.any().optional(),
    })
  ),
});

function AddProductPage() {
  const { id } = useParams();
  const router = useRouter();
  const notification = usePageNotifications();

  const getStoreById = useQuery({
    queryKey: ["get-store-by-id"],
    queryFn: async () => {
      const response = await callApi.get(`/v1/stores/${id}`);
      return response.data;
    },
    select: (data) => data,
  });

  const form = useForm({
    validate: zodResolver(formSchema),
    initialValues: {
      categories: [{ name: "", image: null }],
    },
  });

  const handleAddCategory = () => {
    form.setFieldValue("categories", [
      ...form.values.categories,
      { name: "", image: null },
    ]);
  };

  const prepareFormData = (values) => {
    const formData = new FormData();

    values.categories.forEach((category, categoryIndex) => {
      formData.append(`categories[${categoryIndex}][name]`, category.name);

      if (category.image && Array.isArray(category.image)) {
        category.image.forEach((file, imageIndex) => {
          formData.append(
            `category-${categoryIndex}-${imageIndex}-image`,
            file,
            file.name
          );
        });
      } else if (category.image) {
        formData.append(
          `category-${categoryIndex}-0-image`,
          category.image,
          category.image.name
        );
      }
    });

    return formData;
  };

  const createCategory = useMutation({
    mutationFn: (formData) =>
      callApi.post(`/v1/stores/${id}/categories`, formData),
    onSuccess: async (res) => {
      const { data } = res;
      router.push(`/products/${id}/add`);
      notification.success(`Category created successfully`);
    },
    onError: (err) => {
      notification.error(err.message);
      console.error(err);
    },
  });

  return (
    <>
      <PageHeader
        title={`Create Category: ${getStoreById?.data?.data?.name}`}
      />
      <PageMainWrapper>
        <form
          onSubmit={form.onSubmit((values) => {
            const formData = prepareFormData(values);

            console.log("fff", formData, values);
            createCategory.mutate(formData);
          })}
        >
          {form.values.categories.map((_, index) => (
            <Stack key={index} mb={20}>
              <Flex gap={10}>
                <TextInput
                  label="Category Name"
                  {...form.getInputProps(`categories.${index}.name`)}
                  w={300}
                />
                <FileInput
                  label="Category Image"
                  {...form.getInputProps(`categories.${index}.image`)}
                  w={300}
                  multiple
                  accept="image/*"
                />
                {form.values.categories.length === index + 1 && (
                  <Button
                    leftSection={<IconPlus />}
                    mt={24}
                    onClick={handleAddCategory}
                    w={200}
                  >
                    Add Category
                  </Button>
                )}
              </Flex>
            </Stack>
          ))}

          <Button type="submit" w={200} loading={createCategory.isPending}>
            Create
          </Button>
        </form>
      </PageMainWrapper>
    </>
  );
}

export default AddProductPage;
