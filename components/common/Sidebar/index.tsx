// sidebar.tsx
"use client";

import { useState } from "react";
import {
  Center,
  Tooltip,
  UnstyledButton,
  Stack,
  rem,
  Text,
} from "@mantine/core";
import { IconSwitchHorizontal, IconLogout } from "@tabler/icons-react";
import { useRouter, usePathname } from "next/navigation";
import classes from "./sidebar.module.css";
import { sidebarItems } from "./sidebar";

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
    // <Tooltizp
    //   label={label}
    //   // position="flex-start"
    //   transitionProps={{ duration: 0 }}
    // >
    <UnstyledButton
      onClick={handleClick}
      className={classes.link}
      data-active={active || undefined}
    >
      <Icon style={{ width: "", height: "100px" }} stroke={1.5} />
      <Text size="14px" ml={10}>
        {label}
      </Text>
    </UnstyledButton>
    // </Tooltizp>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const activeIndex = sidebarItems.findIndex((item) =>
    pathname.includes(item.link)
  );

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
    console.log("Switching account");
  };

  const handleLogout = () => {
    router.push("/login");
    // Add any additional logout logic here
  };

  return (
    <nav className={classes.navbar}>
      <Center>
        <Text c={""} fw={600} size="22px">
          Digi Menu
        </Text>
      </Center>

      <div className={classes.navbarMain}>
        <Stack justify="flex-start" gap={5}>
          {links}
        </Stack>
      </div>
    </nav>
  );
}
