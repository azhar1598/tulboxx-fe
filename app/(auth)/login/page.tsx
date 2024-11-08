"use client";
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
import Login from "@/components/auth/Login";

interface FormTypes {
  email: string;
  password: string;
}

function login() {
  const isMobile = useMediaQuery("(max-width: 50em)");
  const router = useRouter();

  const login = useMutation({
    mutationFn: async (form: { values: FormTypes }) => {
      const response: any = await signIn("signin", {
        redirect: false,
        email: form.values.email,
        password: form.values.password,
      });
      if (response.error) throw new Error(response.error);
      return response;
    },
    onSuccess: async () => {
      router.push("/");
    },
    onError: (err: Error) => {
      notification.error(err.message);
      console.log(err.message);
    },
  });

  if (isMobile === undefined || login.isSuccess) {
    return (
      <Center h={"100vh"}>
        <Loader color="white" />
      </Center>
    );
  }

  return (
    <div className="h-[100vh] flex items-center justify-center">
      <Login isMobile={isMobile} login={login} />
    </div>
  );
}

export default login;
