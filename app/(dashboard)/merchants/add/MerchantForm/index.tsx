"use client";
import { useForm, zodResolver } from "@mantine/form";
import { z } from "zod";
import {
  TextInput,
  Group,
  Button,
  Box,
  Paper,
  Title,
  Stack,
} from "@mantine/core";
import { IconUser, IconPhone, IconMail } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { usePageNotifications } from "@/lib/hooks/useNotifications";
import { useMutation } from "@tanstack/react-query";
import callApi from "@/services/apiService";

// Define the validation schema using zod
const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phoneNumber: z.string().regex(/^\+?[1-9]\d{9,14}$/, "Invalid phone number"),
});

const MerchantForm = () => {
  const router = useRouter();
  const notification = usePageNotifications();
  const form = useForm({
    validate: zodResolver(formSchema),
    initialValues: {
      name: "",
      email: "",
      phoneNumber: "",
    },
  });

  const createMerchant = useMutation({
    mutationFn: () => callApi.post(`/v1/merchants`, form.values),
    onSuccess: async (res) => {
      const { data } = res;
      console.log("res", data);
      router.push(`/store/${data?.data?.merchantUUID}/add`);
      notification.success(`Merchant created successfully`);
    },
    onError: (err: Error) => {
      console.log("ee", err);
      notification.error(`${err}`);
      console.log(err.message);
    },
  });
  return (
    <form
      onSubmit={form.onSubmit(() => {
        createMerchant.mutate();
      })}
    >
      <Stack gap="md">
        <TextInput
          label="Full Name"
          placeholder="Enter your full name"
          leftSection={<IconUser size="1rem" />}
          {...form.getInputProps("name")}
          withAsterisk
        />

        <TextInput
          label="Email"
          placeholder="your@email.com"
          leftSection={<IconMail size="1rem" />}
          {...form.getInputProps("email")}
          withAsterisk
        />

        <TextInput
          label="Phone Number"
          placeholder="+1234567890"
          leftSection={<IconPhone size="1rem" />}
          {...form.getInputProps("phoneNumber")}
          withAsterisk
        />

        <Group mt="md">
          <Button type="submit" w={200}>
            Create
          </Button>
        </Group>
      </Stack>
    </form>
  );
};

export default MerchantForm;
