"use client";
import { PageHeader } from "@/components/common/PageHeader";
import React from "react";
import PageMainWrapper from "@/components/common/PageMainWrapper";
import MainLayout from "@/components/common/MainLayout";
import ReviewStoreForm from "./ReviewStoreForm";

function page() {
  return (
    <>
      <PageHeader title={"Create Review Store"} />
      <PageMainWrapper>
        <ReviewStoreForm />
      </PageMainWrapper>
    </>
  );
}

export default page;
