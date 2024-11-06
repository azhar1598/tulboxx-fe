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

// Define the validation schema using zod
const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().regex(/^\+?[1-9]\d{9,14}$/, "Invalid phone number"),
});

const MerchantForm = () => {
  const router = useRouter();
  const notification = usePageNotifications();
  const form = useForm({
    validate: zodResolver(formSchema),
    initialValues: {
      name: "",
      email: "",
      phone: "",
    },
  });

  const handleSubmit = (values) => {
    console.log("Form submitted:", values);
    router.push("/store/m2830284hde/add");
    notification.success(`Merchant created successfully`);
    // Handle form submission here
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack spacing="md">
        <TextInput
          label="Full Name"
          placeholder="Enter your full name"
          icon={<IconUser size="1rem" />}
          {...form.getInputProps("name")}
          withAsterisk
        />

        <TextInput
          label="Email"
          placeholder="your@email.com"
          icon={<IconMail size="1rem" />}
          {...form.getInputProps("email")}
          withAsterisk
        />

        <TextInput
          label="Phone Number"
          placeholder="+1234567890"
          icon={<IconPhone size="1rem" />}
          {...form.getInputProps("phone")}
          withAsterisk
        />

        <Group position="right" mt="md">
          <Button type="submit" w={200}>
            Create
          </Button>
        </Group>
      </Stack>
    </form>
  );
};

export default MerchantForm;
