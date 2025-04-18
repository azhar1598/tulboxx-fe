"use client";
import { useForm, zodResolver } from "@mantine/form";
import { z } from "zod";
import { useSearchParams, useParams, useRouter } from "next/navigation";

import { PageHeader } from "@/components/common/PageHeader";

import InvoiceForm from "./InvoiceForm";
import { Modal, Paper } from "@mantine/core";
import { Stack } from "@mantine/core";
import PageMainWrapper from "@/components/common/PageMainWrapper";
import callApi from "@/services/apiService";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "@/app/layout";
import { usePageNotifications } from "@/lib/hooks/useNotifications";
import dayjs from "dayjs";
import ClientForm from "@/app/(dashboard)/clients/add/ClientForm";

const baseInvoiceSchema = {
  issueDate: z.date(),
  dueDate: z.date(),
  invoiceTotalAmount: z.number(),
  lineItems: z.array(
    z.object({
      description: z.string(),
      quantity: z.number(),
      unitPrice: z.number(),
      totalPrice: z.number(),
    })
  ),
  invoiceSummary: z.string().optional(),
  remitPayment: z.object({
    accountName: z.string(),
    accountNumber: z.string(),
    routingNumber: z.string(),
    taxId: z.string().optional(),
  }),
  customerName: z.string(),
  email: z.string(),
  phone: z.string(),
  projectId: z.string().optional(),
  user_id: z.string(),
  clientId: z.string().min(1, "Client id is required"),
};

const invoiceSchema = z.discriminatedUnion("status", [
  // Draft schema - all fields are allowed as is
  z.object({
    ...baseInvoiceSchema,
    status: z.literal("draft"),
  }),
  // Final schema - with all validations
  z.object({
    issueDate: z.date(),
    dueDate: z.date(),
    invoiceTotalAmount: z.number().min(1, "Total amount is required"),
    lineItems: z.array(
      z.object({
        description: z.string().optional(),
        quantity: z.number().min(1, "Quantity is required"),
        unitPrice: z.number().min(1, "Unit price is required"),
        totalPrice: z.number().min(1, "Total price is required"),
      })
    ),
    invoiceSummary: z.string().optional(),
    remitPayment: z.object({
      accountName: z.string().min(1, "Account name is required"),
      accountNumber: z.string().min(1, "Account number is required"),
      routingNumber: z.string().min(1, "Routing number is required"),
      taxId: z.string().optional(),
    }),

    projectId: z.string().optional().nullable(),
    user_id: z.string().min(1, "User id is required"),
    status: z.literal("unpaid"),
    clientId: z.string().min(1, "Client id is required"),
  }),
]);

const InvoiceFormPage = () => {
  const form = useForm({
    validate: zodResolver(invoiceSchema),
    initialValues: {
      issueDate: new Date(),
      dueDate: new Date(),
      invoiceTotalAmount: 0,
      lineItems: [
        {
          id: 1,
          description: "",
          quantity: 0,
          unitPrice: 0,
          totalPrice: 0,
        },
      ],
      invoiceSummary: "",
      remitPayment: {
        accountName: "tarun",
        accountNumber: "274HGE73WUI",
        routingNumber: "123456789",
        taxId: "TXN274GH",
      },
      customerName: "",
      email: "",
      phone: "",
      projectName: "",
      user_id: "",
      status: "unpaid",
      clientId: "",
    },
    validateInputOnChange: true,
  });

  const router = useRouter();
  const notification = usePageNotifications();

  const params = useParams();
  const id = params.projectid as string;

  const getSingleProject = useQuery({
    queryKey: ["get-single-project", id],
    queryFn: async () => {
      if (id === "standalone") {
        return null;
      }
      const response = await callApi.get(`/estimates/${id}`);
      return response.data;
    },
  });

  const user = useContext(UserContext);

  console.log("form.valies", form.values);

  const generateInvoice = useMutation({
    mutationFn: () => callApi.post(`/invoices`, form.values),
    onSuccess: async (res: any) => {
      const { data } = res;

      router.push(`/invoices`);
      notification.success(`Invoice created successfully`);
    },
    onError: (err: Error) => {
      notification.error(err.message);

      console.log(err.message);
    },
  });

  useEffect(() => {
    if (getSingleProject.data) {
      form.setValues({
        clientId: getSingleProject.data?.clients?.id,
        remitPayment: {
          accountName: user?.user_metadata?.name,
          accountNumber: user?.accountNumber || "234234234",
          routingNumber: user?.routingNumber || "111000025 ",
          taxId: user?.taxId || "TXN8263",
        },
        customerName: getSingleProject.data?.clients?.name,
        email: getSingleProject.data?.clients?.email,
        phone: getSingleProject.data?.clients?.phone,
        projectId: getSingleProject.data?.id,
        projectName: getSingleProject.data?.projectName,
        issueDate: dayjs(getSingleProject.data?.projectStartDate).toDate(),
        dueDate: dayjs(getSingleProject.data?.projectEndDate).toDate(),
        invoiceTotalAmount: getSingleProject.data?.total_amount,
        lineItems: getSingleProject.data?.lineItems,
        invoiceSummary: getSingleProject.data?.solutionDescription,
      });
    }
  }, [getSingleProject.data]);

  useEffect(() => {
    form.setFieldValue("user_id", user?.id);
  }, [user]);

  console.log(
    getSingleProject.data,
    "here is",
    invoiceSchema.safeParse(form.values)
  );

  console.log(
    "form.values",
    form.values,
    form.errors,
    invoiceSchema.safeParse(form.values)
  );

  const isButtonEnabled =
    form.isValid() && form.isDirty() && Object.keys(form.errors).length === 0;

  const [clientModalOpened, setClientModalOpened] = useState(false);

  console.log("isButtonEnabled", isButtonEnabled, form.errors);

  return (
    <Stack>
      {" "}
      <PageHeader
        title={`Generate Invoice:${
          getSingleProject.data?.projectName || "Standalone Invoice"
        }`}
      />
      <PageMainWrapper w="100%">
        <form onSubmit={form.onSubmit(() => generateInvoice.mutate())}>
          <InvoiceForm
            form={form}
            generateInvoice={generateInvoice}
            isButtonEnabled={isButtonEnabled}
            setClientModalOpened={setClientModalOpened}
            id={id}
          />
        </form>
      </PageMainWrapper>
      <Modal
        opened={clientModalOpened}
        onClose={() => setClientModalOpened(false)}
        title="Create New Client"
        size="md"
      >
        <ClientForm
          md={12}
          setClientModalOpened={setClientModalOpened}
          invoiceForm={form}
        />
      </Modal>
    </Stack>
  );
};

export default InvoiceFormPage;
