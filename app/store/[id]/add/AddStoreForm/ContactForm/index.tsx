import { indianStates } from "@/lib/constants";
import {
  Box,
  Divider,
  Grid,
  Group,
  Select,
  Text,
  Textarea,
  TextInput,
  ThemeIcon,
} from "@mantine/core";
import { TimeInput } from "@mantine/dates";
import {
  IconClock,
  IconMail,
  IconMapPin,
  IconMapPin2,
  IconPhone,
  IconUser,
} from "@tabler/icons-react";
import React from "react";

function ContactForm({ form }) {
  return (
    <Box>
      <Group gap="xs" mb="md">
        <ThemeIcon size="lg" variant="light" color="orange">
          <IconClock size="1.2rem" />
        </ThemeIcon>
        <Text size="lg" weight={500}>
          Business Hours & Location
        </Text>
      </Group>
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
        <Grid.Col span={12}>
          <Textarea
            label="Complete Address"
            placeholder="Enter complete address"
            minRows={2}
            icon={<IconMapPin size="1rem" />}
            {...form.getInputProps("address")}
            withAsterisk
          />
        </Grid.Col>
      </Grid>
    </Box>
  );
}

export default ContactForm;
