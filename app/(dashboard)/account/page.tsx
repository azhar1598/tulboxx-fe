"use client";
import callApi from "@/services/apiService";
import {
  Box,
  Button,
  Divider,
  Grid,
  Group,
  Avatar,
  Text,
  TextInput,
  Textarea,
  PasswordInput,
  Switch,
  Stack,
  Paper,
  Badge,
  Tabs,
} from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { useForm, zodResolver } from "@mantine/form";
import React, { useContext, useEffect } from "react";
import { z } from "zod";
import { UserContext } from "@/app/layout";
import {
  IconUser,
  IconBuildingBank,
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandTwitter,
  IconBrandYoutube,
} from "@tabler/icons-react";
import PersonalForm from "./PersonalForm";
import BankingForm from "./BankingForm";
import ThirdPartySetupForm from "./ThirdPartySetupForm";

function AccountForm() {
  const getUserProfile = useQuery({
    queryKey: ["get-user-profile"],
    queryFn: async () => {
      const response = await callApi.get(`/user-profile`);
      return response;
    },
    select: (data) => data?.data,
  });

  return (
    <div className="bg-white w-full  page-main-wrapper p-[20px] mb-20">
      <Stack gap="lg">
        <Group mb="md" align="flex-start">
          <Avatar size="xl" radius="xl" color="blue">
            {getUserProfile?.data?.userMetadata?.name
              ?.slice(0, 2)
              .toUpperCase() || "U"}
          </Avatar>
          <Box>
            <Group>
              <Text size="xl" fw={700}>
                Account Settings
              </Text>
              <Badge color="orange" variant="light" size="lg">
                Standard Plan
              </Badge>
            </Group>
            <Text size="sm" c="dimmed">
              Manage your personal information and preferences
            </Text>
          </Box>
        </Group>

        {/* <Divider mb="xl" /> */}

        <Tabs defaultValue="personal">
          <Tabs.List>
            <Tabs.Tab value="personal" leftSection={<IconUser size={14} />}>
              Personal & Company
            </Tabs.Tab>
            {/* <Tabs.Tab
              value="banking"
              leftSection={<IconBuildingBank size={14} />}
            >
              Banking Details
            </Tabs.Tab> */}
            <Tabs.Tab
              value="third-party-setups"
              leftSection={<IconBrandFacebook size={14} />}
            >
              Third Party Setups
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="personal">
            <PersonalForm getUserProfile={getUserProfile} />
          </Tabs.Panel>

          <Tabs.Panel value="banking">
            <BankingForm />
          </Tabs.Panel>

          <Tabs.Panel value="third-party-setups">
            <ThirdPartySetupForm />
          </Tabs.Panel>
        </Tabs>
      </Stack>
    </div>
  );
}

export default AccountForm;
