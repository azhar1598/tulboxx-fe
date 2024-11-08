import Image from "next/image";
import React, { useState } from "react";
import {
  Button,
  Card,
  Checkbox,
  Divider,
  Flex,
  Group,
  PasswordInput,
  rem,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { signIn } from "next-auth/react";
import { hasLength, isEmail, useForm } from "@mantine/form";
import { useMutation } from "@tanstack/react-query";
import callApi from "@/services/apiService";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Google from "../../public/assets/auth/google.webp";

interface PropTypes {
  login: any;
  isMobile: boolean;
}

const EnhancedLogin = ({ isMobile, login }: PropTypes) => {
  const form = useForm({
    initialValues: {
      email: "prototype@gmail.com",
      password: "12345678",
    },
    validate: {
      email: isEmail("Please enter a valid email address"),
      password: (value: string) =>
        value.length < 6 ? "Password must be at least 6 characters long" : null,
    },
  });

  return (
    <Card
      shadow="xl"
      radius="md"
      p="xl"
      withBorder
      style={{
        backgroundColor: "#1e1e1e",
        color: "white",
        maxWidth: 400,
        width: "100%",
      }}
    >
      <Stack align="center" spacing="md">
        <Title order={2}>Welcome Back</Title>
        <Text color="dimmed" size="sm">
          Enter your credentials to access your account
        </Text>

        <Button
          color="gray"
          leftSection={
            <Image
              src={Google}
              alt="Google logo"
              width={20}
              height={20}
              style={{ marginRight: rem(10) }}
            />
          }
          onClick={() => signIn("google")}
          w={300}
        >
          Sign in with Google
        </Button>

        <Divider label="Or continue with email" labelPosition="center" />

        <form
          onSubmit={form.onSubmit(() => {
            login.mutate(form);
          })}
        >
          <Stack spacing="xs">
            <TextInput
              label="Email"
              placeholder="your@email.com"
              {...form.getInputProps("email")}
              w={300}
            />
            <PasswordInput
              label="Password"
              placeholder="Password"
              {...form.getInputProps("password")}
            />

            <Button
              type="submit"
              variant="gradient"
              gradient={{ from: "indigo", to: "cyan" }}
              loading={login.isPending}
              fullWidth
            >
              Sign in
            </Button>
          </Stack>
        </form>

        {/* <Text color="dimmed" size="sm">
          Don't have an account?{" "}
          <Link href="/signup" className="link-global-style">
            Sign up
          </Link>
        </Text> */}
      </Stack>
    </Card>
  );
};

export default EnhancedLogin;
