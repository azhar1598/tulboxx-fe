"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
import {
  checkPaymentStatusBadge,
  checkStatus,
  PAYMENT_STATUS,
  STORE_STATUS,
} from "@/lib/constants";
import { useDisclosure, useSetState } from "@mantine/hooks";
import { usePageNotifications } from "@/lib/hooks/useNotifications";
import CustomTable from "@/components/common/CustomTable";

function StoreEditPage() {
  const { id } = useParams();

  const [opened, { open, close }] = useDisclosure(false);
  const notification = usePageNotifications();

  const form = useForm({
    initialValues: {
      name: "",
      description: "",
      tagLine: "",
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
    // validate: {
    //   name: (value) => (value ? null : "Store name is required"),
    //   "merchantDetails.email": (value) =>
    //     /^\S+@\S+$/.test(value) ? null : "Invalid email",
    //   "merchantDetails.phoneNumber": (value) =>
    //     value ? null : "Phone number is required",
    // },
  });

  let columns = [
    {
      accessor: "id",
      title: "Payment Code",
      render: ({ id }: any) => id || "N/A",
    },
    {
      accessor: "amount",
      title: "Amount",
      render: ({ currency, amount }: any) => (
        <Text size="14px">
          {currency} {amount || "N/A"}
        </Text>
      ),
    },
    {
      accessor: "paymentType",
      title: "paymentType",
      render: ({ paymentType }: any) => (
        <Text size="14px">{paymentType || "N/A"}</Text>
      ),
    },
    {
      accessor: "status",
      title: "Status",
      render: ({ status }: any) => (
        <Badge color={checkPaymentStatusBadge(status)}>{status}</Badge>
      ),
    },
  ];

  const getStoreById = useQuery({
    queryKey: ["get-store-by-id"],
    queryFn: async () => {
      const response = await callApi.get(`/v1/stores/${id}`);
      return response.data;
    },
    select: (data) => {
      // Update form with fetched data

      return data;
    },
  });

  useEffect(() => {
    if (!getStoreById?.data) return;
    form.setValues({
      ...getStoreById.data?.data,
      businessHours: [
        ...form.values.businessHours.map((hour) => {
          const foundHour = getStoreById.data?.data.businessHours.find(
            (h) => h.day === hour.day
          );
          return foundHour ? { ...hour, ...foundHour, isOpen: true } : hour;
        }),
      ],
    });
  }, [getStoreById?.data]);

  const handleSubmit = (values) => {
    // Filter out closed days from business hours
    const filteredHours = values.businessHours
      .filter((hour) => hour.isOpen)
      .map(({ day, openTime, closeTime }) => ({ day, openTime, closeTime }));

    const submitData = {
      ...values,
      businessHours: filteredHours,
    };

    // Add your submission logic here
  };

  const [couponCode, setCouponCode] = useState("");

  const [state, setState] = useSetState({
    paymentUrl: "",
    paymentCode: "",
  });
  const queryClient = useQueryClient();

  const makePayment = useMutation({
    mutationFn: () =>
      callApi.post(`v1/store/${id}/payment`, {
        paymentType: "RAZOR_PAY_QR",
        couponCode: couponCode || "WELCOME500",
      }),
    onSuccess: async (res: any) => {
      const { data } = res;

      setState({
        paymentUrl: data.data.paymentUrl,
        paymentCode: data.data.paymentCode,
      });
    },
    onError: (err: any) => {
      notification.error(err);
      console.log(err.message);
    },
  });

  useEffect(() => {
    if (!state.paymentUrl) return;
    open();
  }, [state.paymentUrl]);

  const checkPaymentStatus = useMutation({
    mutationFn: () => callApi.get(`/v1/payments/${state.paymentCode}`),
    onSuccess: async (res: any) => {
      const { data } = res;
      getStoreById.refetch();

      if (data.data.status === PAYMENT_STATUS.SUCCESS) {
        close();
        notification.success(`Payment Done Successfully`);
      } else if (data.data.status === PAYMENT_STATUS.FAILED) {
        close();
        notification.error(
          "Kindly reinitiate the payment, as the previous attempt was unsuccessful."
        );
      } else {
        notification.warn(
          "Kindly ensure the merchant has been requested to make the payment, if not done already"
        );
      }
    },
    onError: (err: Error) => {
      // notification.error(err);
      console.log(err.message);
    },
  });

  // const makePaymentAvailable = () => {
  //   return store?.data?.payments?.some(
  //     (payment) => payment.status === "SUCCESS" || payment.status === "PENDING"
  //   );
  // };

  return (
    <Container size="lg" pb="xl">
      <PageHeader
        title="Edit Store"
        leftSection={
          <Badge color={checkStatus(getStoreById?.data?.data?.status)}>
            {getStoreById?.data?.data?.status}
          </Badge>
        }
        rightSection={
          // !makePaymentAvailable() && (
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
          // )
        }
      />
      <Flex gap={12}>
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="xl" mt={10}>
            {/* <LoadingOverlay visible={isLoading} /> */}

            {/* Basic Information */}
            <SimpleGrid cols={2} spacing={10} mt={10}>
              <Paper shadow="sm" p="md" withBorder>
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
                    {...form.getInputProps("tagLine")}
                  />
                </Stack>
              </Paper>
              <Card shadow="md">
                <Center h={"100%"}>
                  {/* <Text color="gray">No Transactions Yet</Text> */}
                  <CustomTable
                    records={getStoreById?.data?.data?.payments || []}
                    columns={columns}
                    totalRecords={getStoreById?.data?.data?.payments?.length}
                    currentPage={1}
                    pageSize={10}
                    // onPageChange={handlePageChange}
                    // isLoading={getPaymentsQuery.isLoading}
                  />
                </Center>
              </Card>
            </SimpleGrid>

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
              <Button type="button" disabled>
                Cancel
              </Button>
              <Button type="submit" disabled>
                Save Changes
              </Button>
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
                  src={state.paymentUrl}
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
                checkPaymentStatus.mutate();
              }}
              loading={checkPaymentStatus.isPending}
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
