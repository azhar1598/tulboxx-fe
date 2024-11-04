"use client";
import {
  ActionIcon,
  Box,
  Button,
  Container,
  Flex,
  Group,
  Input,
  Stack,
} from "@mantine/core";
import {
  IconEdit,
  IconEye,
  IconPlus,
  IconSearch,
  IconTrash,
} from "@tabler/icons-react";
import React from "react";
import { DataTable } from "mantine-datatable";
import { StoreCard } from "@/components/common/store/StoreCard";
import Link from "next/link";

function page() {
  const [searchQuery, setSearchQuery] = React.useState("");

  const handleAddStore = () => {
    // Add your logic for handling store addition
    console.log("Add store clicked");
  };
  return (
    <Stack>
      <div className="mb-2">
        <div className="flex justify-end items-center gap-4 mb-8">
          <div className="relative flex-1 max-w-md">
            <Input
              placeholder="Search stores..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className=""
              rightSection={
                <IconSearch className=" top-2.5 h-4 w-4 text-gray-500" />
              }
            />
          </div>

          <Link href="/store/add">
            <Button className="flex items-center gap-2 ">
              <IconPlus className="h-4 w-4" /> Create Store
            </Button>
          </Link>
        </div>
      </div>
      <Group justify="space-">
        <StoreCard
          storeName="Coffee House"
          location="123 Main Street, City"
          imageUrl="https://content.jdmagicbox.com/v2/comp/mumbai/l7/040pxx40.xx40.200628175115.q5l7/catalogue/aaha-tiffin-center-hyderabad-tiffin-services-9952dcr3au.jpg"
        />
        <StoreCard
          storeName="Coffee House"
          location="123 Main Street, City"
          imageUrl="https://content.jdmagicbox.com/v2/comp/mumbai/l7/040pxx40.xx40.200628175115.q5l7/catalogue/aaha-tiffin-center-hyderabad-tiffin-services-9952dcr3au.jpg"
        />
        <StoreCard
          storeName="Coffee House"
          location="123 Main Street, City"
          imageUrl="https://content.jdmagicbox.com/v2/comp/mumbai/l7/040pxx40.xx40.200628175115.q5l7/catalogue/aaha-tiffin-center-hyderabad-tiffin-services-9952dcr3au.jpg"
        />
        <StoreCard
          storeName="Coffee House"
          location="123 Main Street, City"
          imageUrl="https://content.jdmagicbox.com/v2/comp/mumbai/l7/040pxx40.xx40.200628175115.q5l7/catalogue/aaha-tiffin-center-hyderabad-tiffin-services-9952dcr3au.jpg"
        />
        <StoreCard
          storeName="Coffee House"
          location="123 Main Street, City"
          imageUrl="https://content.jdmagicbox.com/v2/comp/mumbai/l7/040pxx40.xx40.200628175115.q5l7/catalogue/aaha-tiffin-center-hyderabad-tiffin-services-9952dcr3au.jpg"
        />
      </Group>
    </Stack>
  );
}

export default page;
