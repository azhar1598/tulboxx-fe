import { Card, Group, Stack, Text, ActionIcon, Box } from "@mantine/core";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  IconGripVertical,
  IconDotsVertical,
  IconEdit,
  IconTrash,
} from "@tabler/icons-react";
import { Menu } from "@mantine/core";

export const LeadCard = ({ lead }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: lead.id,
    data: {
      type: "Lead",
      lead,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      shadow="sm"
      padding="md"
      radius="md"
      withBorder
      mb="sm"
    >
      <Stack gap="xs">
        <Group justify="space-between" align="flex-start">
          <Group gap="xs" style={{ flex: 1 }}>
            <ActionIcon variant="transparent" {...attributes} {...listeners}>
              <IconGripVertical size={16} />
            </ActionIcon>
            <Box>
              <Text size="sm" fw={500}>
                {lead.name}
              </Text>
              <Text size="xs" c="dimmed">
                {lead.percentage}%
              </Text>
            </Box>
          </Group>
          <Menu withinPortal position="bottom-end">
            <Menu.Target>
              <ActionIcon variant="subtle" size="sm">
                <IconDotsVertical size={14} />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item leftSection={<IconEdit size={14} />}>
                Edit Lead
              </Menu.Item>
              <Menu.Item leftSection={<IconTrash size={14} />} color="red">
                Delete Lead
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>

        <Stack gap={4}>
          <Group justify="space-between">
            <Text size="xs" c="dimmed">
              Value
            </Text>
            <Text size="sm" fw={600}>
              ${lead.value.toLocaleString()}
            </Text>
          </Group>
          <Group justify="space-between">
            <Text size="xs" c="dimmed">
              Due Date
            </Text>
            <Text size="xs" c="dimmed">
              {lead.date}
            </Text>
          </Group>
        </Stack>
      </Stack>
    </Card>
  );
};
