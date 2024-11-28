"use client";
import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { useForm, zodResolver } from "@mantine/form";
import { z } from "zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import callApi from "@/services/apiService";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import {
  IconPlus,
  IconTrash,
  IconPhoto,
  IconUpload,
  IconChevronRight,
  IconChevronLeft,
  IconX,
} from "@tabler/icons-react";
import {
  Button,
  Flex,
  Stack,
  FileInput,
  TextInput,
  Modal,
  Image,
  Grid,
  ScrollArea,
  Group,
  Text,
  Badge,
  Tooltip,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import PageMainWrapper from "@/components/common/PageMainWrapper";
import { usePageNotifications } from "@/lib/hooks/useNotifications";
import { PEXELS_API_KEY } from "@/lib/constants";

const formSchema = z.object({
  categories: z.array(
    z.object({
      name: z.string().min(1, "Category name is required"),
      deviceImages: z.array(z.any()).optional(),
      pexelsImages: z.array(z.any()).optional(),
    })
  ),
});

function CategoryForm() {
  const { id } = useParams();
  const router = useRouter();
  const notification = usePageNotifications();
  const [opened, { open, close }] = useDisclosure(false);
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [pexelsSearchTerm, setPexelsSearchTerm] = useState("");
  const [pexelsPage, setPexelsPage] = useState(1);

  // Pexels Images Query
  const getPexelsImages = useQuery({
    queryKey: ["get-pexels-images", pexelsSearchTerm, pexelsPage],
    queryFn: async () => {
      if (!pexelsSearchTerm)
        return { photos: [], total_results: 0, per_page: 15 };
      const response = await axios.get(
        `https://api.pexels.com/v1/search?query=${pexelsSearchTerm}&page=${pexelsPage}&per_page=15&orientation=portrait`,
        {
          headers: {
            Authorization: PEXELS_API_KEY,
          },
        }
      );
      return response.data;
    },
    enabled: !!pexelsSearchTerm,
  });

  // Store Details Query
  const getStoreById = useQuery({
    queryKey: ["get-store-by-id"],
    queryFn: async () => {
      const response = await callApi.get(`/v1/stores/${id}`);
      return response.data;
    },
    select: (data) => data,
  });

  // Form Initialization
  const form = useForm<any>({
    initialValues: {
      categories: [
        {
          name: "",
          deviceImages: [],
          pexelsImages: [],
        },
      ],
    },
    validate: zodResolver(formSchema),
  });

  // Add a new category
  const handleAddCategory = () => {
    form.setFieldValue("categories", [
      ...form.values?.categories,
      {
        name: "",
        deviceImages: [],
        pexelsImages: [],
      },
    ]);
  };

  // Remove a category
  const handleRemoveCategory = (indexToRemove: number) => {
    if (form.values.categories.length > 1) {
      const updatedCategories = form.values.categories.filter(
        (_, index) => index !== indexToRemove
      );
      form.setFieldValue("categories", updatedCategories);
    }
  };

  // Open Pexels modal for a specific category
  const handleOpenPexelsModal = (categoryIndex: number) => {
    setCurrentCategoryIndex(categoryIndex);
    open();
  };

  // Select Pexels image
  const handleSelectPexelsImage = (imageUrl: string) => {
    fetch(imageUrl)
      .then((response) => response.blob())
      .then((blob) => {
        const file = new File([blob], "pexels-image.jpg", {
          type: "image/jpeg",
        });

        const currentPexelsImages =
          form.values.categories[currentCategoryIndex].pexelsImages || [];

        form.setFieldValue(`categories.${currentCategoryIndex}.pexelsImages`, [
          ...currentPexelsImages,
          file,
        ]);
      });
  };

  // Remove device image
  const handleRemoveDeviceImage = (
    categoryIndex: number,
    imageIndex: number
  ) => {
    const currentDeviceImages =
      form.values.categories[categoryIndex].deviceImages || [];
    const updatedDeviceImages = currentDeviceImages.filter(
      (_, index) => index !== imageIndex
    );

    form.setFieldValue(
      `categories.${categoryIndex}.deviceImages`,
      updatedDeviceImages
    );
  };

  // Remove Pexels image
  const handleRemovePexelsImage = (
    categoryIndex: number,
    imageIndex: number
  ) => {
    const currentPexelsImages =
      form.values.categories[categoryIndex].pexelsImages || [];
    const updatedPexelsImages = currentPexelsImages.filter(
      (_, index) => index !== imageIndex
    );

    form.setFieldValue(
      `categories.${categoryIndex}.pexelsImages`,
      updatedPexelsImages
    );
  };

  // Pagination - next page
  const handleNextPage = () => {
    const totalPages = Math.ceil(
      (getPexelsImages.data?.total_results || 0) / 15
    );
    if (pexelsPage < totalPages) {
      setPexelsPage((prev) => prev + 1);
    }
  };

  // Pagination - previous page
  const handlePreviousPage = () => {
    if (pexelsPage > 1) {
      setPexelsPage((prev) => prev - 1);
    }
  };

  // Prepare form data for submission
  const prepareFormData = (values) => {
    const formData = new FormData();

    values.categories.forEach((category, categoryIndex) => {
      // Add category name
      formData.append(`categories[${categoryIndex}][name]`, category.name);

      // Add device images
      if (category.deviceImages) {
        category.deviceImages.forEach((file, imageIndex) => {
          formData.append(
            `category-${categoryIndex}-device-${imageIndex}-image`,
            file,
            file.name
          );
        });
      }

      // Add Pexels images
      if (category.pexelsImages) {
        category.pexelsImages.forEach((file, imageIndex) => {
          formData.append(
            `category-${categoryIndex}-pexels-${imageIndex}-image`,
            file,
            file.name
          );
        });
      }
    });

    return formData;
  };

  // Create category mutation
  const createCategory = useMutation({
    mutationFn: (formData) =>
      callApi.post(`/v1/stores/${id}/categories`, formData),
    onSuccess: async (res) => {
      router.push(`/products/${id}/add`);
      notification.success(`Category created successfully`);
    },
    onError: (err) => {
      notification.error(err.message);
      console.error(err);
    },
  });

  console.log("fff", form.values);
  return (
    <>
      <PageHeader
        title={`Create Category: ${getStoreById?.data?.data?.name}`}
      />
      <PageMainWrapper>
        <form
          onSubmit={form.onSubmit((values) => {
            const formData: any = prepareFormData(values);
            createCategory.mutate(formData);
          })}
        >
          {form.values.categories.map((category, index) => (
            <Stack key={index} mb={20}>
              <Flex gap={10}>
                <TextInput
                  label="Category Name"
                  {...form.getInputProps(`categories.${index}.name`)}
                  w={300}
                />
                <FileInput
                  label="Upload Device Images"
                  multiple
                  accept="image/*"
                  w={300}
                  onChange={(files) => {
                    const currentDeviceImages =
                      form.values.categories[index].deviceImages || [];
                    form.setFieldValue(`categories.${index}.deviceImages`, [
                      ...currentDeviceImages,
                      ...files,
                    ]);
                  }}
                />
                <Button
                  leftSection={<IconPhoto size={16} />}
                  mt={24}
                  onClick={() => handleOpenPexelsModal(index)}
                  w={200}
                >
                  Select from Pexels
                </Button>
                {form.values.categories.length > 1 && (
                  <Button
                    color="red"
                    leftSection={<IconTrash size={16} />}
                    mt={24}
                    onClick={() => handleRemoveCategory(index)}
                    w={200}
                  >
                    Remove Category
                  </Button>
                )}
                {form.values.categories.length === index + 1 && (
                  <Button
                    leftSection={<IconPlus size={16} />}
                    mt={24}
                    onClick={handleAddCategory}
                    w={200}
                  >
                    Add Category
                  </Button>
                )}
              </Flex>

              {/* Device Images Preview */}
              {category.deviceImages && category.deviceImages.length > 0 && (
                <Flex gap={10} mt={10}>
                  {category.deviceImages.map((file, imageIndex) => (
                    <Tooltip key={imageIndex} label="Remove Image">
                      <div style={{ position: "relative" }}>
                        <Image
                          src={URL.createObjectURL(file)}
                          alt={`Device Image ${imageIndex + 1}`}
                          w={100}
                          h={100}
                          fit="cover"
                        />
                        <Button
                          color="red"
                          size="xs"
                          style={{
                            position: "absolute",
                            top: -10,
                            right: -10,
                            padding: 0,
                            width: 20,
                            height: 20,
                          }}
                          onClick={() =>
                            handleRemoveDeviceImage(index, imageIndex)
                          }
                        >
                          <IconX size={12} />
                        </Button>
                      </div>
                    </Tooltip>
                  ))}
                </Flex>
              )}

              {/* Pexels Images Preview */}
              {category.pexelsImages && category.pexelsImages.length > 0 && (
                <Flex gap={10} mt={10}>
                  {category.pexelsImages.map((file, imageIndex) => (
                    <Tooltip key={imageIndex} label="Remove Image">
                      <div style={{ position: "relative" }}>
                        <Image
                          src={URL.createObjectURL(file)}
                          alt={`Pexels Image ${imageIndex + 1}`}
                          w={100}
                          h={100}
                          fit="cover"
                        />
                        <Button
                          color="red"
                          size="xs"
                          style={{
                            position: "absolute",
                            top: -10,
                            right: -10,
                            padding: 0,
                            width: 20,
                            height: 20,
                          }}
                          onClick={() =>
                            handleRemovePexelsImage(index, imageIndex)
                          }
                        >
                          <IconX size={12} />
                        </Button>
                      </div>
                    </Tooltip>
                  ))}
                </Flex>
              )}
            </Stack>
          ))}

          <Button type="submit" w={200} loading={createCategory.isPending}>
            Create
          </Button>
        </form>

        {/* Pexels Image Selection Modal */}
        <Modal
          opened={opened}
          onClose={close}
          title="Select Images from Pexels"
          size="xl"
        >
          <Stack>
            <Flex>
              <TextInput
                placeholder="Search Pexels images"
                value={pexelsSearchTerm}
                onChange={(event) => {
                  setPexelsSearchTerm(event.currentTarget.value);
                  setPexelsPage(1);
                }}
                w="100%"
                mr={10}
              />
            </Flex>

            {getPexelsImages.isLoading ? (
              <Text ta="center">Loading images...</Text>
            ) : getPexelsImages.data?.photos?.length === 0 ? (
              <Text ta="center">No images found</Text>
            ) : (
              <ScrollArea h={500}>
                <Grid>
                  {getPexelsImages.data?.photos?.map((photo) => (
                    <Grid.Col key={photo.id} span={4}>
                      <Image
                        src={photo.src.medium}
                        alt={photo.alt}
                        onClick={() =>
                          handleSelectPexelsImage(photo.src.original)
                        }
                        style={{ cursor: "pointer" }}
                      />
                    </Grid.Col>
                  ))}
                </Grid>
              </ScrollArea>
            )}

            {/* Pagination Controls */}
            <Group justify="center" mt="md">
              <Button
                leftSection={<IconChevronLeft size={14} />}
                onClick={handlePreviousPage}
                disabled={pexelsPage === 1}
              >
                Previous
              </Button>
              <Button
                rightSection={<IconChevronRight size={14} />}
                onClick={handleNextPage}
                disabled={
                  !getPexelsImages.data?.total_results ||
                  pexelsPage >=
                    Math.ceil((getPexelsImages.data?.total_results || 0) / 15)
                }
              >
                Next
              </Button>
            </Group>

            {/* Page Info */}
            <Group justify="center">
              <Text>
                Page {pexelsPage} of{" "}
                {Math.ceil((getPexelsImages.data?.total_results || 0) / 15)}
              </Text>
            </Group>
          </Stack>
        </Modal>
      </PageMainWrapper>
    </>
  );
}

export default CategoryForm;
