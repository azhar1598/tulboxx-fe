import { Flex, rem, ScrollArea, Group } from "@mantine/core";
import React from "react";
import {
  DndContext,
  closestCenter,
  useSensor,
  useSensors,
  PointerSensor,
} from "@dnd-kit/core";
import {
  SortableContext,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";

import { KanbanColumn } from "./KanbanColumn";

export default function Kanban({ columns }) {
  const sensors = useSensors(useSensor(PointerSensor));

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter}>
      <SortableContext
        items={Object.keys(columns)}
        strategy={horizontalListSortingStrategy}
      >
        <Group align="flex-start" gap="md" wrap="nowrap">
          {Object.values(columns).map((column: any) => (
            <KanbanColumn key={column.id} column={column} />
          ))}
        </Group>
      </SortableContext>
    </DndContext>
  );
}
