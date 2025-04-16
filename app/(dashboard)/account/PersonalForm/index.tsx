import React, { useEffect } from "react";
import {
  Grid,
  Text,
  TextInput,
  Textarea,
  Button,
  Divider,
  Select,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import callApi from "@/services/apiService";
import { usePageNotifications } from "@/lib/hooks/useNotifications";
const accountSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  phone: z.string().optional(),
  address: z.string().min(1, "Address is required"),
  companyName: z.string().optional(),
  jobTitle: z.string().optional(),
  industry: z.string().optional(),
  companySize: z.string().optional(),
});

function PersonalForm({ getUserProfile }: { getUserProfile: any }) {
  const notifications: any = usePageNotifications();
  const form = useForm({
    validate: zodResolver(accountSchema),
    initialValues: {
      fullName: "",
      email: "",
      phone: "",
      address: "",
      companyName: "",
      jobTitle: "",
      industry: "",
      companySize: "",
    },
    validateInputOnChange: true,
  });
  useEffect(() => {
    if (getUserProfile?.data) {
      form.setValues({
        fullName: getUserProfile?.data?.userMetadata?.full_name,
        email: getUserProfile?.data?.email,
        phone: getUserProfile?.data?.phone || "",
        address: getUserProfile?.data?.address,
        companyName: getUserProfile?.data?.companyName,
        jobTitle: getUserProfile?.data?.jobTitle,
        industry: getUserProfile?.data?.industry,
        companySize: getUserProfile?.data?.companySize,
      });
      form.resetDirty();
    }
  }, [getUserProfile?.data]);
  console.log(getUserProfile?.data, "getUserProfile");

  const updateUserProfile = useMutation({
    mutationFn: async (values: any) => {
      const formattedData = {
        companyName: values.companyName,
        companySize: values.companySize,
        address: values.address,
        industry: values.industry,
        jobTitle: values.jobTitle,
      };
      const response = await callApi.patch("/user-profile", formattedData);
      return response.data;
    },
    onSuccess: () => {
      notifications.success("User profile updated successfully");
      getUserProfile.refetch();
    },
    onError: () => {
      notifications.error("User profile update failed");
      console.log("error");
    },
  });

  const isButtonEnabled = form.isValid() && form.isDirty();
  return (
    <form
      onSubmit={form.onSubmit((values) => updateUserProfile.mutate(values))}
    >
      <Grid mt="xl">
        <Grid.Col span={12}>
          <Text fw={600}>Personal Details</Text>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6 }}>
          <TextInput
            label="Full Name"
            placeholder="Your name"
            {...form.getInputProps("fullName")}
          />
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6 }}>
          <TextInput
            label="Email Address"
            placeholder="your.email@example.com"
            {...form.getInputProps("email")}
            disabled
          />
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6 }}>
          <TextInput
            label="Phone Number"
            placeholder="+1 (555) 555-5555"
            {...form.getInputProps("phone")}
          />
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6 }}>
          <Textarea
            label="Address"
            placeholder="Your address"
            {...form.getInputProps("address")}
          />
        </Grid.Col>

        <Grid.Col span={12} mt="md">
          <Divider mb="md" />
          <Text fw={600}>Company Details</Text>
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
          <Select
            label="Company Size"
            data={["1-10", "11-50", "51-200", "201-500", "501-1000", "1000+"]}
            placeholder="Select company size"
            {...form.getInputProps("companySize")}
          />
        </Grid.Col>
      </Grid>

      <Button
        type="submit"
        disabled={!isButtonEnabled}
        mt={20}
        loading={updateUserProfile.isPending}
      >
        Save Account Details
      </Button>
    </form>
  );
}

export default PersonalForm;
