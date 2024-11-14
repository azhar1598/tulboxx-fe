import {
  Button,
  Group,
  Select,
  SimpleGrid,
  Text,
  Textarea,
} from "@mantine/core";
import React from "react";

function AddProductForm() {
  return (
    <SimpleGrid cols={2}>
      <Group gap={0}>
        <Select label="Choose category" w={"100%"} />
        <Text
          size="xs"
          color="blue"
          td={"underline"}
          className="cursor-pointer"
        >
          View Products belong to this category
        </Text>
      </Group>
      <Group>
        <Textarea label="Bulk Add Products" w={"100%"} />
      </Group>
      <Button w={200}>Save Changes</Button>
    </SimpleGrid>
  );
}

export default AddProductForm;
