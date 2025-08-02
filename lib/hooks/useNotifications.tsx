import { MantineTheme, rem } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconExclamationCircle, IconX } from "@tabler/icons-react";

const DEFAULT_AUTO_CLOSE_TIME = 5000;

const baseStyles = (theme: MantineTheme) => ({
  root: {
    backgroundColor: theme.white,
    borderRadius: theme.radius.lg,
    border: `1px solid ${theme.colors.gray[2]}`,
    boxShadow: theme.shadows.lg,
    padding: rem(16),
  },
  title: {
    fontWeight: 600,
    fontSize: theme.fontSizes.md,
  },
  description: {
    color: theme.colors.gray[7],
    fontSize: theme.fontSizes.sm,
  },
  closeButton: {
    color: theme.colors.gray[6],
    "&:hover": {
      backgroundColor: theme.colors.gray[0],
    },
  },
  icon: {
    width: rem(40),
    height: rem(40),
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: theme.white,
  },
});

function success(message: string, title: string = "Success") {
  return notifications.show({
    title: title,
    message: message,
    icon: <IconCheck stroke={2} />,
    autoClose: DEFAULT_AUTO_CLOSE_TIME,
    styles: (theme) => {
      const base = baseStyles(theme);
      return {
        ...base,
        icon: {
          ...base.icon,
          backgroundColor: theme.colors.green[6],
        },
      };
    },
  });
}

function error(message: string, title: string = "Error") {
  return notifications.show({
    title: title || `Error`,
    message: message,
    icon: <IconX stroke={2} />,
    autoClose: DEFAULT_AUTO_CLOSE_TIME,
    styles: (theme) => {
      const base = baseStyles(theme);
      return {
        ...base,
        icon: {
          ...base.icon,
          backgroundColor: theme.colors.red[6],
        },
      };
    },
  });
}

function warn(message: string, title: string = "Warning") {
  return notifications.show({
    title: title || `Warning`,
    message: message,
    icon: <IconExclamationCircle stroke={2} />,
    autoClose: DEFAULT_AUTO_CLOSE_TIME,
    styles: (theme) => {
      const base = baseStyles(theme);
      return {
        ...base,
        icon: {
          ...base.icon,
          backgroundColor: theme.colors.yellow[6],
        },
      };
    },
  });
}

export function usePageNotifications() {
  return { success, error, warn };
}
