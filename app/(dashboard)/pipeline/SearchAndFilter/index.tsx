import React from "react";
import { Paper, Group, TextInput, Button, rem } from "@mantine/core";
import { IconFilter, IconSearch } from "@tabler/icons-react";

function SearchAndFilter({ searchQuery, setSearchQuery }) {
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
          <Button leftSection={<IconFilter size={16} />} size="sm">
            More
          </Button>
        </Group>
      </Group>
    </Paper>
  );
}

export default SearchAndFilter;
