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
import { indianStates, swatches } from "@/lib/constants";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { signOut } from "next-auth/react";
import AddStoreForm from "./AddStoreForm";
import PreviewQR from "./PreviewQR";
import { PageHeader } from "@/components/common/PageHeader";
import WebPreview from "./AddStoreForm/WebForm/WebPreview";
import PageMainWrapper from "@/components/common/PageMainWrapper";
import { useMutation, useQuery } from "@tanstack/react-query";
import callApi from "@/services/apiService";

const storeSchema = z.object({
  name: z.string().min(1, "Name is required"),
  categoryId: z.number(),
  tagLine: z.string(),
  description: z.string(),
  logo: z.string(),
  licenseId: z.string(),
  address: z.string(),
  state: z.string(),
  pincode: z.number(),
  city: z.string(),
  latitude: z.string(),
  longitude: z.string(),
  qrTheme: z.object({
    titleFontSize: z.number(),
    primaryColor: z.string(),
    secondaryColor: z.string(),
    primaryText: z.string(),
    ctaText: z.string(),
    ctaColor: z.string(),
    radius: z.number(),
  }),
  websiteTheme: z.object({
    primaryColor: z.string(),
    secondaryColor: z.string(),
  }),
  businessHours: z.array(
    z.object({
      openTime: z.string(),
      closeTime: z.string(),
      day: z.string(),
    })
  ),
  menuImages: z.array(z.any()),
});

const StoreRegistrationContent = () => {
  const form = useForm({
    validate: zodResolver(storeSchema),
    initialValues: {
      name: "",
      categoryId: 1,
      tagLine: "",
      description:
        "We are dedicated to providing the best services to our customers. Your satisfaction is our priority.",
      logo: "",
      licenseId: "",
      address: "",
      state: "",
      pincode: "",
      city: "",
      latitude: "",
      longitude: "",
      qrTheme: {
        titleFontSize: "24px",
        primaryColor: "#228be6",
        secondaryColor: "#ffffff",
        primaryText: "Scan Here",
        ctaText: "To View Our Menu",
        ctaColor: "#fab005",
        radius: 5,
      },
      websiteTheme: {
        primaryColor: "#fab005",
        secondaryColor: "#091151",
        backgroundImage: "",
        titleColor: "",
        taglineColor: "",
      },
      businessHours: [],
      menuImages: [],
    },
  });

  const searchParams = useSearchParams();
  const id = searchParams.get("merchantId");

  const getSingleMerchant = useQuery({
    queryKey: ["get-content-by-id"],
    queryFn: async () => {
      const response = await callApi.get(`/v1/merchants/${id}`);
      return response.data;
    },
  });

  return (
    <Stack>
      {" "}
      <PageHeader
        title={`Create Store: ${getSingleMerchant?.data?.data.name}`}
      />
      <div className="hidden md:block">
        {/* <SimpleGrid cols={1}> */}

        <AddStoreForm form={form} id={id} />

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
