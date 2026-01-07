import React from "react";
import { Stack, Text, Button, Center, Title, Image } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";

interface EmptyPipelineProps {
  onAddStage: () => void;
}

export default function EmptyPipeline({ onAddStage }: EmptyPipelineProps) {
  return (
    <Center style={{ height: "100%", minHeight: 400 }}>
      <Stack align="center" gap="md">
        <Image
          src="/assets/no-data.svg"
          w={200}
          h={200}
          fit="contain"
          alt="No pipeline data"
          opacity={0.8}
        />
        <Stack gap="xs" align="center">
          <Title order={3} fw={600} c="dark.3">
            No Stages Found
          </Title>
          <Text c="dimmed" ta="center" maw={400} size="sm">
            Your pipeline is currently empty. Get started by adding stages to
            your workflow to track your leads effectively.
          </Text>
        </Stack>
        <Button
          leftSection={<IconPlus size={16} />}
          onClick={onAddStage}
          size="md"
          mt="sm"
        >
          Add Stage
        </Button>
      </Stack>
    </Center>
  );
}
