// sidebar.tsx
"use client";

import { useState } from "react";
import { Center, UnstyledButton, Stack, rem, Text, Title } from "@mantine/core";
import {
  IconSwitchHorizontal,
  IconLogout,
  IconTool,
} from "@tabler/icons-react";
import { useRouter, usePathname } from "next/navigation";
import classes from "./sidebar.module.css";
import { sidebarItems } from "./sidebar";
import LogoImage1 from "../../../public/logo/logo-negative.png";
import LogoImage2 from "../../../public/logo/logo-positive.png";
import Image from "next/image";
import { createClient } from "@/utils/supabase/client";

interface NavbarLinkProps {
  icon: any;
  label: string;
  active?: boolean;
  link: string;
  onClick?(): void;
}

function NavbarLink({
  icon: Icon,
  label,
  active,
  onClick,
  link,
}: NavbarLinkProps) {
  const router = useRouter();

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
    router.push(link);
  };

  return (
    <UnstyledButton
      onClick={handleClick}
      className={classes.link}
      data-active={active || undefined}
    >
      <Icon style={{ width: rem(22), height: rem(22) }} stroke={1.5} />
      <Text size="sm" ml="md">
        {label}
      </Text>
    </UnstyledButton>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const supabase = createClient();

  const activeIndex = sidebarItems.findIndex((item) => {
    if (item.link === "/") {
      return pathname === item.link;
    }
    return pathname.startsWith(item.link);
  });

  const links = sidebarItems.map((link, index) => (
    <NavbarLink
      {...link}
      key={link.label}
      active={index === activeIndex}
      onClick={() => {}}
    />
  ));

  const handleAccountSwitch = () => {
    // Handle account switching logic
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      router.refresh();
      router.push("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <nav className={classes.navbar}>
      <Center
        style={{
          borderBottom: "1px solid #1a2f45",
        }}
      >
        {/* <IconTool color="white" size="1.8rem" />
        <Title
          order={1}
          c={"white"}
          fw={600}
          size="26px"
          style={{ fontWeight: 700, marginLeft: "12px" }}
        >
          Tulboxx
        </Title> */}
        <Image src={LogoImage1} alt="logo" width={150} height={150} />
      </Center>

      <div className={classes.navbarMain}>
        <Stack justify="flex-start" gap={0}>
          {links}
          <UnstyledButton
            onClick={() => {
              handleLogout();
            }}
            className={classes.link}
            // data-active={}
          >
            <IconLogout
              style={{ width: rem(22), height: rem(22) }}
              stroke={1.5}
            />
            <Text size="sm" ml="md">
              Logout
            </Text>
          </UnstyledButton>
        </Stack>
      </div>
    </nav>
  );
}
