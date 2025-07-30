import React from "react";
import { Paper, Group, TextInput, MultiSelect, rem } from "@mantine/core";
import { IconFilter, IconSearch } from "@tabler/icons-react";

function SearchAndFilter({
  searchQuery,
  setSearchQuery,
  stages,
  selectedStages,
  setSelectedStages,
}) {
  return (
    <Paper withBorder p="md" radius="md" shadow="sm">
      <Group justify="space-between">
        <TextInput
          placeholder="Search leads..."
          leftSection={<IconSearch size={16} />}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ flex: 1, maxWidth: rem(400) }}
        />
        <Group>
          <MultiSelect
            data={stages || []}
            placeholder="Filter by stages"
            value={selectedStages}
            onChange={setSelectedStages}
            leftSection={<IconFilter size={16} />}
            style={{ width: rem(250) }}
            clearable
          />
        </Group>
      </Group>
    </Paper>
  );
}

export default SearchAndFilter;
