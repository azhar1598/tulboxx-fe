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
import { useRouter } from "next/navigation";
import LoginForm from "@/components/auth/Login";
import callApi from "@/services/apiService";
import { createClient } from "@/utils/supabase/client";
import { usePageNotifications } from "@/lib/hooks/useNotifications";
interface FormTypes {
  email: string;
  password: string;
}

function login() {
  const isMobile = useMediaQuery("(max-width: 50em)");
  const router = useRouter();
  const supabase = createClient();
  const notification = usePageNotifications();

  const login = useMutation({
    mutationFn: async (form: { values: FormTypes }) => {
      const response = await callApi.post("/auth/login", form.values);
      return response.data; // Extract only the data from the response
    },
    onSuccess: async (data) => {
      if (data.session) {
        // Store session in Supabase auth (important for middleware detection)
        await supabase.auth.setSession({
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
        });

        // Reload the page to sync session cookies
        window.location.reload();
      } else {
        console.error("Session data missing from response");
      }
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
    // <div className="flsex itemscenter justify-center">
    <LoginForm login={login} />
    // </div>
  );
}

export default login;
