"use client";
import { useQuery } from "@tanstack/react-query";
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
import { useEffect } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import PageMainWrapper from "@/components/common/PageMainWrapper";

function StoreEditPage() {
  const { id } = useParams();

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

  return (
    <Container size="lg" py="xl">
      <PageHeader title="Edit Store" />

      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="xl" mt={10}>
          {/* <LoadingOverlay visible={isLoading} /> */}

          {/* Basic Information */}
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
                {...form.getInputProps("tagline")}
              />
            </Stack>
          </Paper>

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
    </Container>
  );
}

export default StoreEditPage;
