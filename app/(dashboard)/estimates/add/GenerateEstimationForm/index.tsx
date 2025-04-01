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
  IconPlus,
} from "@tabler/icons-react";
import { useContext, useEffect, useRef, useState } from "react";
import { z } from "zod";
import { indianStates } from "@/lib/constants";
import { useRouter, useSearchParams } from "next/navigation";

import PageMainWrapper from "@/components/common/PageMainWrapper";
// import ContactForm from "./BusinessForm";
// import QRForm from "./QRForm";
// import WebForm from "./WebForm";
// import BusinessForm from "./BusinessForm";
import BasicForm from "./BasicForm";
import { useMutation } from "@tanstack/react-query";
import callApi from "@/services/apiService";
import { usePageNotifications } from "@/lib/hooks/useNotifications";
import ProjectForm from "./ProjectForm";
import AdditionalForm from "./AdditionalForm";
import axios from "axios";
import { UserContext } from "@/app/layout";

const GenerateEstimationForm = ({ form }) => {
  const router = useRouter();

  const [active, setActive] = useState(0);
  const notification = usePageNotifications();

  const nextStep = () =>
    setActive((current) => (current < 5 ? current + 1 : current));
  const prevStep = () =>
    setActive((current) => (current > 0 ? current - 1 : current));

  useEffect(() => {
    scrollTo(0, 0);
  }, [active]);

  const objectToFormData = (
    obj: any,
    formData = new FormData(),
    parentKey = ""
  ) => {
    if (obj && typeof obj === "object" && !(obj instanceof File)) {
      Object.keys(obj).forEach((key) => {
        const fullKey = parentKey ? `${parentKey}[${key}]` : key;

        // Check if the key is 'menuImages' to append all values under the same key

        objectToFormData(obj[key], formData, fullKey);
      });
    } else {
      // Only append if the value is not an empty string
      if (obj !== "") {
        formData.append(parentKey, obj);
      }
    }
    return formData;
  };

  const user = useContext(UserContext);

  useEffect(() => {
    form.setFieldValue("user_id", user?.id);
  }, [user]);

  console.log("formuser", user, form.values.userId);

  const generateEstimation = useMutation({
    mutationFn: () => callApi.post(`/estimates`, form.values),
    onSuccess: async (res: any) => {
      const { data } = res;
      console.log("data", data);
      router.push(`/estimates/preview/${data.estimate.id}`);
      notification.success(`Estimate created successfully`);
    },
    onError: (err: Error) => {
      // notification.error(err);

      console.log(err.message);
    },
  });

  const payload = {
    projectName: "Missouri Drainage System",
    customerName: "Azhar Mohammed",
    email: "mohammedazhar.1598@gmail.com",
    phone: 9182289773,
    address: "Astalaxmi Nilayam, Flat No.G1, Kaviraj Nagar Street No.6",
    type: "residential",
    serviceType: "Drainage",
    problemDescription: "Installing a drainage system to prevent yard flooding",
    solutionDescription: "Drainage ",
    projectEstimate: 2000,
    projectStartDate: "2025-03-11T18:30:00.000Z",
    projectEndDate: "2025-03-27T18:30:00.000Z",
    lineItems: [
      {
        id: 1,
        description: "Shoes and Gloves, Gravel",
        quantity: 1,
        unitPrice: 2000,
        totalPrice: 2000,
      },
    ],
    equipmentMaterials: "",
    additionalNotes: "",
  };

  return (
    <>
      <div className="bg-white w-fulal mt-5 page-main-wrapper p-[20px] mb-20">
        <Paper>
          <Stack gap="xl">
            <form
              onSubmit={form.onSubmit(() => {
                const newFormValues = structuredClone(form.values);
                const formData = objectToFormData(newFormValues);

                generateEstimation.mutate(formData);
              })}
            >
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
                  label="General Info"
                  description="Provide Basic Information"
                >
                  <BasicForm
                    form={form}
                    active={active}
                    nextStep={nextStep}
                    prevStep={prevStep}
                  />
                </Stepper.Step>
                <Stepper.Step
                  label="Project Description"
                  description="Tell us more about the project you’re working on"
                >
                  <ProjectForm
                    form={form}
                    activeStep={active}
                    nextStep={nextStep}
                    prevStep={prevStep}
                  />
                </Stepper.Step>

                <Stepper.Step
                  label="Additional Info"
                  description="Almost done, just a few more questions"
                >
                  <AdditionalForm
                    form={form}
                    activeStep={active}
                    nextStep={nextStep}
                    prevStep={prevStep}
                    generateEstimation={generateEstimation}
                  />
                </Stepper.Step>

                <Stepper.Completed>
                  Completed, click back buttons to get to previous step
                </Stepper.Completed>
              </Stepper>
            </form>
          </Stack>
        </Paper>
      </div>
      {/* <PageMainWrapper> */}
      {/* <Card radius="md" p={0}> */}

      {/* </Card> */}
      {/* </PageMainWrapper> */}
    </>
  );
};

export default GenerateEstimationForm;
