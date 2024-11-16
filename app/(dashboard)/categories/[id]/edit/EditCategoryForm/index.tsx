"use client";
import { PageHeader } from "@/components/common/PageHeader";
import { useForm, zodResolver } from "@mantine/form";
import { z } from "zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import callApi from "@/services/apiService";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { IconPlus } from "@tabler/icons-react";
import { Button, Flex, Stack, FileInput, TextInput } from "@mantine/core";
import PageMainWrapper from "@/components/common/PageMainWrapper";
import { usePageNotifications } from "@/lib/hooks/useNotifications";
import { useEffect } from "react";

const formSchema = z.object({
  name: z.string().min(1, "Category name is required"),
  images: z.array(z.string()),
});

function EditCategoryForm() {
  const { id } = useParams();
  const router = useRouter();
  const notification = usePageNotifications();

  const searchParams = useSearchParams();
  const storeId = searchParams.get("storeId");

  const getStoreById = useQuery({
    queryKey: ["get-store-by-id"],
    queryFn: async () => {
      const response = await callApi.get(`/v1/stores/${storeId}`);
      return response.data;
    },
    select: (data) => data,
  });

  const getCategoryById = useQuery({
    queryKey: ["get-category-by-id"],
    queryFn: async () => {
      const response = await callApi.get(
        `/v1/stores/${storeId}/categories/${id}`
      );
      return response.data;
    },
    select: (data) => data,
  });

  const form = useForm({
    validate: zodResolver(formSchema),
    initialValues: {
      name: "",
      images: [],
    },
  });

  useEffect(() => {
    if (!getCategoryById?.data) return;

    // Simply set the API data to form values
    form.setValues({
      name: getCategoryById.data?.data.name,
      images: getCategoryById.data?.data.images,
    });
  }, [getCategoryById?.data]);

  console.log("nnnn", getCategoryById?.data, form.values);

  //   const prepareFormData = (values) => {
  //     const formData = new FormData();

  //     values.categories.forEach((category, categoryIndex) => {
  //       // Add category name
  //       formData.append(`categories[${categoryIndex}][name]`, category.name);

  //       // Add category images
  //       if (category.image && Array.isArray(category.image)) {
  //         category.image.forEach((file, imageIndex) => {
  //           formData.append(
  //             `category-${categoryIndex}-${imageIndex}-image`,
  //             file,
  //             file.name
  //           );
  //         });
  //       } else if (category.image) {
  //         // Handle single file upload
  //         formData.append(
  //           `category-${categoryIndex}-0-image`,
  //           category.image,
  //           category.image.name
  //         );
  //       }
  //     });

  //     return formData;
  //   };

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
      <PageHeader title={`Edit Category: ${getStoreById?.data?.data?.name}`} />
      <PageMainWrapper>
        <form
          onSubmit={form.onSubmit((values) => {
            // const formData = prepareFormData(values);
            // createCategory.mutate(formData);
          })}
        >
          <Stack mb={20}>
            <Flex gap={10}>
              <TextInput
                label="Category Name"
                {...form.getInputProps("name")}
                w={300}
              />
              <FileInput
                label="Category Image"
                {...form.getInputProps("image")}
                w={300}
                multiple
                accept="image/*"
              />
            </Flex>
            {/* Display existing images */}
            {form.values.images && (
              <Flex gap={10}>
                {form.values.images.map((imageUrl, index) => (
                  <img
                    key={index}
                    src={imageUrl}
                    alt={`Category image ${index}`}
                    style={{ width: 100, height: 100, objectFit: "cover" }}
                  />
                ))}
              </Flex>
            )}
          </Stack>

          <Button type="submit" w={200} loading={createCategory.isPending}>
            Save
          </Button>
        </form>
      </PageMainWrapper>
    </>
  );
}

export default EditCategoryForm;
