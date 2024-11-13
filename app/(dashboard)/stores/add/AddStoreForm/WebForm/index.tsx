import { swatches } from "@/lib/constants";
import {
  Box,
  Button,
  ColorInput,
  Divider,
  Flex,
  Grid,
  Image,
  SimpleGrid,
  Text,
  TextInput,
  Modal,
  Pagination,
  Loader,
  Center,
} from "@mantine/core";
import React, { useRef, useState, useEffect } from "react";
import WebPreview from "./WebPreview";
import axios from "axios";

import { IconPhoto, IconPlus, IconX, IconSearch } from "@tabler/icons-react";
import { useDebouncedState } from "@mantine/hooks";
import { useQuery } from "@tanstack/react-query";
import TestWeb from "../TestWeb";
import IPhoneFrame from "./WebPreview/IPhoneFrame";

const PEXELS_API_KEY = process.env.NEXT_PUBLIC_PEXELS_API_KEY;

function WebForm({ form, active, prevStep, nextStep }) {
  const [imageFiles, setImageFiles] = useState([]);
  const [pexelsSearchTerm, setPexelsSearchTerm] = useDebouncedState("", 800);
  const [pexelsImages, setPexelsImages] = useState([]);
  const [pexelsPage, setPexelsPage] = useState(1);
  const [pexelsModalOpen, setPexelsModalOpen] = useState(false);
  const imageInputRef = useRef(null);

  const getPexelsImages = useQuery({
    queryKey: ["get-pexels-images", pexelsSearchTerm, pexelsPage],
    queryFn: async () => {
      if (!pexelsSearchTerm) return [];
      const response = await axios.get(
        `https://api.pexels.com/v1/search?query=${pexelsSearchTerm}&page=${pexelsPage}&orientation=portrait`,
        {
          headers: {
            Authorization: PEXELS_API_KEY,
          },
        }
      );
      return response.data;
    },
  });

  console.log("orange", getPexelsImages?.data?.photos);

  const handleImagesChange = (files) => {
    if (files) {
      const newImages = Array.from(files).map((file: File) => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = () => {
            resolve({
              file,
              preview: reader.result,
            });
          };
          reader.readAsDataURL(file);
        });
      });

      Promise.all(newImages).then((images) => {
        setImageFiles((prev) => [...prev, ...images]);
        form.setFieldValue("menuImages", (prev) => [...prev, ...images]);
      });
    }
  };

  const handleRemoveImage = (indexToRemove) => {
    setImageFiles((prev) => prev.filter((_, index) => index !== indexToRemove));
    form.setFieldValue(
      "menuImages",
      form.values.menuImages.filter((_, index) => index !== indexToRemove)
    );
  };

  const handlePexelsImageSelect = (image) => {
    console.log("image", image);
    form.setFieldValue("websiteTheme.backgroundImage", image.src.original);
    setPexelsModalOpen(false);
    setPexelsSearchTerm("");
  };

  console.log(
    "form...val",
    form.values.websiteTheme.backgroundImage,
    form.values
  );

  const isFormValid = () => {
    const webFieldValues = Object.values(form.values.websiteTheme).every(
      (value) =>
        value !== null &&
        value !== undefined &&
        value !== "" &&
        form.values.menuImages.length != 0 &&
        form.values.websiteTheme.backgroundImage != ""
    );
    console.log("form----", form, form.values.websiteTheme);
    return webFieldValues;
  };

  return (
    <Box p={10}>
      <Divider mb="md" />
      <Flex align={"flex-start"} justify={"space-between"}>
        <SimpleGrid cols={2} mt={20}>
          <Text size="sm">
            Store Primary Color <span className="text-red-500">*</span>
          </Text>
          <Box style={{ flex: 1 }}>
            <ColorInput
              format="hex"
              swatches={swatches}
              value={form.values.websiteTheme.primaryColor}
              onChange={(color) =>
                form.setFieldValue("websiteTheme.primaryColor", color)
              }
              withEyeDropper
              placeholder="Pick a color"
            />
          </Box>
          <Text size="sm" fw={500}>
            Store Secondary Color <span className="text-red-500">*</span>
          </Text>
          <Box style={{ flex: 1 }}>
            <ColorInput
              format="hex"
              swatches={swatches}
              value={form.values.websiteTheme.secondaryColor}
              onChange={(color) =>
                form.setFieldValue("websiteTheme.secondaryColor", color)
              }
              withEyeDropper
              placeholder="Pick a color"
            />
          </Box>
          <Text size="sm" fw={500} mb="xs">
            Menu Images
          </Text>
          <input
            type="file"
            multiple
            accept="image/png,image/jpeg"
            style={{ display: "none" }}
            ref={imageInputRef}
            onChange={(e) => handleImagesChange(e.target.files)}
          />
          <Box style={{ flex: 1 }}>
            <Button
              leftSection={<IconPhoto size="1rem" />}
              onClick={() => imageInputRef.current?.click()}
            >
              Upload Menu Images
            </Button>
            <SimpleGrid cols={4} mt="md" spacing="md">
              {form.values.menuImages.map((image, index) => (
                <div key={index} className="relative group">
                  <Image src={image.preview} radius="md" />
                  <button
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-2 right-2 p-1 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-gray-100"
                  >
                    <IconX size={16} className="text-gray-600" />
                  </button>
                </div>
              ))}
            </SimpleGrid>
          </Box>
          <Text size="sm" fw={500} mb="xs">
            Background Image
          </Text>
          <Box style={{ flex: 1 }}>
            {/* <TextInput
              value={form.values.backgroundImage}
              onChange={(e) =>
                form.setFieldValue("backgroundImage", e.target.value)
              }
              placeholder="Enter a URL"
              rightSection={
                <Button
                  onClick={() => setPexelsModalOpen(true)}
                  leftSection={<IconSearch size={16} />}
                >
                  Upload Background
                </Button>
              }
            /> */}

            <Box style={{ flex: 1 }}>
              <Button
                leftSection={<IconPhoto size={16} />}
                onClick={() => setPexelsModalOpen(true)}
              >
                {form.values.websiteTheme.backgroundImage
                  ? "Replace Background"
                  : "Upload Background"}
              </Button>
            </Box>
          </Box>
          <Flex gap={10} justify="" mt="xl" w={600}>
            <Button onClick={prevStep}>Back</Button>
            <Button onClick={nextStep} disabled={!isFormValid()}>
              Next
            </Button>
          </Flex>
        </SimpleGrid>
        <div className="reldative">
          {/* <WebPreview storeInfo={form.values} /> */}
          <IPhoneFrame>
            <WebPreview storeInfo={form.values} />
          </IPhoneFrame>
        </div>
      </Flex>

      <Modal
        opened={pexelsModalOpen}
        onClose={() => setPexelsModalOpen(false)}
        title="Search Background Images"
        h={300}
      >
        <TextInput
          // value={pexelsSearchTerm}
          onChange={(e) => setPexelsSearchTerm(e.target.value)}
          placeholder="Search for images"
          rightSection={
            <Button>
              <IconSearch size={16} />
            </Button>
          }
        />
        <Grid style={{ minHeight: "600px" }} mt={20}>
          {getPexelsImages?.data?.photos?.map((image) => (
            <Grid.Col key={image.id} span={4}>
              <div
                className="relative cursor-pointer"
                onClick={() => handlePexelsImageSelect(image)}
              >
                <Image src={image.src.medium} radius="md" />
              </div>
            </Grid.Col>
          ))}

          {getPexelsImages?.data?.total_results === 0 &&
            !getPexelsImages?.isLoading && (
              <Center w={"100%"} h={"500px"}>
                <Text>No results</Text>
              </Center>
            )}
          {pexelsSearchTerm === "" && (
            <Center w={"100%"} h={"500px"}>
              <Text>Please search images...</Text>
            </Center>
          )}
          {getPexelsImages?.isLoading && (
            <Center w={"100%"} h={"500px"}>
              <Loader />
            </Center>
          )}
        </Grid>
        {getPexelsImages?.data?.total_results != 0 &&
          !getPexelsImages?.isLoading && (
            <Pagination
              mt={10}
              // page={pexelsPage}
              onChange={setPexelsPage}
              total={10}
              siblings={1}
              boundaries={1}
            />
          )}
      </Modal>
    </Box>
  );
}

export default WebForm;
