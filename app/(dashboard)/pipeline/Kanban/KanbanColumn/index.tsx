import React from "react";
import {
  Paper,
  Group,
  Text,
  Menu,
  ActionIcon,
  Stack,
  Box,
  rem,
} from "@mantine/core";
import { IconDotsVertical, IconEdit, IconTrash } from "@tabler/icons-react";
import { useSortable, SortableContext } from "@dnd-kit/sortable";
import { LeadCard } from "./LeadCard";
import { CSS } from "@dnd-kit/utilities";

export const KanbanColumn = ({ column }) => {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    data: {
      type: "column",
    },
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
    opacity: isDragging ? 0.5 : 1,
  };

  console.log("column", column);

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Paper
        withBorder
        radius="md"
        p="md"
        style={{
          minWidth: rem(280),
          maxWidth: rem(320),
          flex: "0 0 auto",
          backgroundColor: "#fafafa",
          height: "fit-content",
        }}
      >
        <Stack gap="md">
          <Group justify="space-between" align="center">
            <Group gap="xs">
              <div
                style={{
                  width: rem(8),
                  height: rem(8),
                  borderRadius: "50%",
                  backgroundColor: column.color,
                }}
              />
              <Text size="sm" fw={600} c="dark">
                {column.title}
              </Text>
            </Group>
            <Menu withinPortal position="bottom-end">
              <Menu.Target>
                <ActionIcon variant="subtle" size="sm">
                  <IconDotsVertical size={14} />
                </ActionIcon>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item leftSection={<IconEdit size={14} />}>
                  Edit Stage
                </Menu.Item>
                <Menu.Item leftSection={<IconTrash size={14} />} color="red">
                  Delete Stage
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Group>

          <Group justify="space-between">
            <Text size="xs" c="dimmed">
              {column.leads.length} leads • ${column.weighted.toLocaleString()}{" "}
              weighted
            </Text>
          </Group>

          <Box style={{ minHeight: rem(200) }}>
            <SortableContext
              items={column.leads.map((l) => l.id)}
              id={column.id}
            >
              {column.leads.length === 0 ? (
                <Box
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: rem(200),
                    color: "#868e96",
                    fontSize: rem(14),
                    border: "2px dashed #dee2e6",
                    borderRadius: rem(4),
                  }}
                >
                  No leads in this stage
                </Box>
              ) : (
                <Stack gap="xs">
                  {column.leads.map((lead) => (
                    <LeadCard key={lead.id} lead={lead} />
                  ))}
                </Stack>
              )}
            </SortableContext>
          </Box>
        </Stack>
      </Paper>
    </div>
  );
};
