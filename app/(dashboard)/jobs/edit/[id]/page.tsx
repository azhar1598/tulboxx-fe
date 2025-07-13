"use client";
import { PageHeader } from "@/components/common/PageHeader";
import React from "react";
import PageMainWrapper from "@/components/common/PageMainWrapper";
import MainLayout from "@/components/common/MainLayout";
import JobForm from "./JobForm";

function page() {
  return (
    <>
      <PageHeader title={"Edit Job"} />
      <PageMainWrapper w="full">
        <JobForm />
      </PageMainWrapper>
    </>
  );
}

export default page;
