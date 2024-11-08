"use client";
import SignUp from "@/components/auth/SignUp";
import {
  Center,
  Container,
  Group,
  Loader,
  SimpleGrid,
  Stack,
  Text,
} from "@mantine/core";
import Image from "next/image";
import { useMediaQuery } from "@mantine/hooks";
import DisplayImage from "../../../public/assets/auth/zazu.webp";
import { useMutation } from "@tanstack/react-query";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

interface FormTypes {
  name: string;
  email: string;
  password: string;
}

function signup() {
  const isMobile = useMediaQuery("(max-width: 50em)");
  const router = useRouter();

  const signup = useMutation({
    mutationFn: async (form: { values: FormTypes }) => {
      const response: any = await signIn("signup", {
        redirect: false,
        name: form.values.name,
        email: form.values.email,
        password: form.values.password,
      });
      if (response.error) throw new Error(response.error);
      return response;
    },
    onSuccess: async (res: any) => {
      router.push("/");
    },
    onError: (err: Error) => {
      // notification.error(err.message);
      console.error("Signup Error:", err.message);
    },
  });

  if (isMobile === undefined || signup.isSuccess) {
    return (
      <Center h={"100vh"}>
        <Loader color="white" />
      </Center>
    );
  }

  return <SignUp isMobile={isMobile} signup={signup} />;
}

export default signup;
