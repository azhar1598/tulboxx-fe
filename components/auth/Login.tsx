import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Button,
  TextInput,
  PasswordInput,
  Stack,
  Title,
  Text,
  Divider,
  Card,
  rem,
  Center,
  Loader,
} from "@mantine/core";
import LoginCover from "../../public/assets/auth/logincover.jpg";
import { isEmail } from "@mantine/form";
import { useForm } from "@mantine/form";
import GoogleLogo from "../../public/assets/auth/google.png";
import { useMutation } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/client";

const LoginForm = ({ login }: { login: any }) => {
  const supabase = createClient();
  const form = useForm({
    initialValues: {
      email: "admin@gmail.com",
      password: "12345678",
    },
    validate: {
      email: isEmail("Please enter a valid email address"),
      password: (value: string) =>
        value.length < 6 ? "Password must be at least 6 characters long" : null,
    },
  });

  const googleLoginMutation = useMutation({
    mutationFn: async () =>
      supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/`,
        },
      }),

    onSuccess: async (res) => {
      const { data } = res;

      console.log("data", data);
    },
    onError: (err: Error) => {
      console.log("err", err.message);
    },
  });

  if (googleLoginMutation.isPending) {
    return (
      <Center h={"100vh"}>
        <Loader color="white" />
      </Center>
    );
  }

  return (
    <div className="flex h-screen w-full">
      <div className="hidden md:block w-1/2 bg-gray-100 relative">
        <Image
          src={LoginCover}
          alt="Construction tools"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Right side - Login form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center  bg-]">
        <div className=" ">
          {/* Logo */}
          <div className="text-center mb-8">
            <Title
              order={2}
              size={40}
              // variant="gradient"
              // gradient={{ from: "red", to: "orange" }}
            >
              Tulboxx
            </Title>
            <Text color="dimmed" size="sm">
              Enter your credentials to access your account
            </Text>
          </div>

          <Card
            shadow="xl"
            radius="md"
            p="xl"
            withBorder
            style={{
              backgroundColor: "#1e1se1e",
              color: "white",
              maxWidth: 400,
              width: "100%",
            }}
          >
            <Stack align="center" gap="md">
              <form
                onSubmit={form.onSubmit(() => {
                  login.mutate(form);
                })}
              >
                <Stack gap="xs">
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
                    gradient={{ from: "red", to: "orange" }}
                    loading={login.isPending}
                    fullWidth
                  >
                    Sign in
                  </Button>
                </Stack>
              </form>

              <Divider label="Or continue with email" labelPosition="center" />
              {/* <Button
                variant="gradient"
                gradient={{ from: "red", to: "orange" }}
                // leftSection={
                //   <Image
                //     src={Google}
                //     alt="Google logo"
                //     width={20}
                //     height={20}
                //     style={{ marginRight: rem(10) }}
                //   />
                // }

                w={300}
              >
                Sign in with Google
              </Button> */}
              <Image
                src={GoogleLogo}
                alt="Google logo"
                width={40}
                height={20}
                className="cursor-pointer"
                onClick={() => {
                  googleLoginMutation.mutate();
                }}
              />

              <Text color="dimmed" size="sm" fw={500}>
                Don't have an account?{" "}
                <Link
                  href="/signup"
                  className="link-global-style hover:underline text-orange-500"
                >
                  Sign up
                </Link>
              </Text>
            </Stack>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
