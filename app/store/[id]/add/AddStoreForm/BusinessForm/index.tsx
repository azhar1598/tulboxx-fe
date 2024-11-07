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
  Paper,
  Stack,
  Switch,
} from "@mantine/core";
import { TimeInput } from "@mantine/dates";
import { notifications } from "@mantine/notifications";
import {
  IconClock,
  IconLoader2,
  IconMapPin,
  IconMapPin2,
  IconBuilding,
  IconClock24,
} from "@tabler/icons-react";
import React, { useEffect, useState } from "react";

function BusinessForm({ form, activeStep, prevStep, nextStep }) {
  const notification = usePageNotifications();
  const [loading, setLoading] = useState(false);
  const [selectedDays, setSelectedDays] = useState(() =>
    form.values.businessHours.map((hour) => hour.day)
  );

  // Also add useEffect to keep selectedDays in sync with form values
  useEffect(() => {
    setSelectedDays(form.values.businessHours.map((hour) => hour.day));
  }, [form.values.businessHours]);

  const [useCommonHours, setUseCommonHours] = useState(false);
  const [commonOpenTime, setCommonOpenTime] = useState("");
  const [commonCloseTime, setCommonCloseTime] = useState("");

  const getCurrentLocation = () => {
    setLoading(true);
    if (!navigator.geolocation) {
      notification.error("Geolocation is not supported by your browser");
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

            addressComponents.forEach((component) => {
              if (component.types.includes("administrative_area_level_1")) {
                state = component.long_name;
              }
              if (component.types.includes("locality")) {
                city = component.long_name;
              }
            });

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
        notification.error(error.message || "Failed to get your location");
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    );
  };

  const handleCommonOpenTime = (value) => {
    setCommonOpenTime(value);
  };

  const handleCommonCloseTime = (value) => {
    setCommonCloseTime(value);
  };

  const handleDaysChange = (values) => {
    setSelectedDays(values);

    // Create or update businessHours array based on selected days
    const updatedBusinessHours = values.map((day) => {
      // Find existing entry for this day
      const existingEntry = form.values.businessHours.find(
        (hour) => hour.day === day
      );

      // If entry exists, keep it; otherwise create new entry
      return (
        existingEntry || {
          day: day,
          openTime: "09:00",
          closeTime: "18:00",
        }
      );
    });

    // Update form with new business hours
    form.setFieldValue("businessHours", updatedBusinessHours);
  };

  const handleTimeChange = (day, timeType, value) => {
    const businessHours = [...form.values.businessHours];
    const dayIndex = businessHours.findIndex((hour) => hour.day === day);

    if (dayIndex !== -1) {
      businessHours[dayIndex] = {
        ...businessHours[dayIndex],
        [timeType]: value,
      };
    }

    form.setFieldValue("businessHours", businessHours);
  };

  const applyCommonHours = () => {
    if (commonOpenTime && commonCloseTime) {
      selectedDays.forEach((day) => {
        form.setFieldValue(`openTime_${day}`, commonOpenTime);
        form.setFieldValue(`closeTime_${day}`, commonCloseTime);
      });
      notification.success("Common hours applied to all selected days");
    } else {
      notification.error("Please set both opening and closing times");
    }
  };

  const isFormValid = () => {
    return (
      form.values.businessHours[0]?.openTime.trim() &&
      form.values.businessHours[0]?.closeTime.trim() &&
      form.values.businessHours[0]?.day.trim() &&
      form.values.state?.trim() &&
      form.values.city?.trim() &&
      form.values.address?.trim()
    );
  };

  return (
    <Grid gutter="md" p={10}>
      {/* Left Column - Location Details */}
      <Grid.Col span={{ base: 12, md: 6 }}>
        <Paper shadow="xs" p="md" withBorder>
          <Group mb="md" align="center">
            <ThemeIcon size="lg" variant="light">
              <IconBuilding size="1.2rem" />
            </ThemeIcon>
            <Text size="lg" weight={500}>
              Business Location
            </Text>
          </Group>

          <Stack spacing="md">
            <MultiSelect
              label="Business Days"
              placeholder="Working days"
              data={[
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
                "Sunday",
              ]}
              value={selectedDays}
              onChange={handleDaysChange}
              searchable
              withAsterisk
            />
            <Select
              label="State"
              placeholder="Select state"
              data={indianStates}
              icon={<IconMapPin size="1rem" />}
              {...form.getInputProps("state")}
              withAsterisk
              searchable
            />

            <TextInput
              label="City"
              placeholder="Enter city name"
              icon={<IconMapPin2 size="1rem" />}
              {...form.getInputProps("city")}
              withAsterisk
            />

            <Textarea
              label="Complete Address"
              placeholder="Enter complete address"
              minRows={2}
              icon={<IconMapPin size="1rem" />}
              {...form.getInputProps("address")}
              withAsterisk
            />

            <Group grow align="flex-end">
              <TextInput
                label="Latitude"
                placeholder="Enter latitude"
                icon={<IconMapPin2 size="1rem" />}
                {...form.getInputProps("latitude")}
                readOnly
              />
              <TextInput
                label="Longitude"
                placeholder="Enter longitude"
                icon={<IconMapPin2 size="1rem" />}
                {...form.getInputProps("longitude")}
                readOnly
              />
              <Button
                onClick={getCurrentLocation}
                disabled={loading}
                leftSection={
                  loading ? (
                    <IconLoader2 className="animate-spin" size="1rem" />
                  ) : (
                    <IconMapPin2 size="1rem" />
                  )
                }
              >
                {loading ? "Detecting..." : "Get Location"}
              </Button>
            </Group>
          </Stack>
        </Paper>
        <Group justify="" mt="xl">
          <Button onClick={prevStep}>Back</Button>
          <Button onClick={nextStep} disabled={!isFormValid()}>
            Next step
          </Button>
        </Group>
      </Grid.Col>

      {/* Right Column - Business Hours */}
      <Grid.Col span={{ base: 12, md: 6 }}>
        <Paper
          shadow="xs"
          p="md"
          withBorder
          style={{ overflow: "scroll", maxHeight: "470px" }}
        >
          <Group mb="md" align="center">
            <ThemeIcon size="lg" variant="light">
              <IconClock24 size="1.2rem" />
            </ThemeIcon>
            <Text size="lg" weight={500}>
              Business Hours
            </Text>
          </Group>

          <Stack spacing="md">
            {selectedDays.length > 0 && (
              <Paper p="sm" withBorder>
                <Group position="apart" mb="xs">
                  <Text size="sm" weight={500} color="dimmed">
                    Set Common Hours
                  </Text>
                  <Switch
                    checked={useCommonHours}
                    onChange={(event) =>
                      setUseCommonHours(event.currentTarget.checked)
                    }
                    label="Use common hours"
                  />
                </Group>
                {useCommonHours && (
                  <>
                    <Group grow mb="sm">
                      <TimeInput
                        label="Common Opening Time"
                        // value={commonOpenTime}

                        onChange={handleCommonOpenTime}
                        format="12" // Add this to ensure 24-hour format
                      />
                      <TimeInput
                        label="Common Closing Time"
                        // value={commonCloseTime}
                        onChange={handleCommonCloseTime}
                        format="12" // Add this to ensure 24-hour format
                      />
                    </Group>
                    <Button
                      fullWidth
                      onClick={applyCommonHours}
                      disabled={!commonOpenTime || !commonCloseTime}
                    >
                      Apply to All Days
                    </Button>
                    <Divider my="md" />
                  </>
                )}
              </Paper>
            )}

            {selectedDays.length > 0 ? (
              selectedDays.map((day, index) => (
                <Paper key={day} p="sm" withBorder>
                  <Text size="sm" weight={500} mb="xs" color="dimmed">
                    {day}
                  </Text>
                  <Group grow>
                    <TimeInput
                      label="Opening Time"
                      icon={<IconClock size="1rem" />}
                      format="12" // Add this to ensure 24-hour format
                      value={
                        form.values.businessHours.find((h) => h.day === day)
                          ?.openTime || ""
                      }
                      onChange={(e) => {
                        handleTimeChange(day, "openTime", e.target.value);
                      }}
                      withAsterisk
                    />
                    <TimeInput
                      label="Closing Time"
                      icon={<IconClock size="1rem" />}
                      format="12" // Add this to ensure 24-hour format
                      value={
                        form.values.businessHours.find((h) => h.day === day)
                          ?.closeTime || ""
                      }
                      onChange={(e) => {
                        handleTimeChange(day, "closeTime", e.target.value);
                      }}
                      withAsterisk
                    />
                  </Group>
                </Paper>
              ))
            ) : (
              <Text color="dimmed" size="sm" align="center" py="xl">
                Select business days to set operating hours
              </Text>
            )}
          </Stack>
        </Paper>
      </Grid.Col>
    </Grid>
  );
}

export default BusinessForm;
