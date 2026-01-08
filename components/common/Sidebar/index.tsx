// sidebar.tsx
"use client";

import { useState, useEffect, useContext } from "react";
import { UnstyledButton, Stack, rem, Tooltip, Menu } from "@mantine/core";
import {
  IconLogout,
  IconChevronLeft,
  IconChevronRight,
  IconSettings,
  IconUser,
} from "@tabler/icons-react";
import { useRouter, usePathname } from "next/navigation";
import classes from "./sidebar.module.css";
import { sidebarItems } from "./sidebar";
import LogoImage1 from "../../../public/logo/logo-negative.png";
import OnlyLogo from "../../../public/logo/only-logo.png";
import Image from "next/image";
import { createClient } from "@/utils/supabase/client";
import { UserContext } from "@/app/layout";

interface NavbarLinkProps {
  icon: any;
  label: string;
  active?: boolean;
  link: string;
  onClick?(): void;
  collapsed?: boolean;
}

function NavbarLink({
  icon: Icon,
  label,
  active,
  onClick,
  link,
  collapsed,
}: NavbarLinkProps) {
  const router = useRouter();

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
    router.push(link);
  };

  return (
    <Tooltip
      label={label}
      position="right"
      disabled={!collapsed}
      withArrow
      transitionProps={{ duration: 200 }}
      color="dark"
      offset={10}
    >
      <UnstyledButton
        onClick={handleClick}
        className={classes.link}
        data-active={active || undefined}
      >
        <Icon className={classes.linkIcon} stroke={1.5} />
        {!collapsed && <span className={classes.linkLabel}>{label}</span>}
      </UnstyledButton>
    </Tooltip>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(true);
  const supabase = createClient();
  const user = useContext(UserContext);

  const toggleCollapse = () => {
    const newCollapsed = !collapsed;
    setCollapsed(newCollapsed);
    const newWidth = newCollapsed ? "80px" : "260px";
    document.documentElement.style.setProperty("--sidebar-width", newWidth);
  };

  // Reset width on mount to ensure sync
  useEffect(() => {
    const width = collapsed ? "80px" : "260px";
    document.documentElement.style.setProperty("--sidebar-width", width);
  }, [collapsed]);

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
      collapsed={collapsed}
      onClick={() => {}}
    />
  ));

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      router.refresh();
      router.push("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const userInitials = user?.email
    ? user.email.substring(0, 2).toUpperCase()
    : "U";
  const displayName = user?.user_metadata?.full_name || "My Account";

  return (
    <nav className={classes.navbar} data-collapsed={collapsed}>
      <div className={classes.logoContainer}>
        <Image
          src={collapsed ? OnlyLogo : LogoImage1}
          alt="logo"
          width={collapsed ? 32 : 150}
          height={50}
          style={{
            objectFit: "contain",
            height: "auto",
            transition: "all 0.3s ease",
          }}
        />
      </div>

      <button className={classes.toggleBtn} onClick={toggleCollapse}>
        {collapsed ? (
          <IconChevronRight size={14} />
        ) : (
          <IconChevronLeft size={14} />
        )}
      </button>

      <div className={classes.navbarMain}>{links}</div>

      <div className={classes.footer}>
        <Menu
          shadow="md"
          width={220}
          position="right-end"
          offset={14}
          withArrow
          arrowPosition="center"
        >
          <Menu.Target>
            <div className={classes.userProfile}>
              <div className={classes.userAvatar}>{userInitials}</div>
              {!collapsed && (
                <div className={classes.userInfo}>
                  <span className={classes.userName}>{displayName}</span>
                  <span className={classes.userEmail}>{user?.email}</span>
                </div>
              )}
            </div>
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Label>Application</Menu.Label>
            <Menu.Item
              leftSection={<IconSettings size={14} />}
              onClick={() => router.push("/account")}
            >
              Account Settings
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
    </nav>
  );
}
