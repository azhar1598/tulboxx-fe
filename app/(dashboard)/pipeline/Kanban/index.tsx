import { Group } from "@mantine/core";
import React, { useState } from "react";
import {
  SortableContext,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";

import { KanbanColumn } from "./KanbanColumn";
import EditStageModal from "./KanbanColumn/EditStageModal";
import { useDisclosure } from "@mantine/hooks";

export default function Kanban({ columns, getClients, getStages }) {
  const [
    updateStageOpened,
    { open: openUpdateStage, close: closeUpdateStage },
  ] = useDisclosure(false);
  const [currentStageSelected, setCurrentStageSelected] = useState();

  return (
    <>
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
              setCurrentStageSelected={setCurrentStageSelected}
              openUpdateStage={openUpdateStage}
            />
          ))}
        </Group>
      </SortableContext>
      <EditStageModal
        opened={updateStageOpened}
        onClose={closeUpdateStage}
        currentStageSelected={currentStageSelected}
        setCurrentStageSelected={setCurrentStageSelected}
      />
    </>
  );
}
