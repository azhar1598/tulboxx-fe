"use client";
import { useForm, zodResolver } from "@mantine/form";
import { z } from "zod";
import { useSearchParams, useParams, useRouter } from "next/navigation";

import { PageHeader } from "@/components/common/PageHeader";

import InvoiceForm from "./InvoiceForm";
import { Paper } from "@mantine/core";
import { Stack } from "@mantine/core";
import PageMainWrapper from "@/components/common/PageMainWrapper";
import callApi from "@/services/apiService";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useContext, useEffect } from "react";
import { UserContext } from "@/app/layout";
import { usePageNotifications } from "@/lib/hooks/useNotifications";

const invoiceSchema = z.object({
  issueDate: z.date(),
  dueDate: z.date(),
  invoiceTotalAmount: z.number().min(1, "Total amount is required"),
  lineItems: z.array(
    z.object({
      description: z.string().min(1, "Description is required"),
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
  customerName: z.string().min(1, "Customer name is required"),
  email: z.string().min(1, "Customer email is required"),
  phone: z.string().min(1, "Customer phone is required"),
  projectId: z.string(),
});

const InvoiceFormPage = () => {
  const form = useForm({
    validate: zodResolver(invoiceSchema),
    initialValues: {
      issueDate: new Date(),
      dueDate: null,
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
      const response = await callApi.get(`/estimates/${id}`);
      return response.data;
    },
  });

  const user = useContext(UserContext);
  console.log(getSingleProject.data, "getSingleProject.data");

  const generateInvoice = useMutation({
    mutationFn: () => callApi.post(`/invoices`, form.values),
    onSuccess: async (res: any) => {
      const { data } = res;

      // router.push(`/invoices`);
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
        remitPayment: {
          accountName: user?.user_metadata?.name,
          accountNumber: user?.accountNumber || "234234234",
          routingNumber: user?.routingNumber || "111000025 ",
          taxId: user?.taxId || "TXN8263",
        },
        customerName: getSingleProject.data?.customerName,
        email: getSingleProject.data?.email,
        phone: getSingleProject.data?.phone,
        projectId: getSingleProject.data?.id,
        projectName: getSingleProject.data?.projectName,
      });
    }
  }, [getSingleProject.data]);

  console.log(form.values, "parsed.values", form.isValid);

  return (
    <Stack>
      {" "}
      <PageHeader
        title={`Generate Invoice:${getSingleProject.data?.projectName}`}
      />
      <PageMainWrapper w="100%">
        <form onSubmit={form.onSubmit(() => generateInvoice.mutate())}>
          <InvoiceForm form={form} generateInvoice={generateInvoice} />
        </form>
      </PageMainWrapper>
    </Stack>
  );
};

export default InvoiceFormPage;
