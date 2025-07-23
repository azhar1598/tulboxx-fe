import { Group } from "@mantine/core";
import React from "react";
import {
  SortableContext,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";

import { KanbanColumn } from "./KanbanColumn";

export default function Kanban({ columns, getClients, getStages }) {
  return (
    <SortableContext
      items={Object.keys(columns)}
      strategy={horizontalListSortingStrategy}
    >
      <Group
        align="flex-start"
        gap="md"
        wrap="nowrap"
        style={{ minWidth: "100%" }}
      >
        {Object.values(columns).map((column: any) => (
          <KanbanColumn
            key={column.id}
            column={column}
            getClients={getClients}
            getStages={getStages}
          />
        ))}
      </Group>
    </SortableContext>
  );
}
