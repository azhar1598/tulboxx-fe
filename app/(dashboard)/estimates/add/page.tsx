"use client";
import { useForm, zodResolver } from "@mantine/form";
import { TimeInput } from "@mantine/dates";
import {
  TextInput,
  Textarea,
  Select,
  FileInput,
  Group,
  Button,
  Box,
  Paper,
  Title,
  Grid,
  Stack,
  Image,
  CloseButton,
  SimpleGrid,
  Text,
  ColorInput,
  Flex,
  Container,
  Card,
  Divider,
  ThemeIcon,
  rem,
  Tabs,
} from "@mantine/core";
import {
  IconBuilding,
  IconUpload,
  IconPhoto,
  IconUser,
  IconPhone,
  IconMail,
  IconClock,
  IconMapPin,
  IconPalette,
  IconPower,
} from "@tabler/icons-react";
import { Suspense, useEffect, useRef, useState } from "react";
import { z } from "zod";

import { useParams, useRouter, useSearchParams } from "next/navigation";

import { PageHeader } from "@/components/common/PageHeader";

import GenerateEstimationForm from "./GenerateEstimationForm";

const esimationSchema = z.object({
  // general form
  projectName: z.string().min(1, "Project name is required"),
  // name: z.string().min(1, "Name is required"),
  customerName: z.string().min(1, "Customer name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.number().min(10, "Phone number is required"),
  address: z.string().min(1, "Address is required"),

  // project form
  serviceType: z.string().min(1, "Service type is required"),
  problemDescription: z.string().min(1, "Problem description is required"),
  solutionDescription: z.string().min(1, "Solution description is required"),
  projectEstimate: z.number().min(1, "Project estimate is required"),
  projectStartDate: z.date(),
  projectEndDate: z.date(),
  lineItems: z.array(
    z.object({
      description: z.string().min(1, "Description is required"),
      quantity: z.number().min(1, "Quantity is required"),
      unitPrice: z.number().min(1, "Unit price is required"),
      totalPrice: z.number().min(1, "Total price is required"),
    })
  ),

  // additional fields
  equipmentMaterials: z.string().optional(),
  additionalNotes: z.string().optional(),
});

const StoreRegistrationContent = () => {
  const form = useForm({
    validate: zodResolver(esimationSchema),
    initialValues: {
      // general form
      projectName: "",
      // name: "",
      customerName: "",
      email: "",
      phone: "",
      address: "",
      type: "residential",
      // project form
      serviceType: "",
      problemDescription: "",
      solutionDescription: "",
      projectEstimate: "",
      projectStartDate: "",
      projectEndDate: "",
      lineItems: [
        {
          id: 1,
          description: "",
          quantity: 0,
          unitPrice: 0,
          totalPrice: 0,
        },
      ],
      // additional fields
      equipmentMaterials: "",
      additionalNotes: "",
    },
    validateInputOnChange: true,
  });

  const searchParams = useSearchParams();
  // const id = searchParams.get("merchantId");

  // const getSingleMerchant = useQuery({
  //   queryKey: ["get-content-by-id"],
  //   queryFn: async () => {
  //     const response = await callApi.get(`/v1/merchants/${id}`);
  //     return response.data;
  //   },
  // });

  return (
    <Stack>
      {" "}
      <PageHeader title={`Generate Estimation`} />
      <div className="hidden md:block">
        {/* <SimpleGrid cols={1}> */}

        {/* <AddStoreForm form={form} /> */}
        <GenerateEstimationForm form={form} />

        {/* <Flex direction={"column"}>
            <Tabs defaultValue="qr">
              <Tabs.List mb={10}>
                <Tabs.Tab value="qr">Preview QR</Tabs.Tab>
                <Tabs.Tab value="website">Preview Website</Tabs.Tab>
              </Tabs.List>
              <Tabs.Panel value="qr" pb="xs">
                <PreviewQR storeInfo={form.values} />
              </Tabs.Panel>
              <Tabs.Panel value="website" pb="xs">
                <div className="relative">
                  <WebPreview />
                </div>
              </Tabs.Panel>
            </Tabs>
          </Flex> */}
        {/* </SimpleGrid> */}
      </div>
      {/* <div className="md:hidden block">
        <SimpleGrid cols={1}>
          <AddStoreForm form={form} />
          <Flex direction={"column"}>
            <Tabs defaultValue="qr">
              <Tabs.List mb={10}>
                <Tabs.Tab value="qr">Preview QR</Tabs.Tab>
                <Tabs.Tab value="website">Preview Website</Tabs.Tab>
              </Tabs.List>
              <Tabs.Panel value="qr" pb="xs">
                <PreviewQR storeInfo={form.values} />
              </Tabs.Panel>
              <Tabs.Panel value="website" pb="xs">
                <div className="relative">
                  <WebPreview storeInfo={form.values} />
                </div>
              </Tabs.Panel>
            </Tabs>
          </Flex>
        </SimpleGrid>
      </div> */}
    </Stack>
  );
};

const StoreRegistration = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <StoreRegistrationContent />
    </Suspense>
  );
};

export default StoreRegistration;
