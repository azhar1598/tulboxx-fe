import { Group } from "@mantine/core";
import React from "react";
import {
  SortableContext,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";

import { KanbanColumn } from "./KanbanColumn";

export default function Kanban({ columns }) {
  return (
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
  );
}
