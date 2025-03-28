import React from "react";
import { Group, Avatar, Text, Menu, UnstyledButton, Box } from "@mantine/core";
import {
  IconSettings,
  IconLogout,
  IconLock,
  IconChevronDown,
  IconQuestionMark,
  IconInfoOctagonFilled,
  IconBell,
} from "@tabler/icons-react";

function Header() {
  // Mock user data - replace with your actual auth implementation
  const user = {
    name: "Jimmy Williams",
    email: "john.doe@example.com",
    image:
      "https://ui-avatars.com/api/?name=John+Doe&background=0D8ABC&color=fff",
  };

  const handleLogout = () => {
    // Add your logout logic here
    console.log("Logging out...");
  };

  return (
    <div className="h-16 header  bg-white shadow-sm px-6">
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
        <Menu position="bottom-end" shadow="md" width={200} withinPortal>
          <Menu.Target>
            <UnstyledButton>
              <Group spacing="xs">
                <Avatar src={user.image} radius="xl" size="md" />
                <Box sx={{ flex: 1 }}>
                  <Text size="sm" weight={500}>
                    {user.name}
                  </Text>
                </Box>
                <IconChevronDown size={16} />
              </Group>
            </UnstyledButton>
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Label>User: {user.email}</Menu.Label>
            <Menu.Item
              icon={<IconSettings size={14} />}
              component="a"
              href="/account"
            >
              Account settings
            </Menu.Item>
            <Menu.Item
              icon={<IconLock size={14} />}
              component="a"
              href="/change-password"
            >
              Change password
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item
              color="red"
              icon={<IconLogout size={14} />}
              onClick={handleLogout}
            >
              Logout
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
        <div className=" hover:bg-gray-200 cursor-pointer p-2">
          <IconBell stroke={2} />
        </div>
        <div className=" hover:bg-gray-200 cursor-pointer p-2">
          <IconInfoOctagonFilled stroke={2} />
        </div>
      </div>
    </div>
  );
}

export default Header;
