"use client";
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { QueryClientProvider } from "@tanstack/react-query";
import { Flex, MantineProvider, Stack } from "@mantine/core";
import { theme } from "@/theme";
import { queryClient } from "@/lib/queryClient";
import "@mantine/core/styles.css";
import "mantine-datatable/styles.layer.css";
// import { SessionProvider } from "next-auth/react";
import { Provider } from "react-redux";
import store from "@/redux/store";
import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/common/Sidebar";
import Header from "@/components/common/Header";
import "@mantine/notifications/styles.css";
import { Notifications } from "@mantine/notifications";
import "@mantine/carousel/styles.css";
import "@mantine/dates/styles.css";
import { createClient } from "@/utils/supabase/client";
import { createContext, useEffect, useState } from "react";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

// export const metadata: Metadata = {
//   title: "Create Next App",
//   description: "Generated by create next app",
// };

// Create a context for the user
export const UserContext = createContext<any>(null);

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const supabase = createClient();

  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    if (pathname === "/login" || pathname === "/signup") return;
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };
    fetchUser();
  }, [supabase]);

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased `}
      >
        <QueryClientProvider client={queryClient}>
          <MantineProvider theme={theme}>
            <Notifications position="top-center" />
            <Provider store={store}>
              <UserContext.Provider value={user}>
                <Flex align={"Flex-start"} justify={"Flex-start"} w={"100%"}>
                  {pathname !== "/login" &&
                    pathname !== "/test" &&
                    pathname !== "/signup" &&
                    pathname != "/story-editor" && <Sidebar />}

                  {/* {pathname != "/story-editor" &&
                      pathname !== "/login" &&
                      pathname !== "/signup" && <Header />} */}
                  <Stack>
                    {pathname !== "/login" &&
                      pathname !== "/test" &&
                      pathname !== "/signup" && <Header />}

                    {children}
                  </Stack>
                </Flex>
              </UserContext.Provider>
            </Provider>
          </MantineProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
