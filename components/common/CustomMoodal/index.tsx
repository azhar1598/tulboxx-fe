import { Modal, ModalProps } from "@mantine/core";
import React from "react";

interface CustomModalProps extends Omit<ModalProps, "opened" | "onClose"> {
  opened: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const CustomModal: React.FC<CustomModalProps> = ({
  opened,
  onClose,
  title,
  children,
  ...rest
}) => {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={title}
      styles={{
        content: {
          borderRadius: "8px",
          boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.1)",
        },
        header: {
          padding: "10px",
          borderBottom: "1px solid #e9ecef",
          backgroundColor: "#182a4d",
        },
        title: {
          fontWeight: 600,
          fontSize: "1rem",
          color: "white",
        },
        close: {
          color: "white",
          "&:hover": {
            backgroundColor: "rgba(255, 255, 255, 0.1)",
          },
        },
        body: {
          padding: "1.5rem",
        },
      }}
      {...rest}
    >
      {children}
    </Modal>
  );
};

export default CustomModal;
