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
  Title,
} from "@mantine/core";
import {
  IconSwitchHorizontal,
  IconLogout,
  IconTool,
} from "@tabler/icons-react";
import { useRouter, usePathname } from "next/navigation";
import classes from "./sidebar.module.css";
import { sidebarItems } from "./sidebar";

import LogoImage from "../../../public/assets/logo/logo.png";
import Image from "next/image";

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
      // style={{ borderBottom: "0.5px solid gray" }}
    >
      <Icon style={{ width: "", height: "100px" }} stroke={1.5} />
      <Text size="15px" ml={10}>
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

  return (
    <nav className={classes.navbar}>
      <Center>
        {/* <IconTool color="white" /> */}

        <Title
          order={1}
          c={"white"}
          fw={600}
          size="28px"
          style={{ fontWeight: 600 }}
        >
          Tulboxx
        </Title>
        {/* <Image src={LogoImage} alt="logo" height={300} width={300} /> */}
      </Center>

      <div className={classes.navbarMain}>
        <Stack justify="flex-start" gap={5}>
          {links}
          <UnstyledButton
            onClick={() => {
              signOut({ callbackUrl: "/login" });
            }}
            className={classes.link}
            // data-active={}
          >
            <IconLogout style={{ width: "", height: "100px" }} stroke={1.5} />
            <Text size="14px" ml={10}>
              Logout
            </Text>
          </UnstyledButton>
        </Stack>
      </div>
    </nav>
  );
}
