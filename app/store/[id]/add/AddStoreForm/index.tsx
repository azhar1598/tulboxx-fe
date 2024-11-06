"use client";
import { useForm, zodResolver } from "@mantine/form";
import { TimeInput } from "@mantine/dates";
import {
  TextInput,
  Textarea,
  Select,
  FileInput,
  Group,
  Button,
  Box,
  Paper,
  Title,
  Grid,
  Stack,
  Image,
  CloseButton,
  SimpleGrid,
  Text,
  ColorInput,
  Flex,
  Container,
  Card,
  Divider,
  ThemeIcon,
  rem,
  Stepper,
} from "@mantine/core";
import {
  IconBuilding,
  IconUpload,
  IconPhoto,
  IconUser,
  IconPhone,
  IconMail,
  IconClock,
  IconMapPin,
  IconPalette,
  IconPower,
  IconCircleCheck,
} from "@tabler/icons-react";
import { useRef, useState } from "react";
import { z } from "zod";
import { indianStates } from "@/lib/constants";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import PageMainWrapper from "@/components/common/PageMainWrapper";
import BrandingForm from "./BrandingForm";
import ContactForm from "./ContactForm";
import QRForm from "./QRForm";
import WebForm from "./WebForm";

const AddStoreForm = ({ form }) => {
  const router = useRouter();

  const [active, setActive] = useState(1);
  const nextStep = () =>
    setActive((current) => (current < 3 ? current + 1 : current));
  const prevStep = () =>
    setActive((current) => (current > 0 ? current - 1 : current));

  return (
    <>
      <div className="bg-white w-fulal mt-5 page-main-wrapper p-[20px]">
        <form onSubmit={form.onSubmit((values) => console.log(values))}>
          <Paper>
            <Stack spacing="xl">
              <Stepper
                active={active}
                onStepClick={setActive}
                completedIcon={
                  <IconCircleCheck
                    style={{ width: rem(18), height: rem(18) }}
                  />
                }
              >
                <Stepper.Step
                  label="Basic Information"
                  description="Create an account"
                >
                  {/* Basic Information */}
                  <Box p={10}>
                    <Divider mb="md" />

                    <Grid>
                      <Grid.Col span={{ base: 12, md: 6 }}>
                        <TextInput
                          label="Store Name"
                          placeholder="Enter store name"
                          icon={<IconBuilding size="1rem" />}
                          {...form.getInputProps("name")}
                          withAsterisk
                        />
                      </Grid.Col>
                      <Grid.Col span={{ base: 12, md: 6 }}>
                        <Select
                          label="Category"
                          placeholder="Select store category"
                          data={[
                            { value: "restaurant", label: "Restaurant" },
                            { value: "retail", label: "Retail" },
                            { value: "grocery", label: "Grocery" },
                            { value: "electronics", label: "Electronics" },
                            { value: "fashion", label: "Fashion" },
                          ]}
                          {...form.getInputProps("category")}
                          withAsterisk
                        />
                      </Grid.Col>
                      <Grid.Col span={{ base: 12, md: 12 }}>
                        <TextInput
                          label="Store Tagline"
                          placeholder="Enter store tagline"
                          icon={<IconBuilding size="1rem" />}
                          {...form.getInputProps("tagline")}
                        />
                      </Grid.Col>
                      <Grid.Col span={{ base: 12, md: 12 }}>
                        <Textarea
                          label="Store Description"
                          placeholder="Enter store description"
                          icon={<IconBuilding size="1rem" />}
                          {...form.getInputProps("description")}
                        />
                      </Grid.Col>
                    </Grid>
                    <Group justify="center" mt="xl">
                      <Button variant="default" onClick={prevStep}>
                        Back
                      </Button>
                      <Button onClick={nextStep}>Next step</Button>
                    </Group>
                  </Box>
                </Stepper.Step>
                <Stepper.Step label="QR Preview" description="Verify email">
                  <QRForm form={form} />
                </Stepper.Step>
                <Stepper.Step label="Web Preview" description="Verify email">
                  <WebForm form={form} />
                </Stepper.Step>
                <Stepper.Step
                  label="Business Hours"
                  description="Get full access"
                >
                  <ContactForm form={form} />
                </Stepper.Step>
                <Stepper.Step label="Payment" description="Get full access">
                  <ContactForm form={form} />
                </Stepper.Step>
                <Stepper.Completed>
                  Completed, click back button to get to previous step
                </Stepper.Completed>
              </Stepper>
            </Stack>
          </Paper>
        </form>
      </div>
      {/* <PageMainWrapper> */}
      {/* <Card radius="md" p={0}> */}

      {/* </Card> */}
      {/* </PageMainWrapper> */}
    </>
  );
};

export default AddStoreForm;
