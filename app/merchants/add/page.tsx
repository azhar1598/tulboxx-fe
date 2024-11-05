"use client";
import { PageHeader } from "@/components/common/PageHeader";
import React from "react";
import MerchantForm from "./MerchantForm";
import PageMainWrapper from "@/components/common/PageMainWrapper";

function page() {
  return (
    <>
      <PageHeader title={"Create Merchant"} />
      <PageMainWrapper>
        <MerchantForm />
      </PageMainWrapper>
    </>
  );
}

export default page;
