import { Burger, Drawer, Text, Title, UnstyledButton } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

import React from "react";
import { sidebarItems } from "../../Sidebar/sidebar";
import { IconLogout } from "@tabler/icons-react";
import { useRouter } from "next/navigation";

function index({
  handleLogout,
  user,
}: {
  handleLogout: () => void;
  user: any;
}) {
  const [opened, { toggle, close }] = useDisclosure(false);
  const router = useRouter();

  return (
    <>
      <div className="flex items-center justify-between w-full p-2">
        <Text size="xl" fw={700} className="text-xl font-bold">
          Tulboxx
        </Text>
        <div className="">
          <Burger opened={opened} onClick={toggle} className="md:hidden" />

          {/* <Text size="lg" fw={700} className="ml-4">
            YourApp
          </Text> */}
        </div>
      </div>
      <Drawer
        opened={opened}
        onClose={close}
        title=""
        padding="xl"
        size="sm"
        position="left"
      >
        <div className="flex flex-col space-y-4 mt-4">
          {sidebarItems.map((item, index) => (
            <UnstyledButton
              key={index}
              className="p-3 hover:bg-gray-100 rounded-md flex items-center gap-3"
              onClick={() => {
                router.push(item.link);
                close();
              }}
            >
              {React.createElement(item.icon)}
              <Text>{item.label}</Text>
            </UnstyledButton>
          ))}

          <UnstyledButton
            className="p-3 hover:bg-gray-100 rounded-md flex items-center gap-3"
            onClick={handleLogout}
          >
            <IconLogout />
            <Text>Logout</Text>
          </UnstyledButton>
        </div>
      </Drawer>
    </>
  );
}

export default index;
