import React, { useState } from "react";
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

import { CSS } from "@dnd-kit/utilities";
import LeadCard from "./LeadCard";
import EditStageModal from "./EditStageModal";
import { useDisclosure } from "@mantine/hooks";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import callApi from "@/services/apiService";
import { usePageNotifications } from "@/lib/hooks/useNotifications";

export const KanbanColumn = ({
  column,
  getClients,
  getStages,
  setCurrentStageSelected,
  openUpdateStage,
}) => {
  const [menuOpened, setMenuOpened] = useState(false);
  const queryClient = useQueryClient();
  const notification = usePageNotifications();
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
    disabled: menuOpened,
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
    opacity: isDragging ? 0.5 : 1,
  };

  console.log("column", column);

  const deleteStageMutation = useMutation({
    mutationFn: (id: any) => {
      return callApi.delete(`/pipeline/stages/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-stages"] });
      notification.success("Stage deleted successfully");
    },
    onError: () => {
      notification.error("Failed to delete stage");
    },
  });

  return (
    <div ref={setNodeRef} style={style}>
      <Paper
        withBorder
        radius="md"
        p="md"
        style={{
          minWidth: rem(280),
          maxWidth: rem(320),
          flex: "0 0 auto",
          // backgroundColor: "red",
          height: "fit-content",
        }}
      >
        <Stack gap="md">
          <Group
            justify="space-between"
            align="center"
            {...attributes}
            {...listeners}
          >
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
            <Menu
              withinPortal
              position="bottom-end"
              onOpen={() => setMenuOpened(true)}
              onClose={() => setMenuOpened(false)}
            >
              <Menu.Target>
                <ActionIcon
                  variant="subtle"
                  size="sm"
                  onPointerDown={(e) => e.stopPropagation()}
                >
                  <IconDotsVertical size={14} />
                </ActionIcon>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item
                  leftSection={<IconEdit size={14} />}
                  onClick={() => {
                    console.log("cursor", column);
                    setCurrentStageSelected(column);
                    openUpdateStage();
                  }}
                >
                  Edit Stage
                </Menu.Item>
                <Menu.Item
                  leftSection={<IconTrash size={14} />}
                  color="red"
                  onClick={() => {
                    console.log("cursor");
                    deleteStageMutation.mutate(column.id);
                  }}
                >
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
                    <LeadCard
                      key={lead.id}
                      lead={lead}
                      getClients={getClients}
                      getStages={getStages}
                    />
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
