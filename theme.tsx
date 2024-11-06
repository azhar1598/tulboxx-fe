"use client";

import {
  Button,
  createTheme,
  Input,
  InputBase,
  NumberInput,
  Select,
  Textarea,
  TextInput,
} from "@mantine/core";
import classes from "@/styles/default.module.css";
import {
  IconArrowDown,
  IconCaretDown,
  IconCaretDownFilled,
  IconChevronDown,
} from "@tabler/icons-react";

export const theme = createTheme({
  colors: {
    paleIndigo: [
      "#f1f1ff",
      "#e0dff2",
      "#bfbdde",
      "#9b98ca",
      "#7d79b9",
      "#6a66af",
      "#605cac",
      "#504c97",
      "#464388",
      "#3b3979",
    ],
  },
  components: {
    Input: Input.extend({
      classNames: {
        input: classes.input,
      },
    }),

    Textarea: Textarea.extend({
      classNames: {
        input: classes.text_area,
        label: "",
        required: "",
      },
    }),

    TextInput: TextInput.extend({
      classNames: {
        input: classes.text_input,
        label: classes.text_input_label,
        required: "",
      },
    }),
    NumberInput: NumberInput.extend({
      classNames: {
        input: classes.number_input,
        label: classes.number_input_label,
        required: "",
      },
    }),
    InputBase: InputBase.extend({
      classNames: {
        input: classes.input_base,
        label: "",
        required: "",
      },
    }),

    Select: Select.extend({
      classNames: {
        input: classes.select_input,
        label: classes.select_input_label,
        groupLabel: "",
        required: "",
        options: classes.select_options,
      },
      defaultProps: {
        rightSection: <IconChevronDown stroke={2} width={14} height={180} />,
        withCheckIcon: false,
        withScrollArea: true,
        maxDropdownHeight: 200,

        // popover: {
        // backgroundColor: "red",
        // },

        comboboxProps: {
          position: "bottom",
          middlewares: { flip: false, shift: false },
          dropdownPadding: 0,
          offset: 0,
        },
      },
    }),

    Button: Button.extend({
      classNames: { root: classes.button },
    }),
  },
});
