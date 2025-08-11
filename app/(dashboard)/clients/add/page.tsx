"use client";
import { PageHeader } from "@/components/common/PageHeader";
import React from "react";
import PageMainWrapper from "@/components/common/PageMainWrapper";
import MainLayout from "@/components/common/MainLayout";
import ClientForm from "./ClientForm";

function page() {
  return (
    <>
      <PageHeader title={"Create Client"} />
      <PageMainWrapper w="full">
        <ClientForm clientPage={true} />
      </PageMainWrapper>
    </>
  );
}

export default page;
