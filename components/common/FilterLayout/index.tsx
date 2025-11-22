import React from "react";
import {
  Group,
  Select,
  TextInput,
  Box,
  SimpleGrid,
  Flex,
  Stack,
} from "@mantine/core";
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
    <Box px={20} pt={10}>
      {/* Desktop Layout */}
      <Flex
        justify="space-between"
        align={"flex-start"}
        gap={10}
        className={classes.desktop_layout}
      >
        {/* Left section with filters */}
        <Group gap="xs">
          {filters?.map((filter, index) => (
            <Select
              key={index}
              label={filter.label}
              data={filter.options}
              placeholder="Select Option"
              onChange={(e, option) => {
                console.log("option", option, filter);
                filter.onChange(option.value);
              }}
              {...filter.form?.getInputProps(`${filter.fieldName}`)}
              className={classes.filter_input}
              searchable={searchable}
              allowDeselect={false}
              clearable
            />
          ))}
        </Group>

        <Group>
          <TextInput
            rightSection={<IconSearch />}
            placeholder="Search..."
            onChange={(e) => onSearch?.(e.target.value)}
            mt={25}
            className={classes.filter_search_input}
          />
        </Group>
      </Flex>

      {/* Mobile Layout */}
      <Stack gap="md" className={classes.mobile_layout}>
        {/* Search bar first on mobile */}
        {/* <TextInput
          rightSection={<IconSearch />}
          placeholder="Search..."
          onChange={(e) => onSearch?.(e.target.value)}
          className={classes.mobile_search_input}
        /> */}

        {/* Filters in a responsive grid */}
        {/* {filters.length > 0 && (
          <SimpleGrid
            cols={{ base: 1, xs: 2, sm: 3 }}
            spacing="xs"
            className={classes.mobile_filters}
          >
            {filters?.map((filter, index) => (
              <Select
                key={index}
                label={filter.label}
                data={filter.options}
                placeholder="Select Option"
                onChange={(e, option) => {
                  console.log("option", option, filter);
                  filter.onChange(option.value);
                }}
                {...filter.form?.getInputProps(`${filter.fieldName}`)}
                className={classes.mobile_filter_input}
                searchable={searchable}
                allowDeselect={false}
                clearable
              />
            ))}
          </SimpleGrid>
        )} */}
      </Stack>
    </Box>
  );
};
