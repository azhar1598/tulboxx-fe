"use client";
import { Paper, Stack, Text, ThemeIcon, Title } from "@mantine/core";
import { IconRocket } from "@tabler/icons-react";

function ThirdPartySetupForm() {
  return (
    <Paper
      p="xl"
      mt="xl"
      style={{
        minHeight: 400,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Stack align="center" gap="lg">
        <ThemeIcon
          size={80}
          radius="xl"
          variant="gradient"
          gradient={{ from: "blue", to: "cyan", deg: 45 }}
        >
          <IconRocket style={{ width: "60%", height: "60%" }} />
        </ThemeIcon>
        <Title order={2} ta="center">
          Feature Coming Soon!
        </Title>
        <Text c="dimmed" ta="center" maw={400}>
          We're working hard to bring you this exciting new feature. This
          section for third-party integrations is currently under construction.
        </Text>
      </Stack>
    </Paper>
  );
}

export default ThirdPartySetupForm;
