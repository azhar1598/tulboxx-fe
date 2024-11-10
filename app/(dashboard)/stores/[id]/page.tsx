"use client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import {
  Container,
  Paper,
  Title,
  Text,
  Group,
  Stack,
  TextInput,
  Grid,
  Avatar,
  ColorInput,
  Switch,
  Button,
  Select,
  Textarea,
  NumberInput,
  LoadingOverlay,
  SimpleGrid,
  Flex,
  Card,
  Center,
  Badge,
  Modal,
  Image,
  Loader,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import {
  IconClock,
  IconMapPin,
  IconPhone,
  IconMail,
  IconUser,
  IconBuilding,
  IconQrcode,
  IconPhoto,
  IconAlertCircle,
  IconBrandHtml5,
  IconTypography,
  IconPalette,
} from "@tabler/icons-react";
import callApi from "@/services/apiService";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import PageMainWrapper from "@/components/common/PageMainWrapper";
import { STORE_STATUS } from "@/lib/constants";
import { useDisclosure } from "@mantine/hooks";

function StoreEditPage() {
  const { id } = useParams();

  const [opened, { open, close }] = useDisclosure(false);

  const form = useForm({
    initialValues: {
      name: "",
      description: "",
      tagline: "",
      address: "",
      state: "",
      city: "",
      qrTheme: {
        titleFontSize: "",
        primaryColor: "",
        secondaryColor: "",
        primaryText: "",
        ctaText: "",
        ctaColor: "",
        radius: "",
      },
      websiteTheme: {
        primaryColor: "",
        secondaryColor: "",
      },
      businessHours: [
        { day: "Monday", openTime: "", closeTime: "", isOpen: true },
        { day: "Tuesday", openTime: "", closeTime: "", isOpen: false },
        { day: "Wednesday", openTime: "", closeTime: "", isOpen: true },
        { day: "Thursday", openTime: "", closeTime: "", isOpen: false },
        { day: "Friday", openTime: "", closeTime: "", isOpen: true },
        { day: "Saturday", openTime: "", closeTime: "", isOpen: false },
        { day: "Sunday", openTime: "", closeTime: "", isOpen: false },
      ],
      merchantDetails: {
        name: "",
        email: "",
        phoneNumber: "",
      },
    },
    validate: {
      name: (value) => (value ? null : "Store name is required"),
      "merchantDetails.email": (value) =>
        /^\S+@\S+$/.test(value) ? null : "Invalid email",
      "merchantDetails.phoneNumber": (value) =>
        value ? null : "Phone number is required",
    },
  });

  const { data: store, isLoading } = useQuery({
    queryKey: ["get-store-by-id", id],
    queryFn: async () => {
      const response = await callApi.get(`/v1/stores/${id}`);
      return response.data;
    },
    select: (data) => {
      // Update form with fetched data
      console.log("ddd", data.data);
      return data;
    },
  });

  useEffect(() => {
    if (!store?.data) return;
    form.setValues({
      ...store.data,
      businessHours: [
        ...form.values.businessHours.map((hour) => {
          const foundHour = store.data.businessHours.find(
            (h) => h.day === hour.day
          );
          return foundHour ? { ...hour, ...foundHour, isOpen: true } : hour;
        }),
      ],
    });
  }, [store]);

  const handleSubmit = (values) => {
    // Filter out closed days from business hours
    const filteredHours = values.businessHours
      .filter((hour) => hour.isOpen)
      .map(({ day, openTime, closeTime }) => ({ day, openTime, closeTime }));

    const submitData = {
      ...values,
      businessHours: filteredHours,
    };

    console.log("Form data to submit:", submitData);
    // Add your submission logic here
  };

  const [couponCode, setCouponCode] = useState("");
  const [paymentUrl, setPaymentUrl] = useState<string>("");

  const makePayment = useMutation({
    mutationFn: () =>
      callApi.post(`v1/store/${id}/payment`, {
        paymentType: "RAZOR_PAY_QR",
        couponCode: couponCode || "WELCOME500",
      }),
    onSuccess: async (res: any) => {
      const { data } = res;
      console.log("data----->", data.data.paymentUrl);

      setPaymentUrl(data.data.paymentUrl);
      // router.push(`/stores/${data.data.id}`);
      // notification.success(`Store created successfully`);
    },
    onError: (err: Error) => {
      // notification.error(err);
      console.log(err.message);
    },
  });

  useEffect(() => {
    if (!paymentUrl) return;
    open();
  }, [paymentUrl]);

  return (
    <Container size="lg" pb="xl">
      <PageHeader
        title="Edit Store"
        leftSection={
          <Badge
            color={
              STORE_STATUS.INITIATED === "blue" ||
              STORE_STATUS.PENDING === "yellow" ||
              STORE_STATUS.ACTIVE === "green" ||
              STORE_STATUS.INACTIVE === "red"
            }
          >
            Initiated
          </Badge>
        }
        rightSection={
          <Flex gap={10}>
            <TextInput
              value={couponCode}
              placeholder="Coupon code"
              onChange={(e) => {
                setCouponCode(e.target.value.toUpperCase().trim());
              }}
            ></TextInput>
            <Button
              onClick={() => {
                makePayment.mutate();
              }}
              loading={makePayment.isPending}
            >
              Make Payment
            </Button>
          </Flex>
        }
      />
      <Flex gap={12}>
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="xl" mt={10}>
            {/* <LoadingOverlay visible={isLoading} /> */}

            {/* Basic Information */}
            <Flex gap={10} mt={10}>
              <Paper shadow="sm" p="md" withBorder w={"70%"}>
                <Title order={3} mb="md">
                  Basic Information
                </Title>
                <Stack gap="md">
                  <TextInput
                    label="Store Name"
                    placeholder="Enter store name"
                    leftSection={<IconBuilding size={16} />}
                    required
                    {...form.getInputProps("name")}
                  />

                  <Textarea
                    label="Description"
                    placeholder="Enter store description"
                    minRows={3}
                    {...form.getInputProps("description")}
                  />

                  <TextInput
                    label="Tagline"
                    placeholder="Enter store tagline"
                    leftSection={<IconTypography size={16} />}
                    {...form.getInputProps("tagline")}
                  />
                </Stack>
              </Paper>
              <Card shadow="md" w={"30%"}>
                <Center h={"100%"}>
                  <Text color="gray">No Transactions Yet</Text>
                </Center>
              </Card>
            </Flex>

            {/* Location */}
            <Paper shadow="sm" p="md" withBorder>
              <Title order={3} mb="md">
                Location
              </Title>
              <Stack gap="md">
                <Textarea
                  label="Address"
                  placeholder="Enter full address"
                  leftSection={<IconMapPin size={16} />}
                  {...form.getInputProps("address")}
                />

                <Grid>
                  <Grid.Col span={6}>
                    <TextInput
                      label="City"
                      placeholder="Enter city"
                      {...form.getInputProps("city")}
                    />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <TextInput
                      label="State"
                      placeholder="Enter state"
                      {...form.getInputProps("state")}
                    />
                  </Grid.Col>
                </Grid>
              </Stack>
            </Paper>

            {/* Business Hours */}
            <Paper shadow="sm" p="md" withBorder>
              <Title order={3} mb="md">
                Business Hours
              </Title>
              <Stack gap="md">
                {form.values.businessHours.map((hour, index) => (
                  <Grid key={hour.day} align="center">
                    <Grid.Col span={3}>
                      <Switch
                        label={hour.day}
                        checked={hour.isOpen}
                        onChange={(event) => {
                          form.setFieldValue(
                            `businessHours.${index}.isOpen`,
                            event.currentTarget.checked
                          );
                        }}
                      />
                    </Grid.Col>
                    {/* <Grid.Col span={4}>
                    <TimeInput
                      label="Opening Time"
                      disabled={!hour.isOpen}
                      {...form.getInputProps(`businessHours.${index}.openTime`)}
                    />
                  </Grid.Col>
                  <Grid.Col span={4}>
                    <TimeInput
                      label="Closing Time"
                      disabled={!hour.isOpen}
                      {...form.getInputProps(
                        `businessHours.${index}.closeTime`
                      )}
                    />
                  </Grid.Col> */}
                  </Grid>
                ))}
              </Stack>
            </Paper>

            {/* Theme Settings */}
            <Paper shadow="sm" p="md" withBorder>
              <Title order={3} mb="md">
                Theme Settings
              </Title>

              <Title order={4} mb="md">
                QR Theme
              </Title>
              <Grid mb="xl">
                <Grid.Col span={4}>
                  <ColorInput
                    label="Primary Color"
                    {...form.getInputProps("qrTheme.primaryColor")}
                  />
                </Grid.Col>
                <Grid.Col span={4}>
                  <ColorInput
                    label="Secondary Color"
                    {...form.getInputProps("qrTheme.secondaryColor")}
                  />
                </Grid.Col>
                <Grid.Col span={4}>
                  <ColorInput
                    label="CTA Color"
                    {...form.getInputProps("qrTheme.ctaColor")}
                  />
                </Grid.Col>
                <Grid.Col span={4}>
                  <TextInput
                    label="Primary Text"
                    {...form.getInputProps("qrTheme.primaryText")}
                  />
                </Grid.Col>
                <Grid.Col span={4}>
                  <TextInput
                    label="CTA Text"
                    {...form.getInputProps("qrTheme.ctaText")}
                  />
                </Grid.Col>
                <Grid.Col span={4}>
                  <NumberInput
                    label="Border Radius"
                    {...form.getInputProps("qrTheme.radius")}
                  />
                </Grid.Col>
                <Grid.Col span={4}>
                  <TextInput
                    label="Title Font Size"
                    {...form.getInputProps("qrTheme.titleFontSize")}
                  />
                </Grid.Col>
              </Grid>

              <Title order={4} mb="md">
                Website Theme
              </Title>
              <Grid>
                <Grid.Col span={6}>
                  <ColorInput
                    label="Primary Color"
                    {...form.getInputProps("websiteTheme.primaryColor")}
                  />
                </Grid.Col>
                <Grid.Col span={6}>
                  <ColorInput
                    label="Secondary Color"
                    {...form.getInputProps("websiteTheme.secondaryColor")}
                  />
                </Grid.Col>
              </Grid>
            </Paper>

            {/* Merchant Details */}
            <Paper shadow="sm" p="md" withBorder>
              <Title order={3} mb="md">
                Merchant Details
              </Title>
              <Stack gap="md">
                <TextInput
                  label="Name"
                  placeholder="Enter merchant name"
                  leftSection={<IconUser size={16} />}
                  required
                  {...form.getInputProps("merchantDetails.name")}
                />

                <TextInput
                  label="Email"
                  placeholder="Enter merchant email"
                  leftSection={<IconMail size={16} />}
                  required
                  {...form.getInputProps("merchantDetails.email")}
                />

                <TextInput
                  label="Phone Number"
                  placeholder="Enter phone number"
                  leftSection={<IconPhone size={16} />}
                  required
                  {...form.getInputProps("merchantDetails.phoneNumber")}
                />
              </Stack>
            </Paper>

            <Group mt="xl">
              <Button type="button" variant="default">
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </Group>
          </Stack>
        </form>
      </Flex>
      <Modal
        opened={opened}
        onClose={() => {
          setCouponCode("");
          close();
        }}
        title="Scan & Pay"
        size="md"
        centered
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}
      >
        <div className="flex flex-col items-center space-y-6 p-4">
          <div className="bg-white p-6 rounded-lg shadow-md">
            {/* BHIM UPI Logos */}
            <div className="flex justify-center gap-2 mb-4 h-[45vh]">
              {/* <div className="relative h-full overflow-hidden"> */}
              <div className="absolute inset-0 top-10 ">
                <Image
                  src={paymentUrl}
                  alt="BHIM"
                  // fallbackSrc={<Loader />}
                  className="w-full h-full object-cover"
                />
                {/* </div> */}
              </div>
            </div>
            <Button
              fullWidth
              mt={20}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded  "
              onClick={() => {
                // Add your payment status check logic here
                console.log("Checking payment status...");
              }}
            >
              Check Payment Status
            </Button>
            {/* Payment Status Button */}
          </div>
        </div>
      </Modal>
    </Container>
  );
}

export default StoreEditPage;
