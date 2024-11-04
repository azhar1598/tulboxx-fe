"use client";
import Image from "next/image";
import React, { useState } from "react";
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
  Loader,
} from "@mantine/core";
import { signIn } from "next-auth/react";
import { hasLength, isEmail, useForm } from "@mantine/form";
import { useMutation } from "@tanstack/react-query";
import callApi from "@/services/apiService";
import Link from "next/link";

import { useRouter } from "next/navigation";
// import WoxaLogo from "../../../public/assets/logo/woxa.png";
import Google from "../../public/assets/auth/google.webp";

interface PropTypes {
  login: any;
  isMobile: boolean;
}

const Login = ({ isMobile, login }: PropTypes) => {
  const form = useForm({
    initialValues: {
      email: "prototype@gmail.com",
      password: "12345678",
    },
    validate: {
      email: isEmail("Please enter email address"),
      password: (value: string) =>
        value.length < 6 ? "Password must be at least 6 characters long" : null,
    },
  });

  return (
    <Stack
      w={400}
      className={`relative items-center p-1 bg-[#1e1e1ed4] h-[100vh] md:h-auto
        shadow-xl rounded-md`}
    >
      <Stack className={`${!isMobile && ""} text-white p-6 rounded-lg `}>
        <Stack h={150} align="center" justify="center">
          <Group className=" relative w-full h-12">
            {/* <Image
              src={WoxaLogo}
              alt="Logo"
              layout="fill"
              unoptimized
              objectFit="contain"
            /> */}
          </Group>{" "}
          <Text>Web stories at its Best</Text>
        </Stack>

        <Button
          type="button"
          onClick={() => signIn("google")}
          variant="default"
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
          Login with Google
        </Button>

        <Text className="text-center font-montMedium" style={{ color: "gray" }}>
          or
        </Text>
        <form
          onSubmit={form.onSubmit(() => {
            login.mutate(form);
          })}
        >
          <Stack gap={20} justify="center">
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

            <Button type="submit" variant="primary" loading={login.isPending}>
              Login →
            </Button>
            <Text className="text-center " size="14px">
              Don't have an account?
              <Link href="/signup" className="link-global-style">
                Signup
              </Link>
            </Text>
          </Stack>
        </form>
      </Stack>
    </Stack>
  );
};

export default Login;
