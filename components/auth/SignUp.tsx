"use client";
import Image from "next/image";
import React from "react";
import {
  Button,
  Center,
  Flex,
  Group,
  rem,
  Select,
  Slider,
  Stack,
  TextInput,
  Text,
  Textarea,
} from "@mantine/core";
import { signIn } from "next-auth/react";
import { hasLength, isEmail, useForm } from "@mantine/form";
import { useMutation } from "@tanstack/react-query";
import callApi from "@/services/apiService";
import Link from "next/link";
import { useRouter } from "next/navigation";

import Google from "../../public/assets/auth/google.webp";

interface PropTypes {
  isMobile: boolean;
  signup: any;
}

const SignUp = ({ isMobile, signup }: PropTypes) => {
  const router = useRouter();

  const form = useForm({
    initialValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validate: {
      name: hasLength({ min: 2, max: 10 }, "Name must be 2-10 characters long"),
      email: isEmail("Invalid email"),
      password: (value: string) =>
        value.length < 8 ? "Password must be at least 8 characters long" : null,
      confirmPassword: (value: string, values: { password: string }) =>
        value !== values.password ? "Passwords do not match" : null,
    },
  });

  return (
    <Stack
      w={400}
      className={`relative items-center p-1  shadow-xl  bg-[#1e1e1ed4] rounded-md h-[100vh] md:h-auto`}
    >
      <Stack className={`text-white p-6 rounded-lg`}>
        <Stack h={150} align="center" justify="center">
          <Group className=" relative w-full h-12">
            {/* <Image
              src={WoxaLogo}
              alt="Logo"
              layout="fill"
              objectFit="contain"
              unoptimized
            /> */}
          </Group>
          {/* <Text>Video creation at its Best</Text> */}
        </Stack>
        <Button
          type="button"
          onClick={() => signIn("google")}
          className="w-full mt-2 bg-white text-black rounded-md flex items-center justify-center"
          style={{ border: "1px solid #ccc" }}
        >
          <Image
            src={Google}
            alt="Google logo"
            width={20}
            height={20}
            className="mr-2"
          />
          Sign up with Google
        </Button>

        <Text className="text-center font-montMedium" style={{ color: "gray" }}>
          or
        </Text>
        <form
          onSubmit={form.onSubmit(() => {
            signup.mutate(form);
          })}
        >
          <Stack gap={20} justify="center">
            <TextInput
              type="text"
              placeholder="Name"
              className=""
              key={form.key("name")}
              {...form.getInputProps("name")}
            />
            <TextInput
              type="email"
              placeholder="Email Address"
              {...form.getInputProps("email")}
            />
            <TextInput
              type="password"
              placeholder="Password"
              {...form.getInputProps("password")}
            />
            <TextInput
              type="password"
              placeholder="Confirm Password"
              {...form.getInputProps("confirmPassword")}
            />
            <Button
              type="submit"
              variant="primary"
              loading={signup.isPending}
              // disabled={true}
            >
              Sign up →
            </Button>
            <Text className="text-center" size="14px">
              Already have an account?
              <Link href="/login" className="link-global-style">
                Login
              </Link>
            </Text>
          </Stack>
        </form>
      </Stack>
    </Stack>
  );
};

export default SignUp;
