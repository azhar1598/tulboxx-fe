"use client";
import { useForm, zodResolver } from "@mantine/form";
import { TimeInput } from "@mantine/dates";
import classes from "./estimate.module.css";
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
  FloatingIndicator,
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
  IconMessageCircle,
  IconSettings,
  IconBrandSpeedtest,
  IconFileDescription,
} from "@tabler/icons-react";
import { Suspense, useEffect, useRef, useState } from "react";
import { z } from "zod";

import { useParams, useRouter, useSearchParams } from "next/navigation";

import { PageHeader } from "@/components/common/PageHeader";

import GenerateEstimationForm from "./GenerateEstimationForm";
import GenerateQuickEstimateForm from "./GenerateQuickEstimateForm";

const esimationSchema = z.object({
  // general form
  projectName: z.string().min(1, "Project name is required"),
  // name: z.string().min(1, "Name is required"),
  // customerName: z.string().min(1, "Customer name is required"),
  // email: z.string().email("Invalid email address"),
  // phone: z.number().min(10, "Phone number is required"),
  // address: z.string().min(1, "Address is required"),
  clientId: z.string().min(1, "Client is required"),

  // project form
  serviceType: z.string().min(1, "Service type is required"),
  problemDescription: z.string().min(1, "Problem description is required"),
  solutionDescription: z.string().min(1, "Solution description is required"),
  projectEstimate: z.number().min(1, "Project estimate is required"),
  projectStartDate: z.date(),
  projectEndDate: z.date(),
  type: z.string().min(1, "Type is required"),
  lineItems: z
    .array(
      z.object({
        id: z.number().min(1, "Id is required"),
        description: z.string().optional(),
        quantity: z.number().min(1, "Quantity is required"),
        unitPrice: z.number().min(1, "Unit price is required"),
        totalPrice: z.number().optional(),
        // .min(1, "Total price is required"),
      })
    )
    .min(1, "Line items are required"),

  // additional fields
  equipmentMaterials: z.string().optional(),
  additionalNotes: z.string().optional(),

  // user id
  user_id: z.string().min(1, "User id is required"),
});

const StoreRegistrationContent = () => {
  const [activeTab, setActiveTab] = useState<string | null>("quick");
  const form = useForm({
    validate: zodResolver(esimationSchema),
    initialValues: {
      // general form
      projectName: "",

      clientId: "",
      // customerName: "",
      // email: "",
      // phone: "",
      // address: "",
      // type: "residential",
      // project form
      serviceType: "",
      problemDescription: "",
      solutionDescription: "",
      projectEstimate: "",
      projectStartDate: "",
      type: "residential",
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
      // user id
      user_id: "",
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

  const [rootRef, setRootRef] = useState<HTMLDivElement | null>(null);
  const [value, setValue] = useState<string | null>("1");
  const [controlsRefs, setControlsRefs] = useState<
    Record<string, HTMLButtonElement | null>
  >({});
  const setControlRef = (val: string) => (node: HTMLButtonElement) => {
    controlsRefs[val] = node;
    setControlsRefs(controlsRefs);
  };

  return (
    <Stack>
      {" "}
      <PageHeader title={`Generate Estimation`} />
      <div className=" md:block">
        {/* <SimpleGrid cols={1}> */}

        <Tabs
          value={activeTab}
          onChange={setActiveTab}
          mt="md"
          variant="unstyled"
          classNames={classes}
          defaultValue="quick"
        >
          <Tabs.List
            className={classes.list}
            grow
            style={{
              backgroundColor: "white",
              padding: "10px",
              boxShadow: "0 0 10px 0 rgba(0, 0, 0, 0.1)",
            }}
          >
            <Tabs.Tab
              value="quick"
              leftSection={<IconBrandSpeedtest size={16} />}
            >
              Quick Estimate
            </Tabs.Tab>
            <Tabs.Tab value="detailed" leftSection={<IconFileDescription />}>
              Detailed Estimate
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="quick" pt="xs">
            <GenerateQuickEstimateForm
              form={form}
              active={activeTab}
              nextStep={() => {}}
              prevStep={() => {}}
              setClientModalOpened={() => {}}
              getClients={() => {}}
            />
          </Tabs.Panel>
          <Tabs.Panel value="detailed" pt="xs">
            <GenerateEstimationForm form={form} />
          </Tabs.Panel>
        </Tabs>
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
