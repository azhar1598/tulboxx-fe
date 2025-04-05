import React from "react";
import { Group, Select, TextInput, Box, SimpleGrid, Flex } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import classes from "./filter.module.css";

export const FilterLayout = ({
  filters = [],
  onSearch,
  recordsPerPageOptions = ["10", "25", "50", "100"],
  defaultRecordsPerPage = "10",
  searchable,
}: any) => {
  return (
    <Flex justify="space-between" align={"flex-start"} gap={10} px={20} pt={10}>
      {/* Left section with filters */}
      <Group gap="xs">
        {filters?.map((filter, index) => (
          <Select
            key={index}
            label={filter.label}
            data={filter.options}
            placeholder="Select Option"
            onChange={(e, option) => {
              filter.onChange(option);
            }}
            value={
              filter.form?.getInputProps(`${filter.fieldName}`).value.value
            }
            className={classes.filter_input}
            searchable={searchable}
            allowDeselect={false}
            clearable
          />
        ))}
      </Group>

      {/* Right section with search bar */}
      <Group>
        <TextInput
          rightSection={<IconSearch />}
          placeholder="Search..."
          onChange={(e) => onSearch?.(e.target.value)}
          mt={25}
          className={classes.filter_search_input}
        />
      </Group>

      {/* Records per page dropdown */}
      {/* <Group position="right" style={{ marginTop: 12 }}>
        <Select
          label="Records per page"
          data={recordsPerPageOptions}
          value={defaultRecordsPerPage}
          onChange={onRecordsPerPageChange}
          style={{ width: 200 }} // Adjust width as needed
        />
      </Group> */}
    </Flex>
  );
};
