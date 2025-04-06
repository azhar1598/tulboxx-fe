import React, { useContext, useEffect, useState } from "react";
import {
  Group,
  Avatar,
  Text,
  Menu,
  UnstyledButton,
  Box,
  Burger,
  Drawer,
  Title,
} from "@mantine/core";
import {
  IconSettings,
  IconLogout,
  IconLock,
  IconChevronDown,
  IconQuestionMark,
  IconInfoOctagonFilled,
  IconBell,
  IconFileText,
  IconDashboard,
  IconHome,
  IconUser,
} from "@tabler/icons-react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

import Image from "next/image";
import { UserContext } from "@/app/layout";
import { useDisclosure } from "@mantine/hooks";
import { sidebarItems } from "../Sidebar/sidebar";
import MobileHeader from "./MobileHeader";

function Header() {
  const router = useRouter();
  const supabase = createClient();

  const user = useContext(UserContext);

  // Mock user data - replace with your actual auth implementation
  // const user = {
  //   name: "Jimmy Williams",
  //   email: "john.doe@example.com",
  //   image:
  //     "https://ui-avatars.com/api/?name=John+Doe&background=0D8ABC&color=fff",
  // };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      router.refresh();
      router.push("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };
  const [avatar, setAvatar] = useState<string>("");

  useEffect(() => {
    setAvatar(user?.user_metadata?.avatar_url);
  }, [user?.user_metadata?.avatar_url]);

  const menuItems = [
    { icon: <IconHome size={20} />, label: "Home", link: "/" },
    {
      icon: <IconDashboard size={20} />,
      label: "Dashboard",
      link: "/dashboard",
    },
    { icon: <IconUser size={20} />, label: "Profile", link: "/profile" },
    {
      icon: <IconFileText size={20} />,
      label: "Documents",
      link: "/documents",
    },
    { icon: <IconSettings size={20} />, label: "Settings", link: "/settings" },
  ];

  return (
    <div className="h-16 header  bg-white shadow-sm md:px-6">
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          // position: "relative",
          // height: "100%",
          position: "fixed",
          right: 20,
          top: 10,
          gap: 20,
        }}
      >
        <div className="hidden md:flex ">
          <div className=" hover:bg-gray-200 cursor-pointer p-2">
            <IconBell stroke={2} />
          </div>
          {/* <div className=" hover:bg-gray-200 cursor-pointer p-2">
            <IconInfoOctagonFilled stroke={2} />
          </div> */}
          <Menu position="bottom-end" shadow="md" width={200} withinPortal>
            <Menu.Target>
              <UnstyledButton>
                <Group gap="xs">
                  {avatar ? (
                    <Image
                      src={avatar}
                      width={32}
                      height={32}
                      style={{ borderRadius: "50%" }}
                      alt={user?.user_metadata?.name || "User avatar"}
                    />
                  ) : (
                    <Avatar size="md" radius="xl" />
                  )}
                  <Box style={{ flex: 1 }}>
                    {user?.user_metadata?.firstName && (
                      <Text size="sm" fw={500}>
                        {user?.user_metadata?.firstName}{" "}
                        {user?.user_metadata?.lastName}
                      </Text>
                    )}
                    {user?.user_metadata?.name && (
                      <Text size="sm" fw={500}>
                        {user?.user_metadata?.name}
                      </Text>
                    )}
                  </Box>
                  <IconChevronDown size={16} />
                </Group>
              </UnstyledButton>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Label style={{ textWrap: "wrap" }}>
                User: {user?.email}
              </Menu.Label>
              <Menu.Item
                leftSection={<IconSettings size={14} />}
                component="a"
                href="/account"
              >
                Account settings
              </Menu.Item>
              <Menu.Item
                leftSection={<IconLock size={14} />}
                component="a"
                href="/change-password"
              >
                Change password
              </Menu.Item>
              <Menu.Divider />
              <Menu.Item
                color="red"
                leftSection={<IconLogout size={14} />}
                onClick={handleLogout}
              >
                Logout
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </div>
      </div>
      <div className="md:hidden">
        <MobileHeader handleLogout={handleLogout} user={user} />
      </div>
    </div>
  );
}

export default Header;
