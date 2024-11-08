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
import { useEffect, useRef, useState } from "react";
import { z } from "zod";
import { indianStates } from "@/lib/constants";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import PageMainWrapper from "@/components/common/PageMainWrapper";
import BrandingForm from "./BrandingForm";
import ContactForm from "./BusinessForm";
import QRForm from "./QRForm";
import WebForm from "./WebForm";
import BusinessForm from "./BusinessForm";
import BasicForm from "./BasicForm";

const AddStoreForm = ({ form, createStore }) => {
  const router = useRouter();

  const [active, setActive] = useState(0);

  const nextStep = () =>
    setActive((current) => (current < 5 ? current + 1 : current));
  const prevStep = () =>
    setActive((current) => (current > 0 ? current - 1 : current));

  useEffect(() => {
    scrollTo(0, 0);
  }, [active]);

  return (
    <>
      <div className="bg-white w-fulal mt-5 page-main-wrapper p-[20px] mb-20">
        <form
          onSubmit={form.onSubmit(() => {
            createStore.mutate(form);
          })}
        >
          <Paper>
            <Stack spacing="xl">
              <Stepper
                active={active}
                // onStepClick={setActive}
                completedIcon={
                  <IconCircleCheck
                    style={{ width: rem(18), height: rem(18) }}
                  />
                }
              >
                <Stepper.Step
                  label="Basic Information"
                  description="Provide store information"
                >
                  <BasicForm
                    form={form}
                    active={active}
                    nextStep={nextStep}
                    prevStep={prevStep}
                  />
                </Stepper.Step>
                <Stepper.Step
                  label="Business Details"
                  description="Provide business details"
                >
                  <BusinessForm
                    form={form}
                    active={active}
                    nextStep={nextStep}
                    prevStep={prevStep}
                  />
                </Stepper.Step>
                <Stepper.Step
                  label="QR Code Setup"
                  description="Design your QR"
                >
                  <QRForm
                    form={form}
                    active={active}
                    nextStep={nextStep}
                    prevStep={prevStep}
                  />
                </Stepper.Step>
                <Stepper.Step
                  label="Website Setup"
                  description="Customize website"
                >
                  <WebForm
                    form={form}
                    active={active}
                    nextStep={nextStep}
                    prevStep={prevStep}
                  />
                </Stepper.Step>

                <Stepper.Step label="Payment" description="Get full access">
                  <Group mt="md">
                    <Button
                      onClick={() => {
                        createStore.mutate(form);
                      }}
                      w={200}
                    >
                      Create
                    </Button>
                  </Group>
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
