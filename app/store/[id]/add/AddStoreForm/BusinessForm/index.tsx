import { indianStates } from "@/lib/constants";
import { usePageNotifications } from "@/lib/hooks/useNotifications";
import {
  Box,
  Button,
  Divider,
  Grid,
  Group,
  MultiSelect,
  Select,
  Text,
  Textarea,
  TextInput,
  ThemeIcon,
} from "@mantine/core";
import { TimeInput } from "@mantine/dates";
import { notifications } from "@mantine/notifications";
import {
  IconClock,
  IconLoader2,
  IconMail,
  IconMapPin,
  IconMapPin2,
  IconPhone,
  IconUser,
} from "@tabler/icons-react";
import React, { useState } from "react";

function BusinessForm({ form }) {
  const notification = usePageNotifications();

  const [loading, setLoading] = useState(false);

  const getCurrentLocation = () => {
    setLoading(true);

    if (!navigator.geolocation) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Geolocation is not supported by your browser",
      });
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        form.setFieldValue("latitude", latitude.toFixed(6));
        form.setFieldValue("longitude", longitude.toFixed(6));

        try {
          const response = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}`
          );
          const data = await response.json();

          if (data.results && data.results[0]) {
            const addressComponents = data.results[0].address_components;
            let state = "";
            let city = "";
            let fullAddress = data.results[0].formatted_address;

            // Extract state and city from address components
            addressComponents.forEach((component) => {
              if (component.types.includes("administrative_area_level_1")) {
                state = component.long_name;
              }
              if (component.types.includes("locality")) {
                city = component.long_name;
              }
            });

            // Update form fields
            // form.setFieldValue("address", fullAddress);
            // form.setFieldValue("state", state);
            // form.setFieldValue("city", city);

            notification.success("Location detected successfully");
          }
        } catch (error) {
          console.error("Error getting address:", error);
          notification.error("Failed to get address details");
        }
        setLoading(false);
      },
      (error) => {
        console.error("Error getting location:", error);
        notification.error(
          ` ${error.message || "Failed to get your location"}`
        );
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    );
  };

  return (
    <Box p={10}>
      {/* <Group gap="xs" mb="md">
        <ThemeIcon size="lg" variant="light" color="orange">
          <IconClock size="1.2rem" />
        </ThemeIcon>
        <Text size="lg" weight={500}>
          Business Hours & Location
        </Text>
      </Group> */}
      <Divider mb="md" />

      <Grid>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <TimeInput
            label="Opening Time"
            icon={<IconClock size="1rem" />}
            {...form.getInputProps("openTime")}
            withAsterisk
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <TimeInput
            label="Closing Time"
            icon={<IconClock size="1rem" />}
            {...form.getInputProps("closeTime")}
            withAsterisk
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <MultiSelect
            label="Business Days"
            data={[
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
              "Sunday",
            ]}
            searchable
            withAsterisk
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Select
            label="State"
            placeholder="Select state"
            data={indianStates}
            icon={<IconMapPin size="1rem" />}
            {...form.getInputProps("state")}
            withAsterisk
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <TextInput
            label="City"
            placeholder="Enter city name"
            icon={<IconMapPin2 size="1rem" />}
            {...form.getInputProps("city")}
            withAsterisk
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Textarea
            label="Complete Address"
            placeholder="Enter complete address"
            minRows={2}
            icon={<IconMapPin size="1rem" />}
            {...form.getInputProps("address")}
            withAsterisk
          />
        </Grid.Col>
        <Grid.Col span={{ base: 6, md: 2 }}>
          <TextInput
            label="Latitude"
            placeholder="Enter latitude"
            icon={<IconMapPin2 size="1rem" />}
            {...form.getInputProps("latitude")}
            leftSection={<IconMapPin />}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 6, md: 2 }}>
          <TextInput
            label="Longitude"
            placeholder="Enter longitude"
            icon={<IconMapPin2 size="1rem" />}
            {...form.getInputProps("longitude")}
            leftSection={<IconMapPin />}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 1 }}>
          <Button
            onClick={getCurrentLocation}
            disabled={loading}
            w={150}
            className="flex items-center gap-2 md:mt-6"
          >
            {loading ? (
              <IconLoader2 className="w- h-4 animate-spin" />
            ) : (
              <IconMapPin2 className="w- h-4" />
            )}
            {loading ? "Detecting..." : "Get Location"}
          </Button>
        </Grid.Col>
      </Grid>
    </Box>
  );
}

export default BusinessForm;
