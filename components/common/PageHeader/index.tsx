import React from "react";
import { Group, Button, Title, Text } from "@mantine/core";
import { IconChevronLeft } from "@tabler/icons-react";
import { useRouter } from "next/navigation";

export const PageHeader = ({ title, rightSection }) => {
  const router = useRouter();
  const [leftTitle, rightTitle] = title.split(":");

  return (
    <Group justify="space-between">
      <Group>
        <Button
          variant="subtle"
          leftSection={<IconChevronLeft size={36} stroke={3} />}
          px={0}
          onClick={() => router.back()}
          bg={"#1e476b"}
          color="white"
        />

        <Title order={3}>
          {leftTitle}

          {rightTitle && (
            <>
              <Text component="span" color="#171b1f" fw={600} size="20px">
                :{" "}
              </Text>
              <Text
                style={{ fontStyle: "italic" }}
                component="span"
                color="#171b1f"
                fw={600}
                size="20px"
              >
                {rightTitle.trim()}
              </Text>
            </>
          )}
        </Title>
      </Group>

      {rightSection}
    </Group>
  );
};
