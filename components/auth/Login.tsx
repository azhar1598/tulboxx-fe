import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Button,
  TextInput,
  PasswordInput,
  Stack,
  Title,
  Text,
  Divider,
  Card,
  Center,
  Loader,
} from "@mantine/core";
import LoginCover from "../../public/assets/auth/loginscreen.png";
import { isEmail } from "@mantine/form";
import { useForm } from "@mantine/form";
import GoogleLogo from "../../public/assets/auth/google.png";
import { useMutation } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/client";

const LoginForm = ({ login }: { login: any }) => {
  const router = useRouter();
  const supabase = createClient();
  const [isLoading, setIsLoading] = useState(true);

  const form = useForm({
    initialValues: {
      // email: "admin@gmail.com",
      // password: "12345678",
      email: "",
      password: "",
    },
    validate: {
      email: isEmail("Please enter a valid email address"),
      password: (value: string) =>
        value.length < 6 ? "Password must be at least 6 characters long" : null,
    },
  });

  // Check auth state on component mount and URL changes
  useEffect(() => {
    // Handle redirect from OAuth provider
    const handleAuthStateChange = async () => {
      setIsLoading(true);

      // Get current session
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      // If we have a session and we're on the login page, redirect to dashboard
      if (session) {
        console.log("Authenticated session found, redirecting to dashboard");
        // router.push("/dashboard");
        window.location.href = "/";
        return;
      }

      setIsLoading(false);
    };

    // Run on mount
    handleAuthStateChange();

    // Subscribe to auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("Auth state changed:", event);
        if (event === "SIGNED_IN" && session) {
          console.log("User signed in, redirecting to dashboard");
          // router.push("/dashboard");
          window.location.href = "/";
        }
      }
    );

    // Cleanup subscription
    return () => {
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, [router, supabase]);

  const googleLoginMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      if (data && data.url) {
        // This redirect will take user to Google's login page
        window.location.href = data.url;
      }
    },
    onError: (err: Error) => {
      console.error("Google login error:", err.message);
    },
  });

  if (isLoading || googleLoginMutation.isPending) {
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
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center">
        <div>
          {/* Logo */}
          <div className="text-center mb-8">
            <Title order={2} size={40}>
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
