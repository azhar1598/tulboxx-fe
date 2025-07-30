"use client";

import React, { useState, useMemo } from "react";
import {
  Stack,
  Group,
  Paper,
  Text,
  Button,
  TextInput,
  Title,
  Badge,
  Avatar,
  Box,
  Menu,
  ActionIcon,
  Grid,
  Card,
  ThemeIcon,
  Flex,
  ScrollArea,
  Modal,
  Select,
  NumberInput,
  Textarea,
  rem,
  SimpleGrid,
} from "@mantine/core";
import {
  IconSearch,
  IconFilter,
  IconPlus,
  IconDotsVertical,
  IconUsers,
  IconCurrencyDollar,
  IconTarget,
  IconTrendingUp,
  IconCalendar,
  IconGripVertical,
  IconEdit,
  IconTrash,
  IconChevronRight,
  IconProgressCheck,
} from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { PageHeader } from "@/components/common/PageHeader";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  closestCorners,
  DragStartEvent,
  DragEndEvent,
  DragOverEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  arrayMove,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import SearchAndFilter from "./SearchAndFilter";
import StatisticsCards from "./StatisticsCards";
import Kanban from "./Kanban";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import callApi from "@/services/apiService";
import { useEffect } from "react";
import AddStageModal from "./AddStageModal";
import AddLeadModal from "./AddLeadModal";
import LeadCard from "./Kanban/KanbanColumn/LeadCard";

interface Lead {
  id: string;
  name: string;
  percentage: number;
  value: number;
  date: string;
  avatar: string;
}

interface Column {
  id: string;
  title: string;
  color: string;
  leads: Lead[];
  value: number;
  weighted: number;
}

interface Columns {
  [key: string]: Column;
}

