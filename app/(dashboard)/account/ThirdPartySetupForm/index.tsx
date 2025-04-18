"use client";
import { useForm, zodResolver } from "@mantine/form";
import { z } from "zod";
import {
  TextInput,
  PasswordInput,
  Button,
  Stack,
  Text,
  Paper,
  Group,
  Switch,
  Alert,
} from "@mantine/core";
import { IconBrandFacebook, IconAlertCircle } from "@tabler/icons-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import callApi from "@/services/apiService";
import { usePageNotifications } from "@/lib/hooks/useNotifications";
import { useEffect } from "react";

// Define the validation schema using zod
const formSchema = z.object({
  facebookPageId: z.string().min(1, "Facebook Page ID is required"),
  facebookAccessToken: z.string().min(1, "Facebook Access Token is required"),
  enableAutoPosting: z.boolean().default(false),
});

function ThirdPartySetupForm() {
  const notifications = usePageNotifications();

  // Get existing settings
  const getSettings = useQuery({
    queryKey: ["get-facebook-settings"],
    queryFn: async () => {
      const response = await callApi.get(`/facebook-settings`);
      return response;
    },
    select: (data) => data?.data,
  });

  const form = useForm({
    validate: zodResolver(formSchema),
    initialValues: {
      facebookPageId: "",
      facebookAccessToken: "",
      enableAutoPosting: false,
    },
  });

  // Update form values when settings are loaded
  useEffect(() => {
    if (getSettings.data) {
      form.setValues({
        facebookPageId: getSettings.data.facebookPageId || "",
        facebookAccessToken: getSettings.data.facebookAccessToken || "",
        enableAutoPosting: getSettings.data.enableAutoPosting || false,
      });
      form.resetDirty();
    }
  }, [getSettings.data]);

  const updateSettings = useMutation({
    mutationFn: async (values: any) => {
      const response = await callApi.patch("/facebook-settings", values);
      return response.data;
    },
    onSuccess: () => {
      notifications.success("Facebook settings updated successfully");
      getSettings.refetch();
    },
    onError: () => {
      notifications.error("Failed to update Facebook settings");
    },
  });

  return (
    <Paper p="xl" mt="xl">
      <form onSubmit={form.onSubmit((values) => updateSettings.mutate(values))}>
        <Stack>
          <Group mb="md">
            <IconBrandFacebook size={24} color="#1877F2" />
            <Text fw={600} size="lg">
              Facebook Integration
            </Text>
          </Group>

          <Alert
            icon={<IconAlertCircle size="1rem" />}
            title="Important!"
            color="blue"
            mb="md"
          >
            To get your Facebook Page ID and Access Token, you need to:
            <ol className="mt-2 ml-4">
              <li>Create a Facebook Page if you haven't already</li>
              <li>
                Go to{" "}
                <a
                  href="https://developers.facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline"
                >
                  Facebook Developers
                </a>
              </li>
              <li>Create an App and get the necessary credentials</li>
              <li>
                Generate a long-lived Page Access Token with{" "}
                <code>pages_manage_posts</code> permission
              </li>
            </ol>
          </Alert>

          <TextInput
            label="Facebook Page ID"
            placeholder="Enter your Facebook Page ID"
            {...form.getInputProps("facebookPageId")}
          />

          <PasswordInput
            label="Facebook Access Token"
            placeholder="Enter your Facebook Access Token"
            {...form.getInputProps("facebookAccessToken")}
          />

          <Switch
            label="Enable Auto-Posting"
            description="Automatically post content to Facebook when created"
            {...form.getInputProps("enableAutoPosting", { type: "checkbox" })}
          />

          <Button
            type="submit"
            loading={updateSettings.isPending}
            disabled={!form.isDirty()}
          >
            Save Facebook Settings
          </Button>
        </Stack>
      </form>
    </Paper>
  );
}

export default ThirdPartySetupForm;
