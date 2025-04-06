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
// import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import callApi from "@/services/apiService";

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
      const response = await callApi.post("/auth/signup", form.values);
      return response;
    },
    onSuccess: async () => {
      router.push("/");
    },
    onError: (err: Error) => {
      // notification.error(err.message);
      console.log(err.message);
    },
  });

  // if (isMobile === undefined || signup.isSuccess) {
  //   return (
  //     <Center h={"100vh"}>
  //       <Loader color="white" />
  //     </Center>
  //   );
  // }

  return <SignUp signup={signup} />;
}

export default signup;
