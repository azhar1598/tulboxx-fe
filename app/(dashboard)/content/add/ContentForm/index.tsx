"use client";
import { useForm, zodResolver } from "@mantine/form";
import { z } from "zod";
import {
  TextInput,
  Group,
  Button,
  Stack,
  Title,
  Text,
  Paper,
  Radio,
  Textarea,
  Select,
  Switch,
} from "@mantine/core";
import {
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandLinkedin,
  IconBrandX,
  IconSend,
} from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { usePageNotifications } from "@/lib/hooks/useNotifications";
import { useMutation } from "@tanstack/react-query";
import callApi from "@/services/apiService";

// Define the validation schema using zod
const formSchema = z.object({
  projectName: z.string().min(2, "Project name must be at least 2 characters"),
  postType: z.string().min(1, "Please select a post type"),
  advice: z.string().min(10, "Advice must be at least 10 characters"),
  benefit: z.string().min(10, "Benefit must be at least 10 characters"),
  platform: z.string().min(1, "Please select a platform"),
  tone: z.string().min(1, "Please select a tone"),
  length: z.string().min(1, "Please select a length"),
  useEmojis: z.boolean(),
  useHashtags: z.boolean(),
});

const ContentForm = () => {
  const router = useRouter();
  const notification = usePageNotifications();
  const form = useForm({
    validate: zodResolver(formSchema),
    initialValues: {
      projectName: "",
      postType: "Tips & Advice",
      advice: "",
      benefit: "",
      platform: "",
      tone: "",
      length: "",
      useEmojis: true,
      useHashtags: false,
    },
  });

  const createPost = useMutation({
    mutationFn: () => callApi.post(`/v1/social-posts`, form.values),
    onSuccess: async (res) => {
      const { data } = res;
      router.push(`/content/view?postId=${data?.data?.id}`);
      notification.success(`Social media post created successfully`);
    },
    onError: (err: Error) => {
      notification.error(`${err}`);
      console.log(err.message);
    },
  });

  return (
    <form
      onSubmit={form.onSubmit(() => {
        createPost.mutate();
      })}
    >
      <Stack gap="xl">
        <Group grow>
          <TextInput
            label="Project Name"
            placeholder="new era"
            {...form.getInputProps("projectName")}
            withAsterisk
          />

          <Select
            label="What type of post do you want to create?"
            placeholder="Select post type"
            data={[
              { value: "Tips & Advice", label: "Tips & Advice" },
              { value: "Announcement", label: "Announcement" },
              { value: "Promotion", label: "Promotion" },
              { value: "Case Study", label: "Case Study" },
              { value: "How-to Guide", label: "How-to Guide" },
            ]}
            {...form.getInputProps("postType")}
            withAsterisk
          />
        </Group>
        <Group grow>
          <Textarea
            label="What tip or piece of advice would you like to share?"
            placeholder='Example: "Ways to prepare your yard for winter."'
            minRows={3}
            {...form.getInputProps("advice")}
            withAsterisk
          />

          <Textarea
            label="Why is this advice beneficial for your clients?"
            placeholder='Example: "Helps prevent plant damage and ensures your yard is ready for spring."'
            minRows={3}
            {...form.getInputProps("benefit")}
            withAsterisk
          />
        </Group>
        <Group grow>
          <Radio.Group
            label="What platform will you post on?"
            {...form.getInputProps("platform")}
            withAsterisk
          >
            <Group mt="xs">
              <Radio
                value="Facebook"
                label="Facebook"
                icon={IconBrandFacebook}
              />
              <Radio
                value="Instagram"
                label="Instagram"
                icon={IconBrandInstagram}
              />
              <Radio
                value="LinkedIn"
                label="LinkedIn"
                icon={IconBrandLinkedin}
              />
              <Radio value="X" label="X" icon={IconBrandX} />
            </Group>
          </Radio.Group>

          <Radio.Group
            label="What tone should the post have?"
            {...form.getInputProps("tone")}
            withAsterisk
          >
            <Group mt="xs">
              <Radio value="Friendly" label="Friendly" />
              <Radio value="Professional" label="Professional" />
              <Radio value="Engaging" label="Engaging" />
              <Radio value="B2B" label="B2B" />
              <Radio value="Educational" label="Educational" />
            </Group>
          </Radio.Group>
        </Group>
        <Radio.Group
          label="How long do you want the post to be?"
          {...form.getInputProps("length")}
          withAsterisk
        >
          <Group mt="xs">
            <Radio value="Short" label="Short" />
            <Radio value="Medium" label="Medium" />
            <Radio value="Long" label="Long" />
          </Group>
        </Radio.Group>

        <Switch
          label="Do you want to see emojis in this post?"
          checked={form.values.useEmojis}
          onChange={(event) =>
            form.setFieldValue("useEmojis", event.currentTarget.checked)
          }
        />

        <Switch
          label="Do you want hashtags in this post?"
          checked={form.values.useHashtags}
          onChange={(event) =>
            form.setFieldValue("useHashtags", event.currentTarget.checked)
          }
        />

        <Group mt="xl">
          <Button
            type="submit"
            w={200}
            loading={createPost.isPending}
            leftSection={<IconSend size="1rem" />}
          >
            Generate Post
          </Button>
        </Group>
      </Stack>
    </form>
  );
};

export default ContentForm;
