import { usePageNotifications } from "@/lib/hooks/useNotifications";
import callApi from "@/services/apiService";
import { TextInput, Grid, Text, Button } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { z } from "zod";

const bankingSchema = z.object({
  accountHolderName: z.string().min(1, "Account holder name is required"),
  accountNumber: z.string().min(1, "Account number is required"),
  bankName: z.string().min(1, "Bank name is required"),
  branchCode: z.string().min(1, "Branch code is required"),
  routingNumber: z.string().min(1, "Routing number is required"), // Added routing number validation
  swiftCode: z.string().optional(),
  taxId: z.string().optional(),
});

function BankingForm() {
  const notifications: any = usePageNotifications();
  const bankingForm = useForm({
    validate: zodResolver(bankingSchema),
    initialValues: {
      accountHolderName: "tarun",
      accountNumber: "274HGE73WUI",
      bankName: "",
      branchCode: "",
      routingNumber: "123456789", // Added routing number
      swiftCode: "",
      taxId: "", // Left empty as no value was provided
    },
    validateInputOnChange: true,
  });

  const getPaymentInfo = useQuery({
    queryKey: ["get-payment-info"],
    queryFn: async () => {
      const response = await callApi.get(`/payment-info`);
      return response;
    },
    select: (data) => data?.data,
  });

  useEffect(() => {
    if (getPaymentInfo?.data) {
      bankingForm.setValues({
        accountHolderName: getPaymentInfo?.data?.account_holder_name,
        accountNumber: getPaymentInfo?.data?.account_number,
        bankName: getPaymentInfo?.data?.bank_name,
        branchCode: getPaymentInfo?.data?.branch_code,
        routingNumber: getPaymentInfo?.data?.routing_number,
        swiftCode: getPaymentInfo?.data?.swift_code,
        taxId: getPaymentInfo?.data?.tax_id,
      });
      bankingForm.resetDirty();
    }
  }, [getPaymentInfo?.data]);

  const updatePaymentInfo = useMutation({
    mutationFn: async () => {
      if (getPaymentInfo?.data) {
        const response = await callApi.patch(
          "/payment-info",
          bankingForm.values
        );
        return response.data;
      } else {
        const response = await callApi.post(
          "/payment-info",
          bankingForm.values
        );
        return response.data;
      }
    },
    onSuccess: () => {
      notifications.success("Payment info updated successfully");
      getPaymentInfo.refetch();
    },
    onError: () => {
      notifications.error("Payment info update failed");
    },
  });
  console.log(getPaymentInfo?.data, "getPaymentInfo");

  const isButtonEnabled = bankingForm.isValid() && bankingForm.isDirty();

  return (
    <form onSubmit={bankingForm.onSubmit(() => updatePaymentInfo.mutate())}>
      <Grid mt="xl">
        <Grid.Col span={12}>
          <Text fw={600}>Banking Details</Text>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6 }}>
          <TextInput
            label="Account Holder Name"
            placeholder="Enter account holder name"
            {...bankingForm.getInputProps("accountHolderName")}
          />
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6 }}>
          <TextInput
            label="Account Number"
            placeholder="Enter account number"
            {...bankingForm.getInputProps("accountNumber")}
          />
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6 }}>
          <TextInput
            label="Bank Name"
            placeholder="Enter bank name"
            {...bankingForm.getInputProps("bankName")}
          />
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6 }}>
          <TextInput
            label="Branch Code"
            placeholder="Enter branch code"
            {...bankingForm.getInputProps("branchCode")}
          />
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6 }}>
          <TextInput
            label="Routing Number"
            placeholder="Enter routing number"
            {...bankingForm.getInputProps("routingNumber")}
          />
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6 }}>
          <TextInput
            label="SWIFT Code (Optional)"
            placeholder="Enter SWIFT code"
            {...bankingForm.getInputProps("swiftCode")}
          />
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6 }}>
          <TextInput
            label="Tax ID (Optional)"
            placeholder="Enter tax ID"
            {...bankingForm.getInputProps("taxId")}
          />
        </Grid.Col>
      </Grid>

      <Button
        type="submit"
        mt={20}
        disabled={!isButtonEnabled}
        loading={updatePaymentInfo.isPending}
      >
        Save Banking Details
      </Button>
    </form>
  );
}

export default BankingForm;