export default function PipelinePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [columns, setColumns] = useState<Columns>({});
  const [activeLead, setActiveLead] = useState<Lead | null>(null);
  const [addLeadOpened, { open: openAddLead, close: closeAddLead }] =
    useDisclosure(false);
  const [addStageOpened, { open: openAddStage, close: closeAddStage }] =
    useDisclosure(false);

  const queryClient = useQueryClient();

  const updateLeadMutation = useMutation({
    mutationFn: ({ leadId, stageId }: { leadId: string; stageId: string }) => {
      return callApi.patch(`/pipeline/leads/${leadId}`, { stageId: stageId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-leads"] });
    },
  });

  // Calculate statistics

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const findLead = (id: string) => {
    for (const columnId in columns) {
      const lead = columns[columnId].leads.find((l) => l.id === id);
      if (lead) return lead;
    }
    return null;
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveLead(findLead(active.id as string));
  };

  const handleDragOver = (event: DragOverEvent) => {
    // This function is intentionally left blank.
    // State updates during drag are handled in onDragEnd.
  };

  const findLeadColumnId = (leadId: string) => {
    for (const columnId in columns) {
      if (columns[columnId].leads.some((lead) => lead.id === leadId)) {
        return columnId;
      }
    }
    return null;
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveLead(null);

    if (!over) {
      return;
    }

    if (active.id === over.id) {
      return;
    }

    const activeContainerId = findLeadColumnId(active.id as string);
    const overId = over.id as string;
    const overIsColumn = over.data.current?.type === "column";
    const overContainerId = overIsColumn ? overId : findLeadColumnId(overId);

    if (
      !activeContainerId ||
      !overContainerId ||
      activeContainerId === overContainerId
    ) {
      // Handle reordering within the same column
      if (
        activeContainerId &&
        overContainerId &&
        activeContainerId === overContainerId
      ) {
        setColumns((currentColumns) => {
          const column = currentColumns[activeContainerId];
          const oldIndex = column.leads.findIndex((l) => l.id === active.id);
          const newIndex = column.leads.findIndex((l) => l.id === over.id);

          if (oldIndex !== -1 && newIndex !== -1) {
            const newLeads = arrayMove(column.leads, oldIndex, newIndex);
            return {
              ...currentColumns,
              [activeContainerId]: {
                ...column,
                leads: newLeads,
              },
            };
          }
          return currentColumns;
        });
      }
      return;
    }

    updateLeadMutation.mutate({
      leadId: active.id as string,
      stageId: overContainerId,
    });

    // Handle moving to a different column
    setColumns((currentColumns) => {
      const newColumns = { ...currentColumns };
      const activeColumn = newColumns[activeContainerId];
      const overColumn = newColumns[overContainerId];
      const activeIndex = activeColumn.leads.findIndex(
        (l) => l.id === active.id
      );

      if (activeIndex !== -1) {
        const [movedItem] = activeColumn.leads.splice(activeIndex, 1);
        if (overIsColumn) {
          overColumn.leads.push(movedItem);
        } else {
          const overIndex = overColumn.leads.findIndex((l) => l.id === overId);
          if (overIndex !== -1) {
            overColumn.leads.splice(overIndex, 0, movedItem);
          } else {
            // Failsafe if over lead isn't found
            overColumn.leads.push(movedItem);
          }
        }
      }
      return newColumns;
    });
  };

  const getClients = useQuery({
    queryKey: ["get-clients"],
    queryFn: async () => {
      const response = await callApi.get(`/clients`, {
        params: {
          limit: -1,
        },
      });

      return response.data;
    },
    select(data) {
      console.log("data", data);
      const options = data?.data?.map((option) => ({
        label: `${option.name} - ${option.email}`,
        value: option.id.toString(),
      }));

      console.log("options", options);

      return options;
    },
  });

  const getStagesQuery = useQuery({
    queryKey: ["get-stages"],
    queryFn: async () => {
      const response = await callApi.get(`/pipeline/stages`, {
        params: {
          limit: -1,
        },
      });

      return response.data;
    },
    select(data) {
      const options = data?.map((option) => ({
        label: `${option.name}`,
        value: option.id.toString(),
        color: option.color,
      }));

      console.log("options", options);

      return options;
    },
  });

  const getLeadsQuery = useQuery({
    queryKey: ["get-leads"],
    queryFn: async () => {
      const response = await callApi.get(`/pipeline/leads`, {
        params: {
          limit: -1,
        },
      });

      return response.data;
    },
    select(data) {
      return data;
    },
  });

  useEffect(() => {
    if (getStagesQuery.isSuccess && getLeadsQuery.isSuccess) {
      const stages = getStagesQuery.data;
      const leads = getLeadsQuery.data;

      if (
        !getStagesQuery.data ||
        !getLeadsQuery.data ||
        !Array.isArray(leads) ||
        !Array.isArray(stages)
      ) {
        setColumns({});
        return;
      }

      const getInitials = (name) => {
        if (!name) return "";
        const names = name.split(" ");
        if (names.length > 1) {
          return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
      };

      const formatDate = (dateString) => {
        if (!dateString) return "";
        try {
          const [year, month, day] = dateString.split("-");
          return `${day}/${month}/${year}`;
        } catch (e) {
          return dateString; // fallback
        }
      };

      const columnsData: Columns = stages.reduce((acc, stage) => {
        acc[stage.value] = {
          id: stage.value,
          title: stage.label,
          color: stage.color,
          leads: [],
          value: 0,
          weighted: 0,
        };
        return acc;
      }, {});

      leads.forEach((lead) => {
        if (columnsData[lead.stage_id]) {
          const leadValue = lead.estimated_value || 0;
          const percentage = lead.percentage || 0;

          columnsData[lead.stage_id].leads.push({
            id: lead.id,
            name: lead.client?.name || "N/A",
            percentage: percentage,
            value: leadValue,
            date: formatDate(lead.expected_close_date),
            avatar: getInitials(lead.client?.name),
          });

          columnsData[lead.stage_id].value += leadValue;
          columnsData[lead.stage_id].weighted += leadValue * (percentage / 100);
        }
      });
      setColumns(columnsData);
    }
  }, [
    getStagesQuery.isSuccess,
    getLeadsQuery.isSuccess,
    getStagesQuery.data,
    getLeadsQuery.data,
  ]);

  const filteredColumns = useMemo(() => {
    if (!searchQuery.trim()) {
      return columns;
    }

    const lowercasedQuery = searchQuery.toLowerCase();
    const newColumns: Columns = {};

    for (const columnId in columns) {
      const column = columns[columnId];
      const stageMatches = column.title.toLowerCase().includes(lowercasedQuery);
      const matchingLeads = column.leads.filter((lead) =>
        lead.name.toLowerCase().includes(lowercasedQuery)
      );

      if (stageMatches || matchingLeads.length > 0) {
        newColumns[columnId] = {
          ...column,
          leads: stageMatches ? column.leads : matchingLeads,
        };
      }
    }
    return newColumns;
  }, [columns, searchQuery]);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div
        style={{
          width: "100%",
          backgroundColor: "#f8f9fa",
          minHeight: "100vh",
          maxWidth: "90vw",
          overflow: "hidden",
        }}
      >
        <Stack gap="xl">
          {/* Header */}
          <PageHeader
            title="Pipeline"
            rightSection={
              <Group>
                <Button
                  leftSection={<IconPlus size={16} />}
                  onClick={openAddLead}
                  size="sm"
                >
                  Add Lead
                </Button>
                <Button
                  leftSection={<IconPlus size={16} />}
                  size="sm"
                  onClick={openAddStage}
                >
                  Add Stage
                </Button>
              </Group>
            }
          />

          {/* Search and Filter Bar */}
          <SearchAndFilter
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
          {/* Statistics Cards */}
          <StatisticsCards
            columns={columns}
            getLeads={getLeadsQuery?.data}
            stages={getStagesQuery?.data}
          />

          {/* Kanban Board */}
          <ScrollArea
            className="custom-scrollbar"
            style={{ transform: "rotateX(180deg)" }}
          >
            <Paper
              withBorder
              p="md"
              radius="md"
              shadow="md"
              style={{
                transform: "rotateX(180deg)",
                backgroundColor: "white",
                padding: "30px",
                borderRadius: "10px",
                height: "100%",
              }}
            >
              <Kanban
                columns={filteredColumns}
                getClients={getClients}
                getStages={getStagesQuery}
              />
            </Paper>
          </ScrollArea>
        </Stack>

        <AddLeadModal
          opened={addLeadOpened}
          onClose={closeAddLead}
          getClients={getClients}
          getStages={getStagesQuery}
        />

        <AddStageModal opened={addStageOpened} onClose={closeAddStage} />

        <DragOverlay>
          {activeLead ? (
            <LeadCard
              lead={activeLead}
              getClients={getClients}
              getStages={getStagesQuery}
            />
          ) : null}
        </DragOverlay>
      </div>
    </DndContext>
  );
}
