import { rem } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconExclamationCircle } from "@tabler/icons-react";

const DEFAULT_AUTO_CLOSE_TIME = 5000;

function success(message: string, title: string = "Success") {
  return notifications.show({
    title: title,
    color: "green",
    message: message,
    icon: <IconCheck stroke={2} style={{ width: rem(18), height: rem(18) }} />,
    withBorder: true,
    autoClose: DEFAULT_AUTO_CLOSE_TIME,
  });
}

function error(message: string, title: string = "Error") {
  return notifications.show({
    title: title || `Error`,
    color: "#C8102E",
    message: message,
    icon: (
      <IconExclamationCircle
        stroke={2}
        style={{ width: rem(18), height: rem(18) }}
      />
    ),
    withBorder: true,
    autoClose: DEFAULT_AUTO_CLOSE_TIME,
  });
}

function warn(message: string, title: string = "Warning") {
  return notifications.show({
    title: title || `Warning`,
    color: "yellow",
    message: message,
    icon: (
      <IconExclamationCircle
        stroke={2}
        style={{ width: rem(18), height: rem(18) }}
      />
    ),
    withBorder: true,
    autoClose: DEFAULT_AUTO_CLOSE_TIME,
  });
}

export function usePageNotifications() {
  return { success, error, warn };
}
