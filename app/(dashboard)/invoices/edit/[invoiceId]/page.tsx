"use client";
import { useForm, zodResolver } from "@mantine/form";
import { z } from "zod";
import { useSearchParams, useParams, useRouter } from "next/navigation";

import { PageHeader } from "@/components/common/PageHeader";

import InvoiceForm from "./InvoiceForm";
import { Badge, Modal, Paper } from "@mantine/core";
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
  projectId: z.string().optional().nullable(),
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
  const form: any = useForm({
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
  const id = params.invoiceId as string;

  const getSingleInvoice = useQuery({
    queryKey: ["get-single-invoice", id],
    queryFn: async () => {
      if (id === "standalone") {
        return null;
      }
      const response = await callApi.get(`/invoices/${id}`);
      return response.data;
    },
  });

  const user = useContext(UserContext);

  console.log("form.valies", form.values);

  const generateInvoice = useMutation({
    mutationFn: (status) => {
      console.log("status", status);
      const payload = {
        ...form.values,
        status,
      };
      console.log("status---->", payload);
      return callApi.patch(`/invoices/${id}`, payload);
    },
    onSuccess: async (res: any) => {
      const { data } = res;
      const invoiceStatus = data.invoice.status; // Get status from response

      console.log("invoiceStatus", data.invoice.status, invoiceStatus);

      router.push(`/invoices`);
      if (invoiceStatus === "unpaid") {
        notification.success(`Invoice generated successfully`);
      } else {
        notification.success(`Invoice saved as draft successfully`);
      }
    },
    onError: (err: Error) => {
      notification.error(err.message);

      console.log(err.message);
    },
  });

  console.log("form.values", form.values);

  useEffect(() => {
    if (getSingleInvoice.data) {
      form.setValues({
        customerName: getSingleInvoice.data.customerName || "",
        email: getSingleInvoice.data.email || "",
        phone: getSingleInvoice.data.phone || "",
        projectId: getSingleInvoice.data.project_id,
        projectName: getSingleInvoice.data.projectName || "",
        issueDate: dayjs(getSingleInvoice.data.issue_date).toDate(),
        dueDate: dayjs(getSingleInvoice.data.due_date).toDate(),
        invoiceTotalAmount: getSingleInvoice.data.invoice_total_amount,
        lineItems: getSingleInvoice.data.line_items.map((item: any) => ({
          id: item.id,
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          totalPrice: item.totalPrice,
        })),
        invoiceSummary: getSingleInvoice.data.invoice_summary,
        status: getSingleInvoice.data.status,
        clientId: getSingleInvoice.data.client_id,
      });
    }
  }, [getSingleInvoice.data]);

  const getPaymentInfo = useQuery({
    queryKey: ["get-payment-info"],
    queryFn: async () => {
      const response = await callApi.get(`/payment-info`);
      return response;
    },
    select: (data) => data?.data,
  });

  useEffect(() => {
    if (getPaymentInfo.data) {
      form.setValues({
        remitPayment: {
          accountName: getPaymentInfo.data.account_holder_name,
          accountNumber: getPaymentInfo.data.account_number,
          routingNumber: getPaymentInfo.data.routing_number,
          taxId: getPaymentInfo.data.tax_id,
        },
      });
    }
  }, [getPaymentInfo.data]);

  useEffect(() => {
    form.setFieldValue("user_id", user?.id);
  }, [user]);

  console.log("form.values", invoiceSchema.safeParse(form.values));

  const isButtonEnabled =
    form.isValid() && form.isDirty() && Object.keys(form.errors).length === 0;

  const [clientModalOpened, setClientModalOpened] = useState(false);

  return (
    <Stack>
      {" "}
      <PageHeader
        title={`Generate Invoice:${
          getSingleInvoice.data?.project?.projectName || "Standalone Invoice"
        }`}
        leftSection={
          <Badge
            color={
              getSingleInvoice.data?.status === "unpaid"
                ? "red"
                : getSingleInvoice.data?.status === "paid"
                ? "green"
                : "gray"
            }
          >
            {getSingleInvoice.data?.status}
          </Badge>
        }
      />
      <PageMainWrapper w="100%">
        <form onSubmit={form.onSubmit(() => generateInvoice.mutate())}>
          <InvoiceForm
            form={form}
            generateInvoice={generateInvoice}
            isButtonEnabled={isButtonEnabled}
            getSingleInvoice={getSingleInvoice}
            setClientModalOpened={setClientModalOpened}
            id={id}
          />
        </form>
      </PageMainWrapper>
    </Stack>
  );
};

export default InvoiceFormPage;
