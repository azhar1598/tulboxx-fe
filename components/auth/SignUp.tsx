import React from "react";
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
  Checkbox,
} from "@mantine/core";
import SignupCover from "../../public/assets/auth/signupcover.jpg";
import GoogleLogo from "../../public/assets/auth/google.png";
import { isEmail, hasLength, matches } from "@mantine/form";
import { useForm } from "@mantine/form";
// import GoogleLogo from "../../public/assets/auth/google.webp";
import { useMutation } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/client";

const SignupForm = ({ signup }: { signup: any }) => {
  const supabase = createClient();
  const form = useForm({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validate: {
      firstName: hasLength(
        { min: 2 },
        "First name must be at least 2 characters"
      ),
      lastName: hasLength(
        { min: 2 },
        "Last name must be at least 2 characters"
      ),
      email: isEmail("Please enter a valid email address"),
      password: hasLength(
        { min: 8 },
        "Password must be at least 8 characters long"
      ),
      confirmPassword: (value, values) =>
        value !== values.password ? "Passwords do not match" : null,
    },
  });

  const googleSignupMutation = useMutation({
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

  if (googleSignupMutation.isPending) {
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
          src={SignupCover}
          alt="Construction professionals"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Right side - Signup form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center">
        <div>
          {/* Logo */}
          <div className="text-center mb-6">
            <Title order={2} size={40}>
              Tulboxx
            </Title>
            <Text color="dimmed" size="sm">
              Create your account to get started
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
                  signup.mutate(form);
                })}
              >
                <Stack gap="xs">
                  <div className="flex gap-2">
                    <TextInput
                      label="First Name"
                      placeholder="John"
                      {...form.getInputProps("firstName")}
                      w={145}
                    />
                    <TextInput
                      label="Last Name"
                      placeholder="Doe"
                      {...form.getInputProps("lastName")}
                      w={145}
                    />
                  </div>

                  <TextInput
                    label="Email"
                    placeholder="your@email.com"
                    {...form.getInputProps("email")}
                  />

                  <PasswordInput
                    label="Password"
                    placeholder="Minimum 8 characters"
                    {...form.getInputProps("password")}
                  />

                  <PasswordInput
                    label="Confirm Password"
                    placeholder="Re-enter password"
                    {...form.getInputProps("confirmPassword")}
                  />

                  <Button
                    type="submit"
                    variant="gradient"
                    gradient={{ from: "red", to: "orange" }}
                    fullWidth
                    mt="md"
                    loading={signup.isPending}
                  >
                    Create Account
                  </Button>
                </Stack>
              </form>

              <Divider label="Or sign up with" labelPosition="center" />

              <Image
                src={GoogleLogo}
                alt="Google logo"
                width={40}
                height={20}
                onClick={() => {
                  googleSignupMutation.mutate();
                }}
                style={{ cursor: "pointer" }}
              />
            </Stack>
            <div className="text-center mt-6">
              <Text color="dimmed" size="sm" fw={500}>
                Already have an account?{" "}
                <Link href="/login" className="text-orange-500 hover:underline">
                  Sign in
                </Link>
              </Text>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SignupForm;
