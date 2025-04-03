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
} from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { useForm, zodResolver } from "@mantine/form";
import React, { useContext, useEffect } from "react";
import { z } from "zod";
import { UserContext } from "@/app/layout";

const accountSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  phone: z.string().min(1, "Phone number is required"),
  address: z.string().min(1, "Address is required"),
  companyName: z.string().optional(),
  jobTitle: z.string().optional(),
  industry: z.string().optional(),
  companySize: z.string().optional(),
  currentPassword: z.string().optional(),
  newPassword: z.string().optional(),
  emailNotifications: z.boolean(),
  smsNotifications: z.boolean(),
});

function AccountForm() {
  const form = useForm({
    validate: zodResolver(accountSchema),
    initialValues: {
      fullName: "John Doe",
      email: "john.doe@example.com",
      phone: "+1 (555) 555-5555",
      address: "123 Main St, Anytown, USA",
      companyName: "Acme Inc.",
      jobTitle: "Product Manager",
      industry: "Technology",
      companySize: "50-100",
      currentPassword: "",
      newPassword: "",
      emailNotifications: true,
      smsNotifications: false,
    },
  });

  const handleSave = () => {
    if (form.validate().hasErrors) return; // Validate form before saving
    console.log("Form saved:", form.values); // Replace with actual save logic
    form.resetDirty();
  };

  const handleReset = () => {
    form.reset();
  };

  // Example subscription plan (can be dynamic)
  const subscriptionPlan = "Standard Plan";

  const isButtonEnabled = form.isDirty();
  const user = useContext(UserContext);

  useEffect(() => {
    if (user) {
      form.setValues({
        fullName: user?.user_metadata?.name || user?.user_metadata?.full_name,
        email: user?.email,
        phone: user?.phone,
        address: user?.address,
      });
    }
  }, [user]);

  console.log("user", user);

  //   const getUserQuery = useQuery({
  //     queryKey: ["get-user"],
  //     queryFn: () => {
  //       const params = new URLSearchParams();
  //       //   params.append("id", user?.id);
  //       const response = callApi.get(`/user-profile/${user?.id}`);
  //       console.log("response", response);
  //       return response;
  //     },
  //   });

  //   useEffect(() => {
  //     if (user) {
  //       form.setValues({
  //         ...getUserQuery.data,
  //       });
  //     }
  //   }, [user]);

  //   console.log("form--->", getUserQuery.data);

  return (
    <div className="bg-white w-full mt-5 page-main-wrapper p-[20px] mb-20">
      <Paper>
        <Stack gap="xl">
          <Group mb="md" align="flex-start">
            <Avatar size="xl" radius="xl" color="blue">
              {user?.user_metadata?.name?.slice(0, 2).toUpperCase() || "U"}
            </Avatar>
            <Box>
              <Group>
                <Text size="xl" fw={700}>
                  Account Settings
                </Text>
                <Badge color="orange" variant="light" size="lg">
                  {subscriptionPlan}
                </Badge>
              </Group>
              <Text size="sm" c="dimmed">
                Manage your personal information and preferences
              </Text>
            </Box>
          </Group>

          <Divider mb="xl" />

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSave();
            }}
          >
            <Grid>
              <Grid.Col span={12}>
                <Text fw={600} mb="md">
                  Personal Information
                </Text>
              </Grid.Col>

              <Grid.Col span={{ base: 12, md: 6 }}>
                <TextInput
                  label="Full Name"
                  placeholder="Your name"
                  disabled
                  {...form.getInputProps("fullName")}
                  //   {...form.getInputProps("fullName")}
                />
              </Grid.Col>

              <Grid.Col span={{ base: 12, md: 6 }}>
                <TextInput
                  label="Email Address"
                  placeholder="your.email@example.com"
                  //   {...form.getInputProps("email")}
                  {...form.getInputProps("email")}
                  disabled
                />
              </Grid.Col>

              <Grid.Col span={{ base: 12, md: 6 }}>
                <TextInput
                  label="Phone Number"
                  placeholder="(555) 555-5555"
                  {...form.getInputProps("phone")}
                  disabled
                  //   {...form.getInputProps("phone")}
                />
              </Grid.Col>

              <Grid.Col span={{ base: 12, md: 6 }}>
                <Textarea
                  label="Address"
                  placeholder="Your address"
                  // {...form.getInputProps("address")}
                />
              </Grid.Col>

              <Grid.Col span={12} mt="lg">
                <Divider mb="md" />
                <Text fw={600} mb="md">
                  Company Details
                </Text>
              </Grid.Col>

              <Grid.Col span={{ base: 12, md: 6 }}>
                <TextInput
                  label="Company Name"
                  placeholder="Your company name"
                  {...form.getInputProps("companyName")}
                />
              </Grid.Col>

              <Grid.Col span={{ base: 12, md: 6 }}>
                <TextInput
                  label="Job Title"
                  placeholder="Your job title"
                  {...form.getInputProps("jobTitle")}
                />
              </Grid.Col>

              <Grid.Col span={{ base: 12, md: 6 }}>
                <TextInput
                  label="Industry"
                  placeholder="Your industry"
                  {...form.getInputProps("industry")}
                />
              </Grid.Col>

              <Grid.Col span={{ base: 12, md: 6 }}>
                <TextInput
                  label="Company Size"
                  placeholder="Number of employees"
                  {...form.getInputProps("companySize")}
                />
              </Grid.Col>

              {/* <Grid.Col span={12} mt="lg">
                <Divider mb="md" />
                <Text fw={600} mb="md">
                  Account Security
                </Text>
              </Grid.Col>

              <Grid.Col span={{ base: 12, md: 6 }}>
                <PasswordInput
                  label="Current Password"
                  placeholder="Enter current password"
                  {...form.getInputProps("currentPassword")}
                />
              </Grid.Col>

              <Grid.Col span={{ base: 12, md: 6 }}>
                <PasswordInput
                  label="New Password"
                  placeholder="Enter new password"
                  {...form.getInputProps("newPassword")}
                />
              </Grid.Col> */}

              {/* <Grid.Col span={12} mt="lg">
                <Divider mb="md" />
                <Text fw={600} mb="md">
                  Notification Preferences
                </Text>
              </Grid.Col>

              <Grid.Col span={12}>
                <Switch
                  label="Email notifications"
                  description="Receive updates and alerts via email"
                  {...form.getInputProps("emailNotifications", {
                    type: "checkbox",
                  })}
                />
              </Grid.Col>

              <Grid.Col span={12} mt="sm">
                <Switch
                  label="SMS notifications"
                  description="Receive updates and alerts via text message"
                  {...form.getInputProps("smsNotifications", {
                    type: "checkbox",
                  })}
                />
              </Grid.Col> */}
            </Grid>

            <Button type="submit" disabled={!isButtonEnabled} mt={20}>
              Save Changes
            </Button>
          </form>
        </Stack>
      </Paper>
    </div>
  );
}

export default AccountForm;
