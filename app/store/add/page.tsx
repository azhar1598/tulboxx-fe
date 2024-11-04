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
import { useRef, useState } from "react";
import { z } from "zod";
import { indianStates, swatches } from "@/lib/constants";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import AddStoreForm from "./AddStoreForm";
import PreviewQR from "./PreviewQR";

const storeSchema = z.object({
  storeName: z.string().min(2, "Store name must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  category: z.string().min(1, "Please select a category"),
  ownerName: z.string().min(2, "Owner name must be at least 2 characters"),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number"),
  email: z.string().email("Invalid email address"),
  openTime: z.string().min(1, "Opening time is required"),
  closeTime: z.string().min(1, "Closing time is required"),
  address: z.string().min(10, "Please enter complete address"),
  themeColor: z.string().min(1, "Theme color is required"),
  storeLogo: z.any().optional(),
  storeImages: z.array(z.any()).optional(),
});

const StoreRegistration = () => {
  const form = useForm({
    validate: zodResolver(storeSchema),
    initialValues: {
      storeName: "",
      description: "",
      category: "",
      ownerName: "",
      phone: "",
      email: "",
      openTime: "",
      closeTime: "",
      address: "",
      themeColor: "#228be6", // Default theme color
      storeLogo: null,
      storeImages: [],
    },
  });
  return (
    <Stack>
      <Box bg="gradient">
        <Title order={2} color="white">
          Store Registration
        </Title>
        <Text color="black" opacity={0.8} mt="xs">
          Create your digital storefront in minutes
        </Text>

        {/* <IconPower
            stroke={2}
            style={{
              position: "absolute",
              top: 5,
              right: 5,
              color: "white",
              backgroundColor: "red",
              borderRadius: "10px",
            }}
            onClick={() => {
              signOut({ callbackUrl: "/login" });
            }}
          /> */}
      </Box>
      <div className="hidden md:block">
        <SimpleGrid cols={2}>
          <AddStoreForm form={form} />
          <PreviewQR storeInfo={form.values} />
        </SimpleGrid>
      </div>
      <div className="md:hidden block">
        <SimpleGrid cols={1}>
          <AddStoreForm form={form} />
          <PreviewQR storeInfo={form.values} />
        </SimpleGrid>
      </div>
    </Stack>
  );
};

export default StoreRegistration;
